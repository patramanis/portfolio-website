"use client"

import { useRef, useEffect } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"

interface ScrollRevealCardProps {
  children: React.ReactNode
  initiallyVisible?: boolean
  isLast?: boolean
}

export function ScrollRevealCard({
  children,
  initiallyVisible = false,
  isLast = false,
}: ScrollRevealCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const scrollProgress = useMotionValue(initiallyVisible ? 0.5 : 0)

  useEffect(() => {
    const updateProgress = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const viewportH = window.innerHeight
      const cardH = rect.height
      // 0 = top of card at viewport bottom (just entering)
      // 1 = bottom of card at viewport top (just exiting)
      const totalRange = viewportH + cardH
      const raw = (viewportH - rect.top) / totalRange
      scrollProgress.set(Math.max(0, Math.min(1, raw)))
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress, { passive: true })
    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [scrollProgress])

  // Entry zone: 0–25% | Neutral: 25–75% | Exit zone: 75–100%
  const rotateX = useTransform(
    scrollProgress,
    [0, 0.25, 0.75, 1.0],
    [initiallyVisible ? 0 : -9, 0, 0, isLast ? 0 : 9],
  )
  const scale = useTransform(
    scrollProgress,
    [0, 0.25, 0.75, 1.0],
    [initiallyVisible ? 1 : 1.04, 1, 1, isLast ? 1 : 0.97],
  )
  const opacity = useTransform(
    scrollProgress,
    [0, 0.20, 0.80, 1.0],
    [initiallyVisible ? 1 : 0.5, 1, 1, isLast ? 1 : 0.5],
  )

  return (
    <div ref={ref} style={{ perspective: "1200px" }}>
      <motion.div style={{ rotateX, scale, opacity, transformOrigin: "center center" }}>
        {children}
      </motion.div>
    </div>
  )
}
