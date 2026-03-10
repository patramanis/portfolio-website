"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { LiquidMetalBorder } from "@/components/ui/liquid-metal-border"

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col px-6 pt-24 pb-12 relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-transparent" />

      {/* Main Content - Two column layout */}
      <div className="relative z-10 flex-1 flex items-center max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

          {/* Left side - Profile Image with Liquid Metal Border */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <LiquidMetalBorder
              borderRadius={24}
              borderWidth={6}
              opacity={0.85}
              speed={0.7}
              className="shadow-2xl shadow-zinc-900/60 transition-all duration-500 hover:shadow-zinc-700/40 hover:scale-[1.02]"
            >
              <div className="w-72 h-80 md:w-96 md:h-[440px] rounded-[18px] overflow-hidden bg-zinc-900">
                <Image
                  src="/images/profile.png"
                  alt="Profile photo"
                  width={400}
                  height={500}
                  className="object-cover w-full h-full object-top transition-transform duration-700 hover:scale-105"
                  priority
                />
              </div>
            </LiquidMetalBorder>
          </div>

          {/* Right side - Text Content */}
          <div className="text-left order-1 lg:order-2 flex flex-col">
            {/* Headline — balanced letter-spacing */}
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-wide leading-tight mb-8">
              <span className="text-zinc-100 block mb-3">Welcome to</span>
              <span className="block">
                <span className="text-zinc-100">my </span>
                <span className="bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                  website.
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-zinc-500 max-w-xl mb-12 leading-relaxed">
              I am an applied informatics graduate, with strong interest in data science and quantitative finance.
            </p>

            {/* "More about me" — centered relative to text block, with bounce animation */}
            <div className="flex flex-col items-center max-w-xl animate-bounce">
              <span className="text-sm text-zinc-400 font-medium tracking-wide transition-colors duration-300 hover:text-zinc-200 cursor-pointer">
                More about me
              </span>
              <ChevronDown className="w-4 h-4 text-zinc-500 mt-1 transition-colors duration-300 hover:text-zinc-300" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
