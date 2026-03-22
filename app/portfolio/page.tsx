import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Thomas - Portfolio",
}
import { PortfolioHeroSection } from "@/components/sections/portfolio-hero-section"
import { PortfolioSection } from "@/components/sections/portfolio-section"
import { NodeNetworkBackground } from "@/components/ui/node-network-background"

export default function ProjectsPage() {
  return (
    <main className="bg-transparent">
      <NodeNetworkBackground />
      <PortfolioHeroSection />
      <PortfolioSection />
      <p className="text-center text-zinc-600 text-xs mt-20 pb-10">© 2026 All rights reserved.</p>
    </main>
  )
}
