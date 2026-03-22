import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Thomas - Experience",
}
import { ExperienceSection } from "@/components/sections/experience-section"
import { ExperienceHeroSection } from "@/components/sections/experience-hero-section"
import { NodeNetworkBackground } from "@/components/ui/node-network-background"

export default function ExperiencePage() {
  return (
    <main className="bg-transparent">
      <NodeNetworkBackground />
      <ExperienceHeroSection />
      <ExperienceSection />
      <p className="text-center text-zinc-600 text-xs mt-20 pb-10">© 2026 All rights reserved.</p>
    </main>
  )
}
