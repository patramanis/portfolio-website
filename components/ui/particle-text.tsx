"use client"

import { useEffect, useRef, useState } from "react"

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
}

export function ParticleText({ text, className = "", fontSize = 120 }: ParticleTextProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const textCanvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const mouseRef = useRef({ x: 0, y: 0 })
    const animationIdRef = useRef<number>()
    const [isHovering, setIsHovering] = useState(false)
    const [showText, setShowText] = useState(true)
    const isInitializedRef = useRef(false)

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

            // Sample pixels to create particles (smaller, sand-grain-like particles)
            for (let i = 0; i < data.length; i += 120) {
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
                        size: 0.8 + Math.random() * 0.4, // Smaller, sand-grain size
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
            const time = idleCounter * 0.016 // ~60fps

            // Update and render particles
            particlesRef.current.forEach((particle) => {
                // Continuous subtle idle animation
                const idleOffsetX = Math.sin(time * 0.8 + particle.baseX * 0.01) * 0.8
                const idleOffsetY = Math.cos(time * 0.8 + particle.baseY * 0.01) * 0.8

                if (!isHovering) {
                    particle.x = particle.baseX + idleOffsetX
                    particle.y = particle.baseY + idleOffsetY
                } else {
                    // Magnetic effect - repel from cursor with smaller radius
                    const dx = particle.x - mouseRef.current.x
                    const dy = particle.y - mouseRef.current.y
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    const minDistance = 35 // Smaller repel radius

                    if (distance < minDistance && distance > 0) {
                        const force = (minDistance - distance) / minDistance
                        const angle = Math.atan2(dy, dx)

                        // Smooth repulsion
                        particle.ax = Math.cos(angle) * force * 6
                        particle.ay = Math.sin(angle) * force * 6
                    } else {
                        // Friction - return to base position
                        particle.ax = (particle.baseX - particle.x) * 0.08
                        particle.ay = (particle.baseY - particle.y) * 0.08
                    }

                    particle.vx += particle.ax
                    particle.vy += particle.ay

                    // Apply friction
                    particle.vx *= 0.88
                    particle.vy *= 0.88

                    particle.x += particle.vx
                    particle.y += particle.vy
                }

                // Draw particle
                ctx.fillStyle = "rgba(255, 255, 255, 0.85)"
                ctx.beginPath()
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                ctx.fill()
            })

            // Continuous animation loop (always update)
            frameId = requestAnimationFrame(animate)
        }

        const handleMouseEnter = () => {
            setIsHovering(true)
            setShowText(false)
            if (particlesRef.current.length === 0) {
                createParticlesFromText()
            }
            if (frameId === null) {
                frameId = requestAnimationFrame(animate)
            }
        }

        const handleMouseLeave = () => {
            setIsHovering(false)
            setShowText(true)
            idleCounter = 0
        }

        // Initialize particles for idle animation
        if (!isInitializedRef.current) {
            createParticlesFromText()
            isInitializedRef.current = true
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
    }, [text, fontSize, isHovering])

    return (
        <div ref={containerRef} className={`relative cursor-pointer overflow-visible ${className}`}>
            {/* Text display (shown by default, hidden on hover) */}
            {showText && (
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
            )}

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
