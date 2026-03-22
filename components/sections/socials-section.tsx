"use client"

import { Github, Linkedin, Mail, X } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { WaveGradientBackground } from "@/components/ui/wave-gradient-background"

const socials = [
  {
    icon: Github,
    name: "GitHub",
    href: "https://github.com/patramanis",
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/patramanis/",
  },
  {
    icon: X,
    name: "X.com",
    href: "https://x.com/TPatramanis",
  },
  {
    icon: Mail,
    name: "Email",
    href: "mailto:thomaspatramanis@gmail.com",
  },
]

export function SocialsSection() {
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const randomAngleRef = useRef(0)

  useEffect(() => {
    let animationFrame: number
    const animateRandom = () => {
      randomAngleRef.current += 0.02
      const gradientX = 50 + Math.cos(randomAngleRef.current) * 25
      const gradientY = 50 + Math.sin(randomAngleRef.current) * 25
      setGradientPos({ x: gradientX, y: gradientY })
      animationFrame = requestAnimationFrame(animateRandom)
    }

    animationFrame = requestAnimationFrame(animateRandom)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  const getItemFlex = (index: number) => {
    if (hoveredIndex === null) return "1 1 0"
    if (hoveredIndex === index) return "1.5 1 0"
    return "0.833 1 0"
  }

  return (
    <section className="py-24 px-10 relative z-10 bg-transparent pt-56" data-socials-section style={{ overflow: "clip", paddingBottom: "0" }}>
      <WaveGradientBackground />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-16 relative z-5 mt-16" style={{ zIndex: 5 }}>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-zinc-100" style={{ letterSpacing: "0.03em" }}>
            <span
              style={{
                letterSpacing: "0.05em",
                backgroundImage: `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, rgb(200, 200, 200) 0%, rgb(100, 100, 100) 50%, rgb(50, 50, 50) 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% 200%",
              }}
            >
              My
            </span>
            <span className="text-zinc-100"> Socials</span>
          </h2>
        </div>

        {/* Socials Grid */}
        <div className="flex gap-4 w-full">
          {socials.map((social, index) => {
            const Icon = social.icon
            return (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{
                  flex: getItemFlex(index),
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  mass: 1,
                }}
                style={{
                  flex: getItemFlex(index),
                  clipPath: "inset(0 round 16px)",
                }}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 cursor-pointer transition-colors duration-300 hover:bg-zinc-700/50 hover:border-zinc-600/50"
              >
                {/* Icon */}
                <motion.div
                  animate={{
                    filter: hoveredIndex === index
                      ? social.name === "X.com"
                        ? "drop-shadow(0 0 16px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 32px rgba(255, 255, 255, 0.6))"
                        : "drop-shadow(0 0 16px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 32px rgba(255, 255, 255, 0.4))"
                      : "drop-shadow(0 0 0px rgba(255, 255, 255, 0))"
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  {social.name === "X.com" ? (
                    <Icon className="w-8 h-8 text-zinc-100 hover:text-zinc-50 transition-colors" strokeWidth={2.5} />
                  ) : (
                    <Icon className="w-8 h-8 text-zinc-200 hover:text-zinc-100 transition-colors" />
                  )}
                </motion.div>

                {/* Label */}
                <motion.span
                  className="text-sm font-medium text-zinc-400 hover:text-zinc-300 transition-colors"
                  animate={{
                    textShadow: hoveredIndex === index
                      ? "0 0 8px rgba(255, 255, 255, 0.5), 0 0 16px rgba(255, 255, 255, 0.25)"
                      : "0 0 0px rgba(255, 255, 255, 0)"
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  {social.name}
                </motion.span>
              </motion.a>
            )
          })}
        </div>
      </div>

      {/* Copyright — inside the section so the wave gradient covers it fully */}
      <p className="relative z-10 text-center text-zinc-600 text-xs mt-16 pb-10">© 2026 All rights reserved.</p>
    </section>
  )
}
