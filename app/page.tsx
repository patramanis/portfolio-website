import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { StatsSection } from "@/components/sections/stats-section"
import { SocialsSection } from "@/components/sections/socials-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent" style={{ overflowX: "clip" }}>
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <SocialsSection />
    </main>
  )
}
