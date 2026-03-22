"use client"

import { useEffect, useRef } from "react"

export function LavaLampBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set initial size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let gradientX = 0
    let gradientY = 0
    let lastFrameTime = 0
    const frameInterval = 1000 / 30
    let rafId: number
    // Flag resize instead of calling setCanvasSize directly —
    // canvas.width= clears the buffer; doing it inside the RAF callback
    // means the clear + redraw happen in the same composited frame → no flash.
    let needsResize = false
    const handleResize = () => { needsResize = true }
    window.addEventListener("resize", handleResize)

    const animate = (currentTime: number) => {
      rafId = requestAnimationFrame(animate)

      if (needsResize) {
        needsResize = false
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        lastFrameTime = 0 // force immediate redraw on this frame
      }

      if (currentTime - lastFrameTime < frameInterval) return
      lastFrameTime = currentTime

      const time    = Date.now() * 0.0002
      const targetX = Math.sin(time * 0.5) * 200
      const targetY = Math.cos(time * 0.3) * 200
      gradientX += (targetX - gradientX) * 0.01
      gradientY += (targetY - gradientY) * 0.01

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createLinearGradient(
        gradientX, gradientY,
        gradientX + canvas.width, gradientY + canvas.height
      )
      gradient.addColorStop(0, "#1e1e1e")
      gradient.addColorStop(0.5, "#161616")
      gradient.addColorStop(1, "#1a1a1a")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(rafId)
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
        pointerEvents: "none",
      }}
    />
  )
}
