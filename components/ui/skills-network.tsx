"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"

// Deterministic seeded random
function sr(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

interface NodeData {
  label: string
  x: number
  y: number
  dx: [number, number, number, number, number]
  dy: [number, number, number, number, number]
  duration: number
  delay: number
  fontSize: number
}

function buildNodes(skills: string[], cols: number, rows: number): NodeData[] {
  const total = cols * rows
  const indices = Array.from({ length: total }, (_, i) => i)

  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(sr(i * 137.508) * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }

  const px = 7, py = 9
  const cw = (100 - px * 2) / cols
  const ch = (100 - py * 2) / rows

  return skills.map((label, i) => {
    const cellIdx = indices[i % total]
    const col = cellIdx % cols
    const row = Math.floor(cellIdx / cols)

    const ox = sr(i * 31.1 + 1) * 0.6 + 0.2
    const oy = sr(i * 37.3 + 2) * 0.6 + 0.2

    const x = px + col * cw + ox * cw
    const y = py + row * ch + oy * ch

    const amp = 4 + sr(i * 41 + 3) * 5

    return {
      label,
      x,
      y,
      dx: [0, (sr(i * 43 + 4) - 0.5) * amp * 2, (sr(i * 47 + 5) - 0.5) * amp * 1.5, (sr(i * 53 + 6) - 0.5) * amp * 2, 0] as [number, number, number, number, number],
      dy: [0, (sr(i * 59 + 7) - 0.5) * amp * 1.5, (sr(i * 61 + 8) - 0.5) * amp * 2, (sr(i * 67 + 9) - 0.5) * amp * 1.5, 0] as [number, number, number, number, number],
      duration: 4.5 + sr(i * 71 + 10) * 3,
      delay: -(sr(i * 73 + 11) * 7),
      fontSize: 11 + Math.floor(sr(i * 79 + 12) * 4),
    }
  })
}

function SkillChip({ node, index, idPrefix }: { node: NodeData; index: number; idPrefix: string }) {
  const [hovered, setHovered] = useState(false)
  const borderRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const angleRef = useRef(0)

  useEffect(() => {
    if (!hovered) {
      if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
      return
    }
    const tick = () => {
      angleRef.current = (angleRef.current + 1.2) % 360
      if (borderRef.current) {
        borderRef.current.style.background =
          `conic-gradient(from ${angleRef.current}deg at 50% 50%, #3f3f46, #a1a1aa, #e4e4e7, #d4d4d8, #a1a1aa, #52525b, #3f3f46)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null } }
  }, [hovered])

  return (
    <div
      className="absolute"
      style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)", zIndex: 3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          animation: `${idPrefix}-${index} ${node.duration.toFixed(2)}s ease-in-out ${node.delay.toFixed(2)}s infinite`,
        }}
      >
        <motion.div
          animate={{ scale: hovered ? 1.12 : 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          className="relative"
        >
          {/* Liquid metal gradient border */}
          <div
            ref={borderRef}
            className="absolute rounded-[9px] pointer-events-none"
            style={{
              inset: "-1.5px",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.25s ease",
              zIndex: 0,
            }}
          />
          {/* Chip content */}
          <div
            className="relative z-10 rounded-lg px-2.5 py-1.5 cursor-default select-none whitespace-nowrap"
            style={{
              fontSize: `${node.fontSize}px`,
              background: "rgba(39,39,42,0.88)",
              border: hovered ? "1px solid transparent" : "1px solid rgba(63,63,70,0.45)",
              color: hovered ? "#e4e4e7" : "#a1a1aa",
              boxShadow: hovered ? "0 0 14px rgba(161,161,170,0.14)" : "none",
              transition: "color 0.2s, box-shadow 0.2s",
            }}
          >
            {node.label}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

interface SkillsNetworkProps {
  skills: string[]
  title: string
  align: "left" | "right"
  cols: number
  rows: number
  height: number
}

export function SkillsNetwork({ skills, title, align, cols, rows, height }: SkillsNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasRafRef = useRef<number | null>(null)

  const idPrefix = useMemo(() => `skf-${title.replace(/[^a-zA-Z0-9]/g, "")}`, [title])
  const nodes = useMemo(() => buildNodes(skills, cols, rows), [skills, cols, rows])

  const keyframesCss = useMemo(() =>
    nodes.map((n, i) =>
      `@keyframes ${idPrefix}-${i}{` +
      `0%{transform:translate(${n.dx[0].toFixed(1)}px,${n.dy[0].toFixed(1)}px)}` +
      `25%{transform:translate(${n.dx[1].toFixed(1)}px,${n.dy[1].toFixed(1)}px)}` +
      `50%{transform:translate(${n.dx[2].toFixed(1)}px,${n.dy[2].toFixed(1)}px)}` +
      `75%{transform:translate(${n.dx[3].toFixed(1)}px,${n.dy[3].toFixed(1)}px)}` +
      `100%{transform:translate(${n.dx[4].toFixed(1)}px,${n.dy[4].toFixed(1)}px)}}`
    ).join("")
    , [nodes, idPrefix])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const setSize = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }
    setSize()

    let t = 0
    let last = 0
    const INTERVAL = 1000 / 30

    const tick = (now: number) => {
      canvasRafRef.current = requestAnimationFrame(tick)
      if (now - last < INTERVAL) return
      last = now

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const pts = nodes.map(n => ({ px: n.x * w / 100, py: n.y * h / 100 }))
      const maxD = Math.min(w, h) * 0.46

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const ddx = pts[j].px - pts[i].px
          const ddy = pts[j].py - pts[i].py
          const dist = Math.sqrt(ddx * ddx + ddy * ddy)
          if (dist > maxD) continue

          const base = (1 - dist / maxD) * 0.3
          const pulse = Math.sin(t * 0.0007 + i * 0.9 + j * 0.6) * 0.5 + 0.5
          const alpha = base * (0.3 + pulse * 0.7)

          ctx.strokeStyle = `rgba(161,161,170,${alpha.toFixed(3)})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(pts[i].px, pts[i].py)
          ctx.lineTo(pts[j].px, pts[j].py)
          ctx.stroke()
        }
      }

      t += INTERVAL
    }

    canvasRafRef.current = requestAnimationFrame(tick)

    const ro = new ResizeObserver(setSize)
    ro.observe(container)

    return () => {
      if (canvasRafRef.current !== null) cancelAnimationFrame(canvasRafRef.current)
      ro.disconnect()
    }
  }, [nodes])

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: keyframesCss }} />
      <h3
        className={`font-display text-2xl font-bold mb-4 ${align === "right" ? "text-right" : "text-left"}`}
      >
        <span className="text-white">{title} </span>
        <span className="exp-gradient">Skills</span>
      </h3>
      <div
        ref={containerRef}
        className="relative rounded-2xl border border-zinc-700/30 bg-zinc-900/30"
        style={{ height: `${height}px` }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        />
        {nodes.map((node, i) => (
          <SkillChip key={node.label} node={node} index={i} idPrefix={idPrefix} />
        ))}
      </div>
    </div>
  )
}
