"use client"

import { useRef, useEffect } from "react"

export function AboutWavesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastFrameTimeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const handleResize = () => {
      const parentElement = canvas.parentElement
      if (!parentElement) return

      canvas.width = document.documentElement.clientWidth

      // Μηδένισε πρώτα το canvas ώστε το scrollHeight να μετράει μόνο το flow content
      canvas.style.height = '0px'

      const parentRect = parentElement.getBoundingClientRect()
      const parentOffsetTop = window.scrollY + parentRect.top
      // Τώρα το scrollHeight δεν περιλαμβάνει το ίδιο το canvas
      const contentHeight = document.documentElement.scrollHeight

      // Canvas ξεκινά από parentOffsetTop - 195 (λόγω top: -195px)
      // Θέλουμε να τελειώνει ακριβώς στο τέλος του content
      const canvasTopFromPageTop = parentOffsetTop - 195
      const newHeight = Math.max(
        contentHeight - canvasTopFromPageTop,
        window.innerHeight
      )

      canvas.height = newHeight
      canvas.style.height = newHeight + 'px'
    }

    // Κάλεσε handleResize αρχικά
    handleResize()

    // Περίμενε λίγο και ξανακάλεσε για να σιγουρευτείς ότι το layout είναι έτοιμο
    const timeoutId = setTimeout(() => {
      handleResize()
    }, 100)

    window.addEventListener("resize", handleResize)

    const drawWaves = (time: number) => {
      const width = canvas.width
      const height = canvas.height
      const waveStartHeight = height * 0.15

      // Fill below waves following the wave curve with irregular waves
      const gradient = ctx.createLinearGradient(0, waveStartHeight, 0, height)
      gradient.addColorStop(0, "rgba(10, 10, 10, 0.68)")
      gradient.addColorStop(0.5, "rgba(44, 44, 44, 0.4)")
      gradient.addColorStop(1, "rgba(5, 5, 5, 0.74)")

      ctx.fillStyle = gradient
      ctx.beginPath()

      const step = 4
      const wave1Amp = 15
      const wave1Freq = 0.008
      const wave2Amp = 10
      const wave2Freq = 0.012
      const wave3Amp = 6
      const wave3Freq = 0.006

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

    const animate = (currentTime: number) => {
      if (currentTime - lastFrameTimeRef.current >= frameInterval) {
        lastFrameTimeRef.current = currentTime
        const time = currentTime * 0.0004

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawWaves(time)
      }

      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: "-195px",
        left: "0",
        width: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.5,
        transform: "scaleX(1.01)",
        transformOrigin: "left center",
      }}
    />
  )
}
