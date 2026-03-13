"use client"

import { Code, Brain, Database, Boxes } from "lucide-react"

const interests = [
  {
    icon: Brain,
    title: "Machine Learning",
    description: "Developing intelligent systems that learn from data to solve complex real-world problems.",
  },
  {
    icon: Database,
    title: "Data Engineering",
    description: "Designing and managing data pipelines to ensure efficient data flow, storage, and processing.",
  },
  {
    icon: Boxes,
    title: "Modeling",
    description: "Applying mathematical models and computational techniques, especially to financial markets.",
  },
  {
    icon: Code,
    title: "Software Development",
    description: "Building robust, scalable applications with modern technologies.",
  },
]

export function AboutSection() {
  return (
    <section className="py-24 px-6" style={{ backgroundImage: "url('/images/sxf.png')", backgroundSize: "cover", backgroundPosition: "top" }} data-about-section>
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6" data-about-heading>
            <span className="text-zinc-100">About </span>
            <span className="bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed text-center text-justify">
            Currently based in Thessaloniki, I am actively expanding my skills in informatics and
            finance, while also working and volunteering. I am passionate about solving complex problems
            and researching. Moreover, I am eager to contribute to impactful projects or initiatives.
          </p>
        </div>

        {/* My areas of interest heading */}
        <div className="text-center mb-12 mt-10">
          <h3
            className="font-display text-2xl md:text-3xl font-bold text-zinc-100"
          >
            My areas of interest
          </h3>
        </div>

        {/* Interests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interests.map((interest) => (
            <div
              key={interest.title}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 hover:bg-zinc-900/80"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-zinc-800/50 text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  <interest.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-zinc-100 mb-2">
                    {interest.title}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed">
                    {interest.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
