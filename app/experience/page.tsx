import { Navbar } from "@/components/ui/navbar"
import { FooterSection } from "@/components/sections/footer-section"
import { ExperienceSection } from "@/components/sections/experience-section"
import { ExperienceHeroSection } from "@/components/sections/experience-hero-section"
import { NodeNetworkBackground } from "@/components/ui/node-network-background"

export default function ExperiencePage() {
  return (
    <main className="bg-transparent">
      <NodeNetworkBackground />
      <Navbar />
      <ExperienceHeroSection />
      <ExperienceSection />
      <FooterSection />
    </main>
  )
}
