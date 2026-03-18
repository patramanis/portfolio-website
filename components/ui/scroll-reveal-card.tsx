"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function ScrollRevealCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.45"],
  })

  const rotateX = useTransform(scrollYProgress, [0, 1], [-14, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.55, 1])

  return (
    <div ref={ref} style={{ perspective: "1200px" }}>
      <motion.div style={{ rotateX, scale, opacity, transformOrigin: "center center" }}>
        {children}
      </motion.div>
    </div>
  )
}
