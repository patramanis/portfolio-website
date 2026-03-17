"use client"

import { useRef, useEffect } from "react"

export function WaveGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastFrameTimeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const handleResize = () => {
      canvas.width = document.documentElement.clientWidth
      const parentElement = canvas.parentElement
      const parentRect = parentElement?.getBoundingClientRect()
      const remainingHeight = window.innerHeight - (parentRect?.top || 0)
      canvas.height = Math.max(parentElement?.offsetHeight || 600, remainingHeight)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    const drawWaves = (time: number) => {
      const width = canvas.width
      const height = canvas.height
      const waveStartHeight = height * 0.2

      // Fill below waves following the wave curve with irregular waves
      const gradient = ctx.createLinearGradient(0, waveStartHeight, 0, height)
      gradient.addColorStop(0, "rgba(166, 166, 166, 0.56)")
      gradient.addColorStop(0.5, "rgba(100, 100, 100, 0.25)")
      gradient.addColorStop(1, "rgba(70, 70, 70, 0.1)")

      ctx.fillStyle = gradient
      ctx.beginPath()

      const step = 4
      const wave1Amp = 35
      const wave1Freq = 0.007
      const wave2Amp = 25
      const wave2Freq = 0.011
      const wave3Amp = 15
      const wave3Freq = 0.005

      ctx.moveTo(0, waveStartHeight +
        Math.sin(0 * wave1Freq + time) * wave1Amp +
        Math.sin(0 * wave2Freq + time * 0.7) * wave2Amp +
        Math.sin(0 * wave3Freq + time * 0.5) * wave3Amp)

      for (let x = step; x < width; x += step) {
        const y = waveStartHeight +
          Math.sin(x * wave1Freq + time) * wave1Amp +
          Math.sin(x * wave2Freq + time * 0.7) * wave2Amp +
          Math.sin(x * wave3Freq + time * 0.5) * wave3Amp
        ctx.lineTo(x, y)
      }

      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fill()
    }

    const frameInterval = 1000 / 30
    let rafId: number

    const animate = (currentTime: number) => {
      if (currentTime - lastFrameTimeRef.current >= frameInterval) {
        lastFrameTimeRef.current = currentTime
        const time = currentTime * 0.0002

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawWaves(time)
      }

      rafId = requestAnimationFrame(animate)
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
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.5,
        transform: "scaleX(1.01) scaleY(1.01)",
        transformOrigin: "left top",
      }}
    />
  )
}
