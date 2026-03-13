"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { LiquidMetalBorder } from "@/components/ui/liquid-metal-border"
import { FloatingClouds } from "@/components/ui/floating-clouds"
import { usePerspectiveTransform } from "@/hooks/use-perspective-transform"

export function HeroSection() {
  const profileImageRef = useRef<HTMLDivElement>(null)
  const moreAboutMeRef = useRef<HTMLDivElement>(null)
  const [opacity, setOpacity] = useState(1)

  usePerspectiveTransform(profileImageRef, {
    maxRotation: 12,
    distance: 600,
    easing: 0.05,
  })

  useEffect(() => {
    const aboutHeading = document.querySelector('[data-about-heading]')
    if (!aboutHeading) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Calculate opacity based on intersection ratio
        // When "About Me" is completely off-screen below: opacity = 1
        // When "About Me" is entering the viewport from bottom: opacity fades out
        // When "About Me" is fully visible: opacity = 0
        const newOpacity = 1 - entry.intersectionRatio
        setOpacity(newOpacity)
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      }
    )

    observer.observe(aboutHeading)
    return () => observer.disconnect()
  }, [])

  const greyGradient = {
    background: "linear-gradient(135deg, #a1a1a1, #5a5a5a)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  } as React.CSSProperties

  return (
    <section className="relative w-full h-[calc(100vh-56px)] mt-14 overflow-hidden">
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animated-gradient-thomas {
          animation: gradientShift 6s ease-in-out infinite;
          background-size: 200% 200%;
          background-image: linear-gradient(135deg, #ffffff 0%, #e0e0e0 25%, #ffffff 50%, #b8b8b8 75%, #ffffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .animated-gradient-secondary {
          animation: gradientShift 5s ease-in-out infinite;
          background-size: 200% 200%;
          background-image: linear-gradient(135deg, #a1a1a1 0%, #d4d4d4 25%, #5a5a5a 50%, #d4d4d4 75%, #a1a1a1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes glowFlicker {
          0%, 85% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(100, 200, 255, 0.6);
          }
          90% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.56), 0 0 40px rgba(100, 200, 255, 0.42);
          }
          95%, 100% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(100, 200, 255, 0.6);
          }
        }

        .glow-website {
          animation: glowFlicker 4s ease-in-out infinite;
        }
      `}</style>
      {/* Floating Clouds - section level, full viewport width */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <FloatingClouds />
      </div>

      {/* Two equal 50% containers filling the available space */}
      <div className="relative z-10 flex w-full h-full">
        {/* LEFT (50%) - Profile Image centered */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="relative" style={{ transform: "translateX(-11%)" }}>
            <div
              ref={profileImageRef}
              className="relative"
              style={{ transformStyle: "preserve-3d", zIndex: 20 }}
            >
              <LiquidMetalBorder
                borderRadius={24}
                borderWidth={3}
                opacity={0.85}
                speed={0.7}
                className="shadow-2xl shadow-zinc-900/60"
              >
                <div className="w-72 h-80 md:w-96 md:h-[440px] rounded-[18px] overflow-hidden bg-zinc-900">
                  <Image
                    src="/images/profile.png"
                    alt="Profile photo"
                    width={400}
                    height={500}
                    className="object-cover w-full h-full object-top"
                    priority
                  />
                </div>
              </LiquidMetalBorder>
            </div>

          </div>
        </div>

        {/* RIGHT (50%) - Text Content centered, More about me at bottom */}
        <div className="w-1/2 relative flex flex-col justify-center pr-[10%]" style={{ zIndex: 20, overflow: "visible" }}>
          {/* Text group - centered in the container */}
          <div className="flex flex-col gap-8" style={{ alignItems: "flex-start", position: "relative", zIndex: 20 }}>
            {/* "Hi, I am Thomas." - slight right offset */}
            <div style={{ paddingLeft: "20px" }}>
              <div style={{ fontSize: "80px", lineHeight: "1", fontFamily: '"Cal Sans", system-ui, sans-serif', fontWeight: 700 }}>
                <span className="text-white">Hi, I am </span>
                <span className="animated-gradient-thomas">
                  Thomas
                </span>
                <span style={greyGradient}>.</span>
              </div>
            </div>

            {/* "Welcome to my website" - shifted 25% left */}
            <div style={{ transform: "translateX(-20%)", paddingLeft: "10%" }}>
              {/* Row 1: Welcome + to(vertical, right of Welcome) */}
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span
                  className="font-display font-bold text-white leading-none"
                  style={{ fontSize: "72px" }}
                >
                  Welcome
                </span>
                <span
                  className="font-display font-bold animated-gradient-secondary"
                  style={{
                    fontSize: "50px",
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    marginLeft: "-2%",
                    transform: "rotate(360deg)",
                  }}
                >
                  to
                </span>
              </div>
              {/* Row 2: my + website */}
              <div style={{ display: "flex", alignItems: "center", gap: "3px", marginTop: "-4px" }}>
                <span
                  className="font-display font-bold leading-none animated-gradient-secondary"
                  style={{
                    fontSize: "40px",
                    paddingBottom: "6px",
                    marginTop: "-18%",
                    marginLeft: "1%",
                  }}
                >
                  my
                </span>
                <span
                  className="glow-website leading-none text-white"
                  style={{
                    fontFamily: "'Allura', cursive",
                    fontSize: "120px",
                    marginTop: "-2%",
                    fontWeight: 400,
                    marginLeft: "-2%",
                    letterSpacing: "-0.01em",
                  }}
                >
                  website
                </span>
              </div>
            </div>

            {/* Subheadline - Two lines */}
            <p className="text-base md:text-xl text-zinc-500 leading-relaxed" style={{ paddingLeft: "30px", marginTop: "-4%", marginLeft: "2.5%" }}>
              I am an applied informatics graduate, with strong<br />
              interest in data science and quantitative analysis.
            </p>
          </div>

        </div>
      </div>

      {/* "More about me" - center of gap between image and right edge, 5% up from bottom */}
      <div
        ref={moreAboutMeRef}
        className="absolute flex flex-col items-center animate-bounce cursor-pointer z-30 transition-opacity duration-300"
        style={{
          bottom: "5%",
          left: "64.7%",
          transform: "translateX(-50%)",
          opacity: opacity,
          pointerEvents: opacity < 0.1 ? 'none' : 'auto'
        }}
      >
        <span className="text-sm text-zinc-400 font-medium tracking-wide transition-colors duration-300 hover:text-zinc-200">
          More about me
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-500 mt-1 transition-colors duration-300 hover:text-zinc-300" />
      </div>
    </section>
  )
}
