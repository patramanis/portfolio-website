"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { useRef } from "react"
import { LiquidMetalBorder } from "@/components/ui/liquid-metal-border"
import { FloatingClouds } from "@/components/ui/floating-clouds"
import { ParticleText } from "@/components/ui/particle-text"
import { usePerspectiveTransform } from "@/hooks/use-perspective-transform"

export function HeroSection() {
  const profileImageRef = useRef<HTMLDivElement>(null)

  // Apply perspective transform hook
  usePerspectiveTransform(profileImageRef, {
    maxRotation: 12,
    distance: 600,
    easing: 0.15,
  })

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] mt-20 flex flex-col overflow-hidden">
      {/* Background Pattern with low opacity */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: "url('/images/Welcome.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/30 via-transparent to-transparent pointer-events-none" />

      {/* Main Content - Two equal 50% containers */}
      <div className="relative z-10 flex flex-1 w-full">
        {/* Left side (50%) - Profile Image centered */}
        <div className="w-1/2 flex items-center justify-center overflow-hidden">
          <div className="relative">
            {/* Profile Image with Perspective Effect */}
            <div
              ref={profileImageRef}
              className="relative transition-transform duration-100 ease-out"
              style={{
                transformStyle: "preserve-3d",
                zIndex: 10,
              }}
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

            {/* Floating Clouds - Positioned above image */}
            <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
              <FloatingClouds />
            </div>
          </div>
        </div>

        {/* Right side (50%) - Text Content centered */}
        <div className="w-1/2 flex flex-col items-center justify-center overflow-hidden">
          {/* Container for all 3 texts - centered, no overflow */}
          <div className="flex flex-col gap-12 items-center justify-center w-full px-8">
            {/* "Hi, I am Thomas" - Single line */}
            <div>
              <div style={{ fontSize: "80px", lineHeight: "1", fontFamily: '"Cal Sans", system-ui, sans-serif', fontWeight: 700 }}>
                <span className="text-white">Hi, I am </span>
                <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
                  Thomas
                </span>
                <span style={{ background: "linear-gradient(135deg, #a1a1a1, #5a5a5a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>.</span>
              </div>
            </div>

            {/* "Welcome to my website" - All words inline, "to" vertical */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", justifyContent: "center" }}>
              <span className="font-display text-7xl font-bold text-white leading-none">
                Welcome
              </span>
              <span
                className="font-display text-3xl font-bold"
                style={{
                  background: "linear-gradient(135deg, #a1a1a1, #5a5a5a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                  height: "fit-content"
                }}
              >
                to
              </span>
              <span className="font-display text-3xl font-bold leading-none" style={{ background: "linear-gradient(135deg, #a1a1a1, #5a5a5a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                my
              </span>
              <ParticleText text="website" fontSize={120} />
            </div>

            {/* Subheadline - Two lines */}
            <p className="text-base md:text-lg text-zinc-500 text-center leading-relaxed" style={{ maxWidth: "360px" }}>
              I am an applied informatics graduate, with strong interest<br />
              in data science and quantitative finance.
            </p>
          </div>
        </div>
      </div>

      {/* "More about me" - Bottom center of right container */}
      <div className="relative z-10 w-1/2 ml-auto flex justify-center pb-8">
        <div className="flex flex-col items-center animate-bounce cursor-pointer">
          <span className="text-sm text-zinc-400 font-medium tracking-wide transition-colors duration-300 hover:text-zinc-200">
            More about me
          </span>
          <ChevronDown className="w-4 h-4 text-zinc-500 mt-1 transition-colors duration-300 hover:text-zinc-300" />
        </div>
      </div>
    </section>
  )
}
