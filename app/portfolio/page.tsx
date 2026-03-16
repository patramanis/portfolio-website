import { Navbar } from "@/components/ui/navbar"
import { FooterSection } from "@/components/sections/footer-section"

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Navbar />
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            A collection of my work in software development and data science.
          </p>
        </div>
      </section>
      <FooterSection />
    </main>
  )
}
