"use client"

import { Github, Linkedin, Mail, X } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"

const socials = [
  {
    icon: Github,
    name: "GitHub",
    href: "https://github.com",
    color: "hover:text-zinc-300",
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    href: "https://linkedin.com",
    color: "hover:text-zinc-300",
  },
  {
    icon: X,
    name: "X.com",
    href: "https://x.com",
    color: "hover:text-zinc-300",
  },
  {
    icon: Mail,
    name: "Email",
    href: "mailto:contact@example.com",
    color: "hover:text-zinc-300",
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
    <section className="py-24 px-10 relative z-10 bg-transparent" data-socials-section>
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 relative z-5" style={{ zIndex: 5 }}>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-zinc-100">
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
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 cursor-pointer transition-colors duration-300 hover:bg-zinc-700/50 hover:border-zinc-600/50"
                style={{
                  flex: getItemFlex(index),
                }}
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
              >
                {social.name === "X.com" ? (
                  <motion.div
                    animate={{
                      filter: hoveredIndex === index
                        ? "drop-shadow(0 0 12px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 24px rgba(255, 255, 255, 0.3))"
                        : "drop-shadow(0 0 0px rgba(255, 255, 255, 0))"
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  >
                    <img
                      src="/images/xlogo.png"
                      alt="X"
                      style={{
                        width: "31px",
                        height: "31px",
                        filter: "invert(1) brightness(1.2)",
                        opacity: 0.7,
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{
                      filter: hoveredIndex === index
                        ? "drop-shadow(0 0 12px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 24px rgba(255, 255, 255, 0.3))"
                        : "drop-shadow(0 0 0px rgba(255, 255, 255, 0))"
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  >
                    <Icon className={`w-8 h-8 text-zinc-400 transition-colors ${social.color}`} />
                  </motion.div>
                )}
                <motion.span
                  className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors"
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
    </section>
  )
}
