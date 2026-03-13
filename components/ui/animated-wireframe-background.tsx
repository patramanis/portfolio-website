"use client"

import { useEffect, useRef } from "react"

export function AnimatedWireframeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Grid settings
    const gridSize = 40

    const animate = () => {
      timeRef.current += 0.016

      // Clear canvas
      ctx.fillStyle = "#09090b"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "rgba(180, 180, 200, 0.03)"
      ctx.lineWidth = 1

      for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
        for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
          // Apply wave distortion
          const wave =
            Math.sin((x + timeRef.current * 30) * 0.01) * 5 +
            Math.cos((y + timeRef.current * 25) * 0.01) * 5

          const nx = x + wave
          const ny = y + wave

          // Draw small square at each grid point
          ctx.beginPath()
          ctx.rect(nx - gridSize / 2, ny - gridSize / 2, gridSize, gridSize)
          ctx.stroke()
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        display: "block",
      }}
    />
  )
}
