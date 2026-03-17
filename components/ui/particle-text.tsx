"use client"

import { useEffect, useRef } from "react"

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    ax: number
    ay: number
    life: number
    maxLife: number
    size: number
    baseX: number
    baseY: number
}

interface ParticleTextProps {
    text: string
    className?: string
    fontSize?: number
    style?: React.CSSProperties
}

export function ParticleText({ text, className = "", fontSize = 120, style }: ParticleTextProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const textCanvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const mouseRef = useRef({ x: 0, y: 0 })
    const isHoveringRef = useRef(false)
    const particleAlphaRef = useRef(0) // Track particle alpha for smooth fade

    useEffect(() => {
        const container = containerRef.current
        const canvas = canvasRef.current
        const textCanvas = textCanvasRef.current

        if (!container || !canvas || !textCanvas) return

        const ctx = canvas.getContext("2d", { alpha: true })
        const textCtx = textCanvas.getContext("2d", { alpha: true })

        if (!ctx || !textCtx) return

        // Calculate proper canvas size based on text
        const estimatedWidth = fontSize * text.length * 0.6
        const estimatedHeight = fontSize * 1.3

        canvas.width = estimatedWidth
        canvas.height = estimatedHeight
        textCanvas.width = estimatedWidth
        textCanvas.height = estimatedHeight

        // Draw text to textCanvas to capture it for particle generation
        const drawText = () => {
            textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height)
            textCtx.font = `bold ${fontSize}px "Cal Sans", system-ui, sans-serif`
            textCtx.fillStyle = "white"
            textCtx.textAlign = "left"
            textCtx.textBaseline = "top"
            textCtx.fillText(text, 0, 0)
        }

        drawText()

        const createParticlesFromText = () => {
            const imageData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height)
            const data = imageData.data
            particlesRef.current = []

            // Sample pixels to create particles (reduced sampling = 50 instead of 30)
            for (let i = 0; i < data.length; i += 50) {
                if (data[i + 3] > 100) {
                    const pixelIndex = i / 4
                    const x = pixelIndex % textCanvas.width
                    const y = Math.floor(pixelIndex / textCanvas.width)

                    particlesRef.current.push({
                        x,
                        y,
                        vx: 0,
                        vy: 0,
                        ax: 0,
                        ay: 0,
                        life: 1,
                        maxLife: 1,
                        size: 0.7 + Math.random() * 0.5,
                        baseX: x,
                        baseY: y,
                    })
                }
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect()
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            }
        }

        let frameId: number | null = null
        let idleCounter = 0

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            idleCounter++

            const hovering = isHoveringRef.current

            // Smooth fade in/out of particles
            if (hovering) {
                particleAlphaRef.current = Math.min(particleAlphaRef.current + 0.04, 1)
            } else {
                particleAlphaRef.current = Math.max(particleAlphaRef.current - 0.04, 0)
            }

            const particleAlpha = particleAlphaRef.current

            // Update all particles
            particlesRef.current.forEach((particle) => {
                if (hovering && particleAlpha > 0) {
                    const dx = particle.x - mouseRef.current.x
                    const dy = particle.y - mouseRef.current.y
                    const distSquared = dx * dx + dy * dy
                    const minDistance = 25
                    const minDistSquared = minDistance * minDistance

                    if (distSquared < minDistSquared && distSquared > 0) {
                        const distance = Math.sqrt(distSquared)
                        const force = (minDistance - distance) / minDistance * 0.6
                        const angle = Math.atan2(dy, dx)

                        particle.ax = Math.cos(angle) * force * 4
                        particle.ay = Math.sin(angle) * force * 4
                    } else {
                        particle.ax = (particle.baseX - particle.x) * 0.12
                        particle.ay = (particle.baseY - particle.y) * 0.12
                    }

                    particle.vx += particle.ax
                    particle.vy += particle.ay
                    particle.vx *= 0.85
                    particle.vy *= 0.85
                    particle.x += particle.vx
                    particle.y += particle.vy
                } else {
                    particle.x += (particle.baseX - particle.x) * 0.15
                    particle.y += (particle.baseY - particle.y) * 0.15
                    particle.vx *= 0.9
                    particle.vy *= 0.9
                }
            })

            // Batch all particles into a single draw call
            const alpha = 0.8 * particleAlpha
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
            ctx.beginPath()
            particlesRef.current.forEach((particle) => {
                ctx.moveTo(particle.x + particle.size, particle.y)
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
            })
            ctx.fill()

            frameId = requestAnimationFrame(animate)
        }

        const handleMouseEnter = () => {
            isHoveringRef.current = true
            if (particlesRef.current.length === 0) {
                createParticlesFromText()
            }
            if (frameId === null) {
                frameId = requestAnimationFrame(animate)
            }
        }

        const handleMouseLeave = () => {
            isHoveringRef.current = false
        }

        // Initialize particles for particle effect
        if (particlesRef.current.length === 0) {
            createParticlesFromText()
            frameId = requestAnimationFrame(animate)
        }

        container.addEventListener("mouseenter", handleMouseEnter)
        container.addEventListener("mouseleave", handleMouseLeave)
        container.addEventListener("mousemove", handleMouseMove)

        return () => {
            container.removeEventListener("mouseenter", handleMouseEnter)
            container.removeEventListener("mouseleave", handleMouseLeave)
            container.removeEventListener("mousemove", handleMouseMove)
            if (frameId !== null) {
                cancelAnimationFrame(frameId)
            }
        }
    }, [text, fontSize])

    return (
        <div ref={containerRef} className={`relative cursor-pointer overflow-visible ${className}`} style={style}>
            {/* Text display (always visible, overlaid by particles) */}
            <div
                className="font-display font-bold leading-none text-white select-none"
                style={{
                    fontSize: `${fontSize}px`,
                    fontFamily: '"Cal Sans", system-ui, sans-serif',
                    fontWeight: 700,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                }}
            >
                {text}
            </div>

            {/* Particle canvas - positioned absolutely to overlay text */}
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 pointer-events-none"
            />

            {/* Hidden canvas for text rendering - used to extract particles */}
            <canvas
                ref={textCanvasRef}
                className="hidden"
            />
        </div>
    )
}
