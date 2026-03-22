"use client"

import { useRef, useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTopSectionReady } from "@/components/providers/top-section-ready-provider"

export function ExperienceHeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [opacity, setOpacity] = useState(1)
  const { markReady } = useTopSectionReady()
  const markReadyRef = useRef(markReady)
  markReadyRef.current = markReady

  // ── Animated canvas: dark gradient box + inverted wave bottom + text cutout ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let W = 0
    let H = 0
    let fontSize = 0
    let rafId: number
    const frameInterval = 1000 / 30
    let lastTime = 0
    let firstFrameDrawn = false

    const getContext = () => canvas.getContext("2d")

    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      if (W === 0 || H === 0) return
      canvas.width = W
      canvas.height = H

      const ctx = getContext()
      if (!ctx) return
      const probe = 400
      ctx.font = `bold ${probe}px "Permanent Marker", cursive`
      const measured = ctx.measureText("Experience").width
      fontSize = Math.floor(probe * ((W * 0.82) / measured))
    }

    const draw = (time: number) => {
      const ctx = getContext()
      if (!ctx || W === 0 || H === 0) return

      ctx.clearRect(0, 0, W, H)

      const boxH = H * 0.87
      // Wave sits at the bottom of the 90%-height box
      const waveY = boxH

      const wave1Amp = 8, wave1Freq = 0.008
      const wave2Amp = 4, wave2Freq = 0.012
      const wave3Amp = 2, wave3Freq = 0.006
      const step = 4

      // Dark grey gradient (fully opaque)
      const grad = ctx.createLinearGradient(0, 0, 0, waveY)
      grad.addColorStop(0, "rgb(51, 51, 51)")
      grad.addColorStop(0.5, "rgb(120, 120, 120)")
      grad.addColorStop(1, "rgb(45, 45, 45)")
      ctx.fillStyle = grad

      // Draw the inverted-wave shape:
      // start at wave boundary (left), trace wave left→right,
      // then close via TOP corners — fills area ABOVE the wave.
      ctx.beginPath()
      const y0 = waveY
        + Math.sin(0 * wave1Freq + time) * wave1Amp
        + Math.sin(0 * wave2Freq + time * 0.7) * wave2Amp
        + Math.sin(0 * wave3Freq + time * 0.5) * wave3Amp
      ctx.moveTo(0, y0)

      for (let x = step; x <= W; x += step) {
        const y = waveY
          + Math.sin(x * wave1Freq + time) * wave1Amp
          + Math.sin(x * wave2Freq + time * 0.7) * wave2Amp
          + Math.sin(x * wave3Freq + time * 0.5) * wave3Amp
        ctx.lineTo(x, y)
      }

      // Close up through the top of the canvas
      ctx.lineTo(W, 0)
      ctx.lineTo(0, 0)
      ctx.closePath()
      ctx.fill()

      // Carve out "Experience" with destination-out
      if (fontSize > 0) {
        ctx.globalCompositeOperation = "destination-out"
        ctx.font = `bold ${fontSize}px "Permanent Marker", cursive`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = "rgba(0, 0, 0, 1)"
        ctx.fillText("Experience", W / 2, boxH * 0.38)
        ctx.globalCompositeOperation = "source-over"
      }
    }

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        lastTime = currentTime
        draw(currentTime * 0.0004)
        if (!firstFrameDrawn) {
          firstFrameDrawn = true
          markReadyRef.current()
        }
      }
      rafId = requestAnimationFrame(animate)
    }

    document.fonts.ready.then(() => {
      resize()
      rafId = requestAnimationFrame(animate)
    })

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [])

  // ── Fade "More details" as the Educational Experience heading enters view ──
  useEffect(() => {
    const heading = document.querySelector("[data-edu-heading]")
    if (!heading) return

    const io = new IntersectionObserver(
      ([entry]) => setOpacity(1 - entry.intersectionRatio),
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    )
    io.observe(heading)
    return () => io.disconnect()
  }, [])

  return (
    <section className="relative w-full h-screen z-10">

      {/* Animated canvas: dark gradient box + wave bottom edge + Experience cutout */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Intro paragraph — inside the dark box, below the title */}
      <div
        className="absolute w-full flex flex-col items-center px-8"
        style={{ top: "64%", transform: "translateY(-50%)", opacity: "80%" }}
      >
        <p className="max-w-4xl text-justify font-display text-zinc-950 leading-snug" style={{ fontSize: '25px' }}>
          Constantly looking to learn and make an impact. Actively seeking out
          challenges that help me grow; whether through professional roles,
          research, or volunteering.
        </p>
      </div>

      {/* "My journey so far" — 10px above the visible viewport bottom */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce"
        style={{
          bottom: "10px",
          opacity,
          transition: "opacity 300ms ease",
          pointerEvents: opacity < 0.1 ? "none" : "auto",
        }}
      >
        <span className="text-sm font-medium tracking-wide text-zinc-400">
          My journey so far
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-500 mt-1" />
      </div>

    </section>
  )
}
