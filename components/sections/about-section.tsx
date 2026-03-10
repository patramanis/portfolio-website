"use client"

import { Code, TrendingUp, Brain, GraduationCap } from "lucide-react"

const interests = [
  {
    icon: TrendingUp,
    title: "Quantitative Finance",
    description: "Applying mathematical models and computational techniques to financial markets and trading strategies.",
  },
  {
    icon: Brain,
    title: "Machine Learning",
    description: "Developing intelligent systems that learn from data to solve complex real-world problems.",
  },
  {
    icon: Code,
    title: "Software Development",
    description: "Building robust, scalable applications with modern technologies and best practices.",
  },
  {
    icon: GraduationCap,
    title: "Academic Research",
    description: "Exploring cutting-edge topics at the intersection of computer science and finance.",
  },
]

export function AboutSection() {
  return (
    <section className="py-24 px-6 bg-zinc-950/50">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="text-zinc-100">About </span>
            <span className="bg-gradient-to-r from-zinc-500 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            A passionate informatics graduate with a focus on leveraging technology
            to solve complex problems in quantitative finance and machine learning.
          </p>
        </div>

        {/* Interests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interests.map((interest, index) => (
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
