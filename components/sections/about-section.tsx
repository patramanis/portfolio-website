"use client"

import { Code, Brain, Database, Boxes } from "lucide-react"
import { useRef, useEffect } from "react"
import { AboutWavesBackground } from "@/components/ui/about-waves-background"

const interests = [
  {
    icon: Brain,
    title: "Machine Learning",
    description: "Built a full ML pipeline in Python and trained ensemble models to forecast sector excess returns across nine S&P 500 sector ETFs.",
  },
  {
    icon: Boxes,
    title: "Quantitative Modeling",
    description: "Engineered uncertainty-driven features from macroeconomic and technical indicators to capture regime dynamics across equity sectors.",
  },
  {
    icon: Database,
    title: "Data Engineering",
    description: "Building a data platform to automate KPI tracking, streamline data flows, and generate reports.",
  },
  {
    icon: Code,
    title: "Software Development",
    description: "Built web applications, mobile apps, and data-driven tools using Python, Java, JavaScript, SQL, and C. ",
  },
]

export function AboutSection() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const meRef = useRef<HTMLSpanElement>(null)
  const myRef = useRef<HTMLSpanElement>(null)
  const randomAngleRef = useRef(0)

  useEffect(() => {
    let animationFrame: number
    const animateRandom = () => {
      randomAngleRef.current += 0.02
      const gradientX = 50 + Math.cos(randomAngleRef.current) * 25
      const gradientY = 50 + Math.sin(randomAngleRef.current) * 25
      if (meRef.current) {
        meRef.current.style.backgroundImage = `radial-gradient(circle at ${gradientX}% ${gradientY}%, rgb(200, 200, 200) 0%, rgb(100, 100, 100) 50%, rgb(50, 50, 50) 100%)`
      }
      if (myRef.current) {
        myRef.current.style.backgroundImage = `radial-gradient(circle at ${gradientX}% ${gradientY}%, rgb(255, 255, 255) 0%, rgb(100, 100, 100) 50%, rgb(30, 30, 30) 100%)`
      }
      animationFrame = requestAnimationFrame(animateRandom)
    }
    animationFrame = requestAnimationFrame(animateRandom)
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])
  return (
    <section className="px-10 pb-24 z-10 overflow-visible min-h-screen" style={{ position: "relative", marginTop: "-100px", paddingTop: "240px" }} data-about-section>
      <AboutWavesBackground />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-16 mx-auto" style={{ maxWidth: 'calc(42rem + 100px)' }}>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6 text-right" data-about-heading style={{ letterSpacing: "0.03em" }}>
            <span className="text-zinc-100">About </span>
            <span
              ref={meRef}
              style={{
                letterSpacing: "0.05em",
                backgroundImage: `radial-gradient(circle at 75% 50%, rgb(200, 200, 200) 0%, rgb(100, 100, 100) 50%, rgb(50, 50, 50) 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% 200%",
              }}
            >
              Me
            </span>
          </h2>
          <p className="text-lg text-zinc-500 leading-relaxed text-center text-justify">
            Recently completed my BSc in Applied Informatics at the University of Macedonia. I focus on building computational systems that turn data into valuable insights, with strong interest in financial markets and quantitative finance.
          </p>
        </div>

        {/* My areas of interest heading */}
        <div className="text-center mb-12 mt-10">
          <h3 ref={headingRef} className="font-display text-2xl md:text-3xl font-bold" style={{ letterSpacing: "0.03em" }}>
            <span
              ref={myRef}
              style={{
                letterSpacing: "0.05em",
                backgroundImage: `radial-gradient(circle at 75% 50%, rgb(255, 255, 255) 0%, rgb(100, 100, 100) 50%, rgb(30, 30, 30) 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200% 200%",
              }}
            >
              My
            </span>
            <span className="text-zinc-100"> areas of interest</span>
          </h3>
        </div>

        {/* Interests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interests.map((interest) => (
            <div
              key={interest.title}
              className="group p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 hover:bg-zinc-700/50"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-zinc-700/50 text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  <interest.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-zinc-100 mb-2" style={{ letterSpacing: "0.03em" }}>
                    {interest.title}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed">
                    {interest.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
