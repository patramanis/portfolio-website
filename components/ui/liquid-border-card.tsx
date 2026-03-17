"use client"

import { useRef, useEffect, type ReactNode } from "react"

// ── constants ────────────────────────────────────────────────────────────────
const R = 16             // border-radius px  (matches rounded-2xl)
const FILL_SPEED = 0.75  // progress units / second  (full fill ≈ 1.33 s)
const CENTER_LERP = 4    // how fast centerT chases targetT while hovering
const SHIMMER_SPEED = 1.0  // glow pulse cycles per second

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert a (x,y) position relative to the card to a normalised perimeter T ∈ [0,1).
 * Clockwise: top → right → bottom → left, starting from top-left corner.
 */
function edgeT(x: number, y: number, w: number, h: number): number {
  const dTop = y
  const dRight = w - x
  const dBottom = h - y
  const dLeft = x
  const minD = Math.min(dTop, dRight, dBottom, dLeft)
  const P = 2 * (w + h)
  if (minD === dTop) return x / P
  if (minD === dRight) return (w + y) / P
  if (minD === dBottom) return (w + h + (w - x)) / P
  return (2 * w + h + (h - y)) / P
}

/**
 * Circular lerp on [0,1) — always takes the shortest arc.
 * Result is clamped back into [0, 1).
 */
function cLerp(from: number, to: number, factor: number): number {
  let d = to - from
  if (d > 0.5) d -= 1
  if (d < -0.5) d += 1
  return ((from + d * Math.min(factor, 1)) % 1 + 1) % 1
}

// ── internal animation state ─────────────────────────────────────────────────
interface S {
  progress: number   // 0-1  — how much of the border is filled
  centerT: number   // 0-1  — current display centre on perimeter
  targetT: number   // 0-1  — where centerT is drifting to (only used while hovering)
  shimmerT: number   // ever-increasing, drives glow pulse
  hovering: boolean
}

// ── draw ─────────────────────────────────────────────────────────────────────
function drawBorder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  st: S,
): void {
  ctx.clearRect(0, 0, w, h)
  if (st.progress < 0.003) return

  const P = 2 * (w + h)
  const full = st.progress >= 0.999

  // Dash geometry — symmetric spread centred on st.centerT
  const drawnLen = full ? P + 4 : st.progress * P
  const rawStart = (st.centerT - st.progress / 2) * P

  // Rounded-rect path (clockwise, matching R = 16 px)
  const buildPath = () => {
    ctx.beginPath()
    ctx.moveTo(R, 0)
    ctx.lineTo(w - R, 0)
    ctx.arcTo(w, 0, w, R, R)
    ctx.lineTo(w, h - R)
    ctx.arcTo(w, h, w - R, h, R)
    ctx.lineTo(R, h)
    ctx.arcTo(0, h, 0, h - R, R)
    ctx.lineTo(0, R)
    ctx.arcTo(0, 0, R, 0, R)
    ctx.closePath()
  }

  // Fixed diagonal gradient — always covers full card, no dark gaps.
  // Shimmer is achieved via a pulsing shadowBlur/shadowColor instead of
  // a panning gradient (which caused brightness loss when the bright peak
  // drifted outside the card boundary).
  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, "rgba( 70, 70, 85, 0.88)")
  grad.addColorStop(0.28, "rgba(170,170,185, 0.94)")
  grad.addColorStop(0.50, "rgba(255,255,255, 1.00)")
  grad.addColorStop(0.72, "rgba(170,170,185, 0.94)")
  grad.addColorStop(1, "rgba( 70, 70, 85, 0.88)")

  // Pulsing glow — gives the shimmer "breathing" feel without brightness gaps
  const pulse = 0.5 + 0.5 * Math.sin(st.shimmerT * Math.PI * 2)

  // Normalise rawStart into [0, P) — Canvas % can return negatives for negative inputs
  const adjStart = ((rawStart % P) + P) % P
  const arcEnd   = adjStart + drawnLen   // may be > P when arc crosses the seam

  ctx.lineWidth   = 1.5
  ctx.strokeStyle = grad
  ctx.shadowBlur  = 4 + 7 * pulse
  ctx.shadowColor = `rgba(195, 210, 230, ${0.35 + 0.30 * pulse})`

  ctx.save()
  buildPath()   // path persists across multiple stroke() calls

  if (full) {
    // Full border — no dashing needed
    ctx.setLineDash([])
    ctx.stroke()
  } else if (arcEnd <= P) {
    // Arc fits entirely within the path — single stroke
    ctx.setLineDash([drawnLen, P + 100])
    ctx.lineDashOffset = -adjStart
    ctx.stroke()
  } else {
    // Arc crosses the seam (top-left corner) — split into two strokes
    // on the same path so both halves render smoothly without a jump.
    const tailLen = P - adjStart          // from adjStart → end of path
    const headLen = arcEnd - P            // from start of path → overlap amount

    // Tail: adjStart → P
    ctx.setLineDash([tailLen, P + 100])
    ctx.lineDashOffset = -adjStart
    ctx.stroke()

    // Head: 0 → headLen  (offset 0 = draw from the very start of the path)
    ctx.setLineDash([headLen, P + 100])
    ctx.lineDashOffset = 0
    ctx.stroke()
  }

  ctx.restore()
}

// ── component ─────────────────────────────────────────────────────────────────
interface LiquidBorderCardProps {
  children: ReactNode
  className?: string
}

export function LiquidBorderCard({ children, className = "" }: LiquidBorderCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cvRef = useRef<HTMLCanvasElement>(null)
  const state = useRef<S>({ progress: 0, centerT: 0, targetT: 0, shimmerT: 0, hovering: false })
  const rafId = useRef<number | null>(null)
  const prevMs = useRef<number>(0)

  // ── keep canvas sized to wrapper ────────────────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current
    const cv = cvRef.current
    if (!wrap || !cv) return
    const sync = () => {
      cv.width = wrap.offsetWidth
      cv.height = wrap.offsetHeight
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  // ── RAF loop — only runs while animated ─────────────────────────────────
  const startLoop = () => {
    if (rafId.current !== null) return   // already running
    prevMs.current = 0

    const loop = (now: number) => {
      const dt = prevMs.current
        ? Math.min((now - prevMs.current) / 1000, 0.05)
        : 0
      prevMs.current = now

      const st = state.current

      // advance progress
      const dir = st.hovering ? 1 : -1
      st.progress = Math.max(0, Math.min(1, st.progress + dir * FILL_SPEED * dt))

      // drift centre toward target ONLY while hovering.
      // During leave, centerT is frozen → arc contracts symmetrically from both
      // ends toward the current center, preventing the "one side locks / teleport"
      // artifact that happened when centerT was chasing the exit edge.
      if (dt > 0 && st.hovering) {
        st.centerT = cLerp(st.centerT, st.targetT, CENTER_LERP * dt)
      }

      // shimmer pulse timer
      st.shimmerT += SHIMMER_SPEED * dt

      // draw
      const cv = cvRef.current
      if (cv) {
        const ctx = cv.getContext("2d")
        if (ctx) drawBorder(ctx, cv.width, cv.height, st)
      }

      // continue if there is still something to animate
      if (st.progress > 0 || st.hovering) {
        rafId.current = requestAnimationFrame(loop)
      } else {
        rafId.current = null
      }
    }

    rafId.current = requestAnimationFrame(loop)
  }

  // cleanup on unmount
  useEffect(() => () => { if (rafId.current) cancelAnimationFrame(rafId.current) }, [])

  // ── mouse handlers ────────────────────────────────────────────────────────
  const onEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const t = edgeT(e.clientX - left, e.clientY - top, width, height)
    const st = state.current

    // Snap centre to entry only if the arc is nearly empty — prevents a visible
    // jump when the user moves back in while the retreat animation is still running.
    if (st.progress < 0.08) st.centerT = t
    st.targetT = t
    st.hovering = true
    startLoop()
  }

  const onLeave = (_e: React.MouseEvent<HTMLDivElement>) => {
    const st = state.current
    // Lock targetT to current centerT so center doesn't move during retreat.
    // The border now contracts symmetrically from both ends — no teleport,
    // no side-locking, no asymmetric collapse.
    st.targetT = st.centerT
    st.hovering = false
    startLoop()   // ensure loop is alive for the retreat
  }

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
      {/* canvas is transparent everywhere except the border stroke */}
      <canvas
        ref={cvRef}
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: R, zIndex: 10 }}
      />
    </div>
  )
}
