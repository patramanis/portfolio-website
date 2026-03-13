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
    const gridWidth = Math.ceil(canvas.width / gridSize) + 2
    const gridHeight = Math.ceil(canvas.height / gridSize) + 2

    // Light traces
    const lights: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
    }> = []

    // Create initial lights
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8
      lights.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * 30,
        vy: Math.sin(angle) * 30,
        life: 1,
        maxLife: 1,
      })
    }

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

      // Update and draw lights
      for (let i = lights.length - 1; i >= 0; i--) {
        const light = lights[i]

        // Update position
        light.x += light.vx
        light.y += light.vy

        // Apply gentle drift
        light.vx += (Math.random() - 0.5) * 0.5
        light.vy += (Math.random() - 0.5) * 0.5

        // Friction
        light.vx *= 0.98
        light.vy *= 0.98

        // Fade
        light.life -= 0.01

        // Draw glow
        const gradient = ctx.createRadialGradient(
          light.x,
          light.y,
          0,
          light.x,
          light.y,
          60
        )
        gradient.addColorStop(0, `rgba(150, 200, 255, ${light.life * 0.4})`)
        gradient.addColorStop(0.5, `rgba(100, 150, 255, ${light.life * 0.2})`)
        gradient.addColorStop(1, "rgba(100, 150, 255, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(light.x, light.y, 60, 0, Math.PI * 2)
        ctx.fill()

        // Remove dead lights
        if (light.life <= 0) {
          lights.splice(i, 1)
        }
      }

      // Spawn new lights randomly
      if (Math.random() < 0.05 && lights.length < 12) {
        const angle = Math.random() * Math.PI * 2
        lights.push({
          x: canvas.width / 2 + Math.cos(angle) * 50,
          y: canvas.height / 2 + Math.sin(angle) * 50,
          vx: Math.cos(angle) * 40,
          vy: Math.sin(angle) * 40,
          life: 1,
          maxLife: 1,
        })
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
