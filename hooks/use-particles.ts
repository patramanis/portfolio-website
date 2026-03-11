"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    size: number
}

export function useParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const animationIdRef = useRef<number>()
    const [isHovering, setIsHovering] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas size
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        const createParticles = (x: number, y: number, count: number) => {
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count
                const velocity = 2 + Math.random() * 3
                particlesRef.current.push({
                    x,
                    y,
                    vx: Math.cos(angle) * velocity,
                    vy: Math.sin(angle) * velocity,
                    life: 1,
                    maxLife: 1,
                    size: 3 + Math.random() * 2,
                })
            }
        }

        const animate = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update and draw particles
            particlesRef.current = particlesRef.current.filter((particle) => {
                particle.life -= 0.02
                particle.x += particle.vx
                particle.y += particle.vy

                if (particle.life > 0) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${particle.life * 0.8})`
                    ctx.beginPath()
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                    ctx.fill()
                    return true
                }
                return false
            })

            if (particlesRef.current.length > 0 || isHovering) {
                animationIdRef.current = requestAnimationFrame(animate)
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (isHovering) {
                const rect = canvas.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                // Create particles following cursor
                createParticles(x, y, 2)
            }
        }

        const handleMouseEnter = () => {
            setIsHovering(true)
            animate()
        }

        const handleMouseLeave = () => {
            setIsHovering(false)
        }

        canvas.addEventListener("mousemove", handleMouseMove)
        canvas.addEventListener("mouseenter", handleMouseEnter)
        canvas.addEventListener("mouseleave", handleMouseLeave)

        animate()

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove)
            canvas.removeEventListener("mouseenter", handleMouseEnter)
            canvas.removeEventListener("mouseleave", handleMouseLeave)
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current)
            }
        }
    }, [isHovering])

    return { canvasRef, isHovering }
}
