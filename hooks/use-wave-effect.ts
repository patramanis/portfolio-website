import { useEffect, useRef } from "react"

interface WaveState {
  mouseX: number
  mouseY: number
  time: number
  opacity: number
}

export function useWaveEffect(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  isHovering: boolean
) {
  const stateRef = useRef<WaveState>({
    mouseX: 0,
    mouseY: 0,
    time: 0,
    opacity: 0,
  })

  const isHoveringRef = useRef(isHovering)
  const animationIdRef = useRef<number | null>(null)

  // Update ref when isHovering changes
  useEffect(() => {
    isHoveringRef.current = isHovering
  }, [isHovering])

  // Track mouse position relative to canvas - ALWAYS active
  useEffect(() => {
    if (!containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      stateRef.current.mouseX = e.clientX - rect.left
      stateRef.current.mouseY = e.clientY - rect.top
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [containerRef])

  // Main animation loop - simplified and lightweight
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { offsetWidth, offsetHeight } = containerRef.current
    canvas.width = offsetWidth
    canvas.height = offsetHeight

    const animate = () => {
      stateRef.current.time += 0.01

      // Smooth fade in/out of opacity
      const targetOpacity = isHoveringRef.current ? 1 : 0
      const opacitySpeed = 0.15 // Fast smooth transition
      stateRef.current.opacity += (targetOpacity - stateRef.current.opacity) * opacitySpeed

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw smooth glow effect
      if (stateRef.current.opacity > 0.01) {
        const { mouseX, mouseY, opacity } = stateRef.current

        // Create very soft, blurred gradient glow
        const glowRadius = 210
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, glowRadius)

        // Scale opacity based on current state
        const scaledOpacity = 0.25 * opacity
        gradient.addColorStop(0, `rgba(255, 255, 255, ${scaledOpacity})`)
        gradient.addColorStop(0.4, `rgba(255, 255, 255, ${0.1 * opacity})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(mouseX, mouseY, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // Add subtle canvas blur filter
        ctx.filter = "blur(8px)"
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(mouseX, mouseY, glowRadius * 0.8, 0, Math.PI * 2)
        ctx.fill()
        ctx.filter = "none"
      }

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animationIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [canvasRef, containerRef])
}
