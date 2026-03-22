"use client"

import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { WaveCard } from "@/components/ui/wave-card"
import { ScreenBackground } from "@/components/ui/screen-background"

const stats = [
  { target: 1, label: "Research Project", href: "/portfolio" },
  { target: 1, label: "Published Article", href: "/portfolio" },
  { target: 5, label: "Volunteering Roles", href: "/experience" },
  { target: 2, label: "Professional Roles", href: "/experience" },
  { target: 3, label: "Recognition Awards", href: "/portfolio" },
]

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  // Start only when this element scrolls into view
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Run counter RAF only after entering viewport
  useEffect(() => {
    if (!hasStarted) return
    let animationFrame: number
    const duration = 2000
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [hasStarted, target])

  return <span ref={ref}>{count}</span>
}

export function StatsSection() {
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 })
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

  return (
    <section className="stats-section-root py-24 px-4 sm:px-10 relative z-10 bg-transparent" data-stats-section style={{ marginTop: "-40px", overflow: "hidden" }}>
      <style>{`
        /* When backgrounds disappear (1280px), bring the section up ~20% */
        @media (max-width: 1280px) {
          .stats-section-root {
            margin-top: -140px !important;
            padding-top: 60px !important;
          }
        }
      `}</style>
      <ScreenBackground />
      <div className="max-w-5xl mx-auto relative z-10 mt-20">
        {/* Section Header */}
        <div className="mb-16 relative z-5" style={{ zIndex: 5 }}>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-zinc-100" style={{ letterSpacing: "0.03em" }}>
            My stats <span
              style={{
                letterSpacing: "0.05em",
                backgroundImage: `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, rgb(200, 200, 200) 0%, rgb(100, 100, 100) 50%, rgb(50, 50, 50) 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% 200%",
              }}
            >so far</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="space-y-6 relative z-10" style={{ zIndex: 10 }}>
          {/* First Row - 2 items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {stats.slice(0, 2).map((stat) => (
              <Link key={stat.label} href={stat.href}>
                <WaveCard>
                  <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 cursor-pointer transition-all duration-300 hover:bg-zinc-700/50 hover:border-zinc-600/50">
                    <div className="text-4xl font-bold text-zinc-100 mb-2" style={{ letterSpacing: "0.03em" }}>
                      <AnimatedCounter target={stat.target} />
                    </div>
                    <p className="text-zinc-500">{stat.label}</p>
                  </div>
                </WaveCard>
              </Link>
            ))}
          </div>

          {/* Second Row - 3 items */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {stats.slice(2).map((stat) => (
              <Link key={stat.label} href={stat.href}>
                <WaveCard>
                  <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 cursor-pointer transition-all duration-300 hover:bg-zinc-700/50 hover:border-zinc-600/50">
                    <div className="text-4xl font-bold text-zinc-100 mb-2" style={{ letterSpacing: "0.03em" }}>
                      <AnimatedCounter target={stat.target} />
                    </div>
                    <p className="text-zinc-500">{stat.label}</p>
                  </div>
                </WaveCard>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
