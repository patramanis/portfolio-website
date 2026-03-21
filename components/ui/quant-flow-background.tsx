"use client"

import { useEffect, useRef } from "react"

// ── Config ────────────────────────────────────────────────────────
const CELL_SIZE = 18              // px per grid cell
const CONTOUR_LEVELS = 10         // number of iso-lines
const MAX_ROT = 5                 // CSS perspective tilt (deg)
const ROT_LERP = 0.10             // tilt easing
const SCALE_BUFFER = 1.15         // scale to prevent edge gaps on tilt
const MOUSE_RADIUS = 200          // cursor influence radius (px)
const MOUSE_STRENGTH = 0.25       // field distortion near cursor
const MOUSE_LERP = 0.04           // smoothed cursor follow speed
const SCROLL_TILT_X = 3           // max forward tilt on scroll (deg)
const SCROLL_TILT_Y = 1.5         // max side tilt on scroll (deg)
const SCROLL_LERP = 0.06          // scroll tilt easing
const FRAME_INTERVAL = 33         // ~30fps throttle (ms)

// ── Scalar field (multi-octave trig → quant-style surface) ────────
function fieldValue(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 2.0 + t * 0.40) * Math.cos(y * 1.8 - t * 0.30) +
    Math.sin(x * 3.5 - y * 2.8 + t * 0.25) * 0.6 +
    Math.cos(x * 1.2 + y * 3.2 + t * 0.35) * 0.5 +
    Math.sin(x * 0.8 - t * 0.15) * Math.cos(y * 0.6 + t * 0.20) * 0.7
  ) * 0.25
}

// ── Marching squares edge table ───────────────────────────────────
// Corner bits: TL=8 TR=4 BR=2 BL=1
// Edges: 0=top 1=right 2=bottom 3=left
const MS: number[][] = [
  [], [3, 2], [2, 1], [3, 1],       // 0-3
  [1, 0], [1, 0, 3, 2], [2, 0], [3, 0],       // 4-7
  [0, 3], [0, 2], [0, 3, 2, 1], [0, 1],       // 8-11
  [1, 3], [1, 2], [2, 3], [],            // 12-15
]

// Neighbor traversal: exit edge → neighbor's entry edge, row/col offset
const NEIGHBOR_EDGE = [2, 3, 0, 1]  // top↔bottom, right↔left
const DR = [-1, 0, 1, 0]
const DC = [0, 1, 0, -1]

// ── Component ─────────────────────────────────────────────────────
export function QuantFlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext("2d")
    if (!ctx) return

    let raf: number
    let t = 0
    let mx = -9999, my = -9999          // raw mouse
    let smx = -9999, smy = -9999        // smoothed mouse (follows slowly)
    let rotX = 0, rotY = 0
    let scrollRotX = 0, scrollRotY = 0
    let scrollY = 0
    let W = 0, H = 0
    let cols = 0, rows = 0
    let field: Float64Array
    let cellCase: Uint8Array
    let edgeUsed: Uint8Array
    let lastFrame = 0

    // Reusable output for edge interpolation (zero allocation)
    let epx = 0, epy = 0

    function resize() {
      W = window.innerWidth; H = window.innerHeight
      cvs!.width = W; cvs!.height = H
      cols = Math.ceil(W / CELL_SIZE)
      rows = Math.ceil(H / CELL_SIZE)
      field = new Float64Array((cols + 1) * (rows + 1))
      cellCase = new Uint8Array(rows * cols)
      edgeUsed = new Uint8Array(rows * cols)
    }

    // Compute interpolated point on a cell edge (writes to epx, epy)
    function computeEdge(
      r: number, c: number, edge: number, iso: number,
      cw: number, ch: number, stride: number
    ) {
      const x0 = c * cw, y0 = r * ch
      const tl = field[r * stride + c]
      const tr = field[r * stride + c + 1]
      const br = field[(r + 1) * stride + c + 1]
      const bl = field[(r + 1) * stride + c]

      let v0: number, v1: number, ax: number, ay: number, bx: number, by: number
      switch (edge) {
        case 0: v0 = tl; v1 = tr; ax = x0; ay = y0; bx = x0 + cw; by = y0; break
        case 1: v0 = tr; v1 = br; ax = x0 + cw; ay = y0; bx = x0 + cw; by = y0 + ch; break
        case 2: v0 = bl; v1 = br; ax = x0; ay = y0 + ch; bx = x0 + cw; by = y0 + ch; break
        default: v0 = tl; v1 = bl; ax = x0; ay = y0; bx = x0; by = y0 + ch; break
      }

      const d = v1 - v0
      const f = Math.abs(d) < 1e-10 ? 0.5 : (iso - v0) / d
      epx = ax + f * (bx - ax)
      epy = ay + f * (by - ay)
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame)

      // ── 30fps throttle ──────────────────────────────────────────
      if (now - lastFrame < FRAME_INTERVAL) return
      lastFrame = now

      ctx!.clearRect(0, 0, W, H)
      t += 0.005

      // ── Smooth mouse position (slow, dynamic follow) ────────────
      if (mx > -999) {
        if (smx < -999) { smx = mx; smy = my }
        smx += (mx - smx) * MOUSE_LERP
        smy += (my - smy) * MOUSE_LERP
      } else {
        smx = -9999; smy = -9999
      }

      // ── CSS perspective tilt toward mouse + scroll ────────────────
      const tgtY = mx > -999 ? ((mx / W) - 0.5) * MAX_ROT * 2 : 0
      const tgtX = my > -999 ? ((my / H) - 0.5) * -MAX_ROT * 2 : 0
      rotX += (tgtX - rotX) * ROT_LERP
      rotY += (tgtY - rotY) * ROT_LERP

      // Scroll-based perspective: gentle forward tilt + slight side sway
      const scrollMax = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const scrollRatio = Math.min(scrollY / scrollMax, 1)
      const tgtScrollX = scrollRatio * SCROLL_TILT_X
      const tgtScrollY = Math.sin(scrollRatio * Math.PI) * SCROLL_TILT_Y
      scrollRotX += (tgtScrollX - scrollRotX) * SCROLL_LERP
      scrollRotY += (tgtScrollY - scrollRotY) * SCROLL_LERP

      cvs!.style.transform =
        `perspective(1400px) rotateX(${rotX + scrollRotX}deg) rotateY(${rotY + scrollRotY}deg) scale(${SCALE_BUFFER})`

      // ── Compute scalar field on grid ──────────────────────────
      const hasMouse = smx > -999
      const mrSq = MOUSE_RADIUS * MOUSE_RADIUS
      const stride = cols + 1
      const cw = W / cols, ch = H / rows
      let lo = Infinity, hi = -Infinity

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const px = c * cw, py = r * ch
          const nx = (c / cols - 0.5) * 5
          const ny = (r / rows - 0.5) * 5 * (H / W)

          let v = fieldValue(nx, ny, t)

          if (hasMouse) {
            const dx = px - smx, dy = py - smy
            const dSq = dx * dx + dy * dy
            if (dSq < mrSq) {
              const f = 1 - dSq / mrSq
              v += f * f * MOUSE_STRENGTH
            }
          }

          field[r * stride + c] = v
          if (v < lo) lo = v
          if (v > hi) hi = v
        }
      }

      const range = hi - lo
      if (range < 1e-8) return

      // ── Trace & draw contour iso-lines ──────────────────────────
      ctx!.lineCap = "round"
      ctx!.lineJoin = "round"

      for (let lv = 1; lv < CONTOUR_LEVELS; lv++) {
        const iso = lo + range * (lv / CONTOUR_LEVELS)
        const nrm = lv / CONTOUR_LEVELS
        const mid = Math.abs(nrm - 0.5) * 2
        const major = lv % 3 === 0

        const alpha = major
          ? 0.18 + (1 - mid) * 0.30
          : 0.10 + (1 - mid) * 0.20

        ctx!.strokeStyle = `rgba(255,255,255,${alpha})`
        ctx!.lineWidth = major ? 1.4 : 0.8

        // Classify all cells for this iso level
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const tl = field[r * stride + c]
            const tr = field[r * stride + c + 1]
            const br = field[(r + 1) * stride + c + 1]
            const bl = field[(r + 1) * stride + c]

            let ci = 0
            if (tl >= iso) ci |= 8
            if (tr >= iso) ci |= 4
            if (br >= iso) ci |= 2
            if (bl >= iso) ci |= 1

            cellCase[r * cols + c] = ci
          }
        }

        edgeUsed.fill(0)
        ctx!.beginPath()

        // Trace connected contour paths (no disconnected segments)
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c
            const ci = cellCase[idx]
            const edges = MS[ci]
            if (!edges.length) continue

            for (let s = 0; s < edges.length; s += 2) {
              const e1 = edges[s]
              if ((edgeUsed[idx] >> e1) & 1) continue

              // Start new polyline at e1
              computeEdge(r, c, e1, iso, cw, ch, stride)
              ctx!.moveTo(epx, epy)
              edgeUsed[idx] |= (1 << e1)

              // Trace forward from e2 through connected cells
              let cr = r, cc = c, ce = edges[s + 1]

              for (; ;) {
                const cidx = cr * cols + cc
                edgeUsed[cidx] |= (1 << ce)

                computeEdge(cr, cc, ce, iso, cw, ch, stride)
                ctx!.lineTo(epx, epy)

                // Cross to neighbor cell
                const nr = cr + DR[ce], nc = cc + DC[ce]
                const ne = NEIGHBOR_EDGE[ce]

                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) break

                const nidx = nr * cols + nc
                if ((edgeUsed[nidx] >> ne) & 1) break

                edgeUsed[nidx] |= (1 << ne)

                // Find exit edge from neighbor
                const nEdges = MS[cellCase[nidx]]
                let exit = -1
                for (let e = 0; e < nEdges.length; e += 2) {
                  if (nEdges[e] === ne) { exit = nEdges[e + 1]; break }
                  if (nEdges[e + 1] === ne) { exit = nEdges[e]; break }
                }

                if (exit === -1) break

                cr = nr; cc = nc; ce = exit
              }
            }
          }
        }
        ctx!.stroke()
      }
    }

    resize()
    raf = requestAnimationFrame(frame)

    const onResize = () => resize()
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    const onLeave = () => { mx = -9999; my = -9999 }
    const onScroll = () => { scrollY = window.scrollY }

    window.addEventListener("resize", onResize)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseleave", onLeave)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2, filter: "blur(5px)", opacity: 0.8 }}
    />
  )
}
