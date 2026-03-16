"use client"

import { useEffect, useRef } from "react"

export function LavaLampBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    let gradientX = 0
    let gradientY = 0
    let targetX = 0
    let targetY = 0

    const animate = () => {
      // Every 4 seconds, pick a new random target
      const time = Date.now() * 0.0002
      targetX = Math.sin(time * 0.5) * 200
      targetY = Math.cos(time * 0.3) * 200

      // Smoothly move towards target
      gradientX += (targetX - gradientX) * 0.01
      gradientY += (targetY - gradientY) * 0.01

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient
      const gradient = ctx.createLinearGradient(
        gradientX,
        gradientY,
        gradientX + canvas.width,
        gradientY + canvas.height
      )

      gradient.addColorStop(0, "#2a2a2a")
      gradient.addColorStop(0.5, "#1f1f1f")
      gradient.addColorStop(1, "#252525")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none"
      }}
    />
  )
}

