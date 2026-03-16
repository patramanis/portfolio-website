"use client"

import { RefObject, useEffect, useRef } from "react"

export interface PerspectiveOptions {
    maxRotation?: number
    distance?: number
    easing?: number
}

export function usePerspectiveTransform(
    elementRef: RefObject<HTMLDivElement | null>,
    options: PerspectiveOptions = {}
) {
    const { maxRotation = 15, distance = 500, easing = 0.05 } = options
    const currentRotationRef = useRef({ x: 0, y: 0 })
    const isHoveringRef = useRef(false)
    const lastUpdateTimeRef = useRef(0)
    const mouseDataRef = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const parent = element.parentElement
        if (!parent) return

        let animationId: number

        const handleMouseMove = (e: MouseEvent) => {
            const rect = parent.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            const x = e.clientX - centerX
            const y = e.clientY - centerY

            // Store mouse data for RAF processing
            mouseDataRef.current = { x, y }

            // Check if we just started hovering (came from mouseleave)
            if (!isHoveringRef.current) {
                isHoveringRef.current = true
                // Cancel any ongoing reset animation
                if (animationId) {
                    cancelAnimationFrame(animationId)
                }
                // Enable scale transition for smooth zoom in
                element.style.transition = 'scale 250ms ease-out'
                element.style.scale = '1.02'
                // Remove transition after animation completes
                setTimeout(() => {
                    element.style.transition = ''
                }, 250)
            }

            // Throttle to 60fps max (16.67ms per frame)
            const now = Date.now()
            if (now - lastUpdateTimeRef.current >= 16) {
                lastUpdateTimeRef.current = now

                // Calculate rotation angles
                const rotationY = (x / distance) * maxRotation
                const rotationX = (-y / distance) * maxRotation

                currentRotationRef.current.x += (rotationX - currentRotationRef.current.x) * easing
                currentRotationRef.current.y += (rotationY - currentRotationRef.current.y) * easing

                element.style.transform = `perspective(800px) rotateX(${currentRotationRef.current.x}deg) rotateY(${currentRotationRef.current.y}deg)`
            }
        }

        const handleMouseLeave = () => {
            isHoveringRef.current = false
            // Add smooth transitions for both scale and transform on exit
            element.style.transition = 'scale 250ms ease-out, transform 200ms ease-out'
            element.style.scale = '1'

            const resetRotation = () => {
                currentRotationRef.current.x += (0 - currentRotationRef.current.x) * easing
                currentRotationRef.current.y += (0 - currentRotationRef.current.y) * easing

                if (
                    Math.abs(currentRotationRef.current.x) > 0.1 ||
                    Math.abs(currentRotationRef.current.y) > 0.1
                ) {
                    element.style.transform = `perspective(800px) rotateX(${currentRotationRef.current.x}deg) rotateY(${currentRotationRef.current.y}deg)`
                    animationId = requestAnimationFrame(resetRotation)
                } else {
                    element.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)"
                    currentRotationRef.current = { x: 0, y: 0 }
                    // Remove transition after reset complete
                    element.style.transition = ''
                }
            }

            animationId = requestAnimationFrame(resetRotation)
        }

        parent.addEventListener("mousemove", handleMouseMove)
        parent.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            parent.removeEventListener("mousemove", handleMouseMove)
            parent.removeEventListener("mouseleave", handleMouseLeave)
            if (animationId) {
                cancelAnimationFrame(animationId)
            }
        }
    }, [distance, easing, maxRotation])
}
