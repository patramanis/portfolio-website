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
  const rafRef = useRef<number | null>(null)
  const viewportHRef = useRef(0)
  const scrollProgress = useMotionValue(initiallyVisible ? 0.5 : 0)

  useEffect(() => {
    viewportHRef.current = window.innerHeight

    const tick = () => {
      rafRef.current = null
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = viewportHRef.current
      const raw = (vh - rect.top) / (vh + rect.height)
      scrollProgress.set(Math.max(0, Math.min(1, raw)))
    }

    const onScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(tick)
    }

    const onResize = () => {
      viewportHRef.current = window.innerHeight
      onScroll()
    }

    tick()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [scrollProgress])

  // Entry zone: 0–35% | Neutral: 35–75% | Exit zone: 75–100%
  const rotateX = useTransform(
    scrollProgress,
    [0, 0.35, 0.75, 1.0],
    [initiallyVisible ? 0 : -9, 0, 0, isLast ? 0 : 9],
  )
  const opacity = useTransform(
    scrollProgress,
    [0, 0.15, 0.85, 1.0],
    [initiallyVisible ? 1 : 0.2, 1, 1, isLast ? 1 : 0.2],
  )
  const blurPx = useTransform(
    scrollProgress,
    [0, 0.15, 0.85, 1.0],
    [initiallyVisible ? 0 : 12, 0, 0, isLast ? 0 : 12],
  )
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`)

  return (
    <div ref={ref} style={{ perspective: "1200px" }}>
      <motion.div style={{ rotateX, opacity, filter, transformOrigin: "center center" }}>
        {children}
      </motion.div>
    </div>
  )
}
