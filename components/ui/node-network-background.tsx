"use client"

import { useEffect, useRef } from "react"

const NODE_COUNT = 160
const MAX_DIST = 160
const BASE_SPEED = 0.11
const MOUSE_RADIUS = 140
const PULSE_INTERVAL = 700
const MAX_ROT = 5
const ROT_LERP = 0.10
const SCALE_BUFFER = 1.15

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number       // radius — varies widely for galaxy star look
  alpha: number   // individual base opacity
  phase: number
}

interface DataPulse {
  from: number
  to: number
  progress: number
  speed: number
}

export function NodeNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let lastPulseTime = 0
    let time = 0
    let mx = -9999
    let my = -9999
    let rotX = 0
    let rotY = 0

    let w = window.innerWidth
    let h = window.innerHeight
    const nodes: Node[] = []
    const pulses: DataPulse[] = []

    // Deferred resize: flag + pending dimensions — actual canvas resize
    // happens inside draw() so the clear+redraw land in the same frame (no blank flash).
    let needsResize = false
    let nextW = w
    let nextH = h

    function applyResize() {
      if (!needsResize) return
      needsResize = false
      const sx = nextW / w
      const sy = nextH / h
      // Proportionally redistribute nodes so they fill the new bounds evenly
      for (const n of nodes) {
        n.x *= sx
        n.y *= sy
      }
      w = nextW
      h = nextH
      canvas!.width = w
      canvas!.height = h
    }

    function init() {
      nodes.length = 0
      for (let i = 0; i < NODE_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = BASE_SPEED * (0.3 + Math.random() * 0.9)
        // Galaxy: 75% tiny dim stars, 20% medium, 5% bright anchor stars
        const roll = Math.random()
        let r: number
        let alpha: number
        if (roll < 0.75) {
          r = 0.4 + Math.random() * 0.7        // tiny
          alpha = 0.15 + Math.random() * 0.15  // dim
        } else if (roll < 0.95) {
          r = 1.0 + Math.random() * 0.8        // medium
          alpha = 0.28 + Math.random() * 0.18  // moderate
        } else {
          r = 1.8 + Math.random() * 1.2        // bright star
          alpha = 0.55 + Math.random() * 0.25  // vivid
        }
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r,
          alpha,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }

    function spawnPulse() {
      const a = Math.floor(Math.random() * nodes.length)
      let bestJ = -1
      let bestD = Infinity
      for (let j = 0; j < nodes.length; j++) {
        if (j === a) continue
        const dx = nodes[a].x - nodes[j].x
        const dy = nodes[a].y - nodes[j].y
        const d = dx * dx + dy * dy
        if (d < bestD && d < MAX_DIST * MAX_DIST) {
          bestD = d
          bestJ = j
        }
      }
      if (bestJ !== -1) {
        pulses.push({ from: a, to: bestJ, progress: 0, speed: 0.007 + Math.random() * 0.006 })
      }
    }

    function draw(ts: number) {
      animId = requestAnimationFrame(draw)
      applyResize()          // resize + scale nodes before clearing → no blank frame
      ctx!.clearRect(0, 0, w, h)
      time += 0.010

      // Smooth perspective tilt toward mouse position
      const targetRotY = mx > -999 ? ((mx / w) - 0.5) * MAX_ROT * 2 : 0
      const targetRotX = my > -999 ? ((my / h) - 0.5) * -MAX_ROT * 2 : 0
      rotX += (targetRotX - rotX) * ROT_LERP
      rotY += (targetRotY - rotY) * ROT_LERP
      canvas!.style.transform = `perspective(1400px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${SCALE_BUFFER})`

      // Spawn pulses
      if (ts - lastPulseTime > PULSE_INTERVAL) {
        spawnPulse()
        if (Math.random() < 0.5) spawnPulse()
        lastPulseTime = ts
      }

      // Update nodes
      for (const n of nodes) {
        const dx = n.x - mx
        const dy = n.y - my
        const dSq = dx * dx + dy * dy
        if (dSq < MOUSE_RADIUS * MOUSE_RADIUS && dSq > 0) {
          const d = Math.sqrt(dSq)
          const force = ((MOUSE_RADIUS - d) / MOUSE_RADIUS) * 0.07
          n.vx += (dx / d) * force
          n.vy += (dy / d) * force
        }

        const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
        if (spd > BASE_SPEED * 2.8) {
          n.vx = (n.vx / spd) * BASE_SPEED * 2.8
          n.vy = (n.vy / spd) * BASE_SPEED * 2.8
        }
        if (spd < BASE_SPEED * 0.1) {
          n.vx += (Math.random() - 0.5) * 0.012
          n.vy += (Math.random() - 0.5) * 0.012
        }

        n.x += n.vx
        n.y += n.vy

        if (n.x < -10) n.x = w + 10
        if (n.x > w + 10) n.x = -10
        if (n.y < -10) n.y = h + 10
        if (n.y > h + 10) n.y = -10
      }

      // Draw edges
      ctx!.lineWidth = 0.5
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dSq = dx * dx + dy * dy
          if (dSq < MAX_DIST * MAX_DIST) {
            const d = Math.sqrt(dSq)
            const alpha = (1 - d / MAX_DIST) * 0.09
            ctx!.strokeStyle = `rgba(255,255,255,${alpha})`
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }

      // Draw & advance data pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.progress += p.speed
        if (p.progress >= 1) { pulses.splice(i, 1); continue }
        const from = nodes[p.from]
        const to = nodes[p.to]
        const dx = to.x - from.x
        const dy = to.y - from.y
        if (dx * dx + dy * dy > MAX_DIST * MAX_DIST * 1.4) { pulses.splice(i, 1); continue }
        const px = from.x + dx * p.progress
        const py = from.y + dy * p.progress
        const grd = ctx!.createRadialGradient(px, py, 0, px, py, 5)
        grd.addColorStop(0, "rgba(255,255,255,0.7)")
        grd.addColorStop(1, "rgba(255,255,255,0)")
        ctx!.beginPath()
        ctx!.arc(px, py, 5, 0, Math.PI * 2)
        ctx!.fillStyle = grd
        ctx!.fill()
      }

      // Draw nodes (galaxy star variety)
      for (const n of nodes) {
        const pulse = Math.sin(time * 1.2 + n.phase) * 0.12 + 0.88
        const a = n.alpha * pulse
        const glowR = n.r * 4.5
        // Glow halo
        const grd = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR)
        grd.addColorStop(0, `rgba(255,255,255,${a * 0.6})`)
        grd.addColorStop(0.4, `rgba(255,255,255,${a * 0.15})`)
        grd.addColorStop(1, "rgba(255,255,255,0)")
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, glowR, 0, Math.PI * 2)
        ctx!.fillStyle = grd
        ctx!.fill()
        // Core dot
        ctx!.beginPath()
        ctx!.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255,255,255,${Math.min(a + 0.25, 1)})`
        ctx!.fill()
      }
    }

    canvas.width = w
    canvas.height = h
    init()
    animId = requestAnimationFrame(draw)

    const onResize = () => { nextW = window.innerWidth; nextH = window.innerHeight; needsResize = true }
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    const onLeave = () => { mx = -9999; my = -9999 }

    window.addEventListener("resize", onResize)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseleave", onLeave)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2, filter: "blur(1.5px)" }}
    />
  )
}
