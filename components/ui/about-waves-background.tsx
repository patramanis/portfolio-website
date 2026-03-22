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

    const applyResize = () => {
      const parentElement = canvas.parentElement
      if (!parentElement) return

      canvas.width = document.documentElement.clientWidth
      canvas.style.height = '0px'

      const parentRect = parentElement.getBoundingClientRect()
      const parentOffsetTop = window.scrollY + parentRect.top
      const contentHeight = document.documentElement.scrollHeight

      const canvasTopFromPageTop = parentOffsetTop - 195
      const newHeight = Math.max(
        contentHeight - canvasTopFromPageTop,
        window.innerHeight
      )

      canvas.height = newHeight
      canvas.style.height = newHeight + 'px'
    }

    applyResize()
    const timeoutId = setTimeout(applyResize, 100)

    let needsResize = false
    const handleResize = () => { needsResize = true }
    window.addEventListener("resize", handleResize)

    const drawWaves = (time: number) => {
      const width = canvas.width
      const height = canvas.height
      const waveStartHeight = height * 0.15

      const gradient = ctx.createLinearGradient(0, waveStartHeight, 0, height)
      gradient.addColorStop(0, "rgba(10, 10, 10, 0.68)")
      gradient.addColorStop(0.5, "rgba(44, 44, 44, 0.4)")
      gradient.addColorStop(1, "rgba(5, 5, 5, 0.74)")

      ctx.fillStyle = gradient
      ctx.beginPath()

      const step = 4
      const wave1Amp = 15, wave1Freq = 0.008
      const wave2Amp = 10, wave2Freq = 0.012
      const wave3Amp = 6,  wave3Freq = 0.006

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
      if (needsResize) {
        needsResize = false
        applyResize()
        lastFrameTimeRef.current = 0
      }

      if (currentTime - lastFrameTimeRef.current >= frameInterval) {
        lastFrameTimeRef.current = currentTime
        const time = currentTime * 0.0004
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawWaves(time)
      }

      rafId = requestAnimationFrame(animate)
    }

    // Gate: only run the RAF loop while the canvas is near the viewport.
    // The about section loads below the fold; this prevents a permanent 30fps
    // loop burning CPU while the user is still on the hero section.
    const section = canvas.closest('section') ?? canvas.parentElement
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          lastFrameTimeRef.current = 0
          rafId = requestAnimationFrame(animate)
        } else {
          cancelAnimationFrame(rafId)
        }
      },
      { threshold: 0, rootMargin: "200px" }
    )
    if (section) observer.observe(section)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeoutId)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <style>{`
        .about-waves-canvas {
          transition: opacity 0.8s ease;
        }
        /* Fades together with the clouds (same 1280px threshold) */
        @media (max-width: 1280px) {
          .about-waves-canvas { opacity: 0 !important; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        className="about-waves-canvas"
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
    </>
  )
}
