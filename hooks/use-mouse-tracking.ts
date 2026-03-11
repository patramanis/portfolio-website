"use client"

import { useEffect, useState } from "react"

export interface MousePosition {
    x: number
    y: number
    normalized: {
        x: number
        y: number
    }
}

export function useMouseTracking() {
    const [mousePos, setMousePos] = useState<MousePosition>({
        x: 0,
        y: 0,
        normalized: { x: 0, y: 0 },
    })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX
            const y = e.clientY

            // Normalize to -1 to 1 range
            const normalizedX = (x / window.innerWidth) * 2 - 1
            const normalizedY = (y / window.innerHeight) * 2 - 1

            setMousePos({
                x,
                y,
                normalized: {
                    x: normalizedX,
                    y: normalizedY,
                },
            })
        }

        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [])

    return mousePos
}
