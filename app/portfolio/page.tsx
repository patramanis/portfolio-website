import { Navbar } from "@/components/ui/navbar"
import { FooterSection } from "@/components/sections/footer-section"
import { PortfolioHeroSection } from "@/components/sections/portfolio-hero-section"
import { QuantFlowBackground } from "@/components/ui/quant-flow-background"

export default function ProjectsPage() {
  return (
    <main className="bg-transparent">
      <QuantFlowBackground />
      <Navbar />
      <PortfolioHeroSection />
      <FooterSection />
    </main>
  )
}
