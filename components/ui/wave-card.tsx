"use client"

import { ReactNode, useRef, useState } from "react"
import { useWaveEffect } from "@/hooks/use-wave-effect"

interface WaveCardProps {
  children: ReactNode
}

export function WaveCard({ children }: WaveCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useWaveEffect(canvasRef, containerRef, isHovering)

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Wave canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none rounded-2xl mix-blend-mode-screen"
        style={{
          mixBlendMode: "screen",
        }}
      />

      {/* Card content */}
      <div className="relative">{children}</div>
    </div>
  )
}
