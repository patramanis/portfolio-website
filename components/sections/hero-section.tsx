"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { FolderTabDivider } from "@/components/ui/folder-tab-divider"

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col px-6 pt-24 pb-0 relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-transparent" />

      {/* Main Content - Two column layout */}
      <div className="relative z-10 flex-1 flex items-center max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

          {/* Left side - Profile Image */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative">
              {/* Square with smooth corners */}
              <div className="w-72 h-80 md:w-96 md:h-[440px] rounded-3xl overflow-hidden border border-zinc-700/40 shadow-2xl shadow-zinc-900/60">
                <Image
                  src="/images/profile.png"
                  alt="Profile photo"
                  width={400}
                  height={500}
                  className="object-cover w-full h-full object-top"
                  priority
                />
              </div>
              {/* Subtle corner glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-zinc-500/5 via-transparent to-zinc-300/5 pointer-events-none" />
            </div>
          </div>

          {/* Right side - Text Content */}
          <div className="text-left order-1 lg:order-2 flex flex-col">
            {/* Headline — extra letter-spacing so lines breathe */}
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-widest leading-tight mb-8">
              <span className="text-zinc-100 block mb-3">Welcome to</span>
              <span className="block">
                <span className="text-zinc-100">my </span>
                <span className="bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                  website.
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-zinc-500 max-w-xl mb-10 leading-relaxed">
              I am an applied informatics graduate, with strong interest in data science and quantitative finance.
            </p>

            {/* "More about me" — static, centered under the text block */}
            <div className="flex flex-col items-start gap-2">
              <span className="text-sm text-zinc-400 font-medium tracking-wide">More about me</span>
              <ChevronDown className="w-4 h-4 text-zinc-500 ml-[2px]" />
            </div>
          </div>

        </div>
      </div>

      {/* Folder tab line divider at bottom — curves at heading midpoint */}
      <div className="relative z-10 mt-auto">
        <FolderTabDivider />
      </div>
    </section>
  )
}
