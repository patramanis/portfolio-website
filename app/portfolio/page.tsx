import { Navbar } from "@/components/ui/navbar"
import { FooterSection } from "@/components/sections/footer-section"
import { PortfolioHeroSection } from "@/components/sections/portfolio-hero-section"
import { NodeNetworkBackground } from "@/components/ui/node-network-background"

export default function ProjectsPage() {
  return (
    <main className="bg-transparent">
      <NodeNetworkBackground />
      <Navbar />
      <PortfolioHeroSection />
      <FooterSection />
    </main>
  )
}
