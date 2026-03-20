"use client"

import { useEffect, useRef } from "react"

const PARTICLE_COUNT = 240
const TRAIL_LEN = 42
const MAX_ROT = 5
const ROT_LERP = 0.10
const SCALE_BUFFER = 1.15
const MOUSE_RADIUS = 190

// Multi-octave smooth vector-field angle via trig superposition
// Produces correlated, large-scale flow patterns — like a continuous quant signal
function flowAngle(x: number, y: number, t: number): number {
  const v1 = Math.sin(x * 0.006 + t * 0.22) * Math.cos(y * 0.008 - t * 0.15)
  const v2 = Math.sin(x * 0.014 - y * 0.010 + t * 0.09) * 0.55
  const v3 = Math.cos(x * 0.022 + y * 0.018 - t * 0.07) * 0.25
  return (v1 + v2 + v3) * Math.PI * 2.4
}

interface Particle {
  x: number
  y: number
  speed: number
  size: number
  baseAlpha: number
  noiseOff: number
  phase: number
  trail: { x: number; y: number }[]
}

function makeParticle(w: number, h: number): Particle {
  const roll = Math.random()
  let size: number, baseAlpha: number
  if (roll < 0.70) {
    size = 0.5 + Math.random() * 0.7
    baseAlpha = 0.16 + Math.random() * 0.14
  } else if (roll < 0.93) {
    size = 1.1 + Math.random() * 0.8
    baseAlpha = 0.28 + Math.random() * 0.22
  } else {
    size = 2.1 + Math.random() * 1.1
    baseAlpha = 0.50 + Math.random() * 0.24
  }
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    speed: 0.42 + Math.random() * 0.58,
    size,
    baseAlpha,
    noiseOff: Math.random() * 900,
    phase: Math.random() * Math.PI * 2,
    trail: [],
  }
}

export function QuantFlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let time = 0
    let mx = -9999, my = -9999
    let rotX = 0, rotY = 0
    let w = window.innerWidth
    let h = window.innerHeight
    const particles: Particle[] = []

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = w
      canvas!.height = h
    }

    function init() {
      particles.length = 0
      for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle(w, h))
    }

    function draw() {
      animId = requestAnimationFrame(draw)
      ctx!.clearRect(0, 0, w, h)
      time += 0.005

      // ── Perspective tilt toward mouse ──────────────────────────────
      const targetRotY = mx > -999 ? ((mx / w) - 0.5) * MAX_ROT * 2 : 0
      const targetRotX = my > -999 ? ((my / h) - 0.5) * -MAX_ROT * 2 : 0
      rotX += (targetRotX - rotX) * ROT_LERP
      rotY += (targetRotY - rotY) * ROT_LERP
      canvas!.style.transform =
        `perspective(1400px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${SCALE_BUFFER})`

      for (const p of particles) {
        // ── Flow field angle ─────────────────────────────────────────
        let angle = flowAngle(p.x + p.noiseOff, p.y + p.noiseOff, time)

        // ── Mouse vortex: swirl particles near cursor ─────────────────
        const dxM = p.x - mx
        const dyM = p.y - my
        const distMSq = dxM * dxM + dyM * dyM
        if (distMSq < MOUSE_RADIUS * MOUSE_RADIUS && distMSq > 0) {
          const distM = Math.sqrt(distMSq)
          const t = 1 - distM / MOUSE_RADIUS          // 0→1 as closer
          const swirl = t * t * 2.8                   // quadratic intensity
          const awayAngle = Math.atan2(dyM, dxM)
          // Blend base angle toward perpendicular (vortex tangent)
          angle = angle * (1 - swirl * 0.28) + (awayAngle + Math.PI / 2) * (swirl * 0.28)
        }

        // ── Move ─────────────────────────────────────────────────────
        p.x += Math.cos(angle) * p.speed
        p.y += Math.sin(angle) * p.speed

        // Push current head into trail
        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > TRAIL_LEN) p.trail.shift()

        // ── Wrap edges (clear trail on teleport) ──────────────────────
        if (p.x < -10) { p.x = w + 10; p.trail = [] }
        else if (p.x > w + 10) { p.x = -10; p.trail = [] }
        if (p.y < -10) { p.y = h + 10; p.trail = [] }
        else if (p.y > h + 10) { p.y = -10; p.trail = [] }

        if (p.trail.length < 2) continue

        const pulse = Math.sin(time * 1.8 + p.phase) * 0.08 + 0.92

        // ── Trail: two passes — tail (dim) + head half (brighter) ─────
        const mid = Math.floor(p.trail.length / 2)

        // Tail half
        ctx!.beginPath()
        ctx!.moveTo(p.trail[0].x, p.trail[0].y)
        for (let i = 1; i <= mid; i++) ctx!.lineTo(p.trail[i].x, p.trail[i].y)
        ctx!.strokeStyle = `rgba(255,255,255,${p.baseAlpha * pulse * 0.28})`
        ctx!.lineWidth = p.size * 0.55
        ctx!.stroke()

        // Head half (brighter)
        ctx!.beginPath()
        ctx!.moveTo(p.trail[mid].x, p.trail[mid].y)
        for (let i = mid + 1; i < p.trail.length; i++) ctx!.lineTo(p.trail[i].x, p.trail[i].y)
        ctx!.strokeStyle = `rgba(255,255,255,${p.baseAlpha * pulse * 0.58})`
        ctx!.lineWidth = p.size * 0.75
        ctx!.stroke()

        // ── Head glow (larger particles only) ────────────────────────
        const ha = Math.min(p.baseAlpha * pulse * 1.7, 1)
        if (p.size > 1.2) {
          const glowR = p.size * 4.2
          const grd = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
          grd.addColorStop(0, `rgba(255,255,255,${ha * 0.60})`)
          grd.addColorStop(0.45, `rgba(255,255,255,${ha * 0.14})`)
          grd.addColorStop(1, "rgba(255,255,255,0)")
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, glowR, 0, Math.PI * 2)
          ctx!.fillStyle = grd
          ctx!.fill()
        }

        // ── Core dot ─────────────────────────────────────────────────
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255,255,255,${Math.min(ha + 0.1, 1)})`
        ctx!.fill()
      }
    }

    resize()
    init()
    animId = requestAnimationFrame(draw)

    const onResize = () => { resize(); init() }
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
      style={{ zIndex: 2, filter: "blur(0.6px)" }}
    />
  )
}
