"use client"

import Link from "next/link"
import { FileCode2, ExternalLink } from "lucide-react"
import React from "react"
import { LiquidBorderCard } from "@/components/ui/liquid-border-card"
import { ExperienceDivider } from "@/components/ui/experience-divider"
import { ScrollRevealCard } from "@/components/ui/scroll-reveal-card"

export function ExperienceSection() {
  return (
    <section className="relative z-10 px-6 md:px-12 pt-32 pb-48">
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .exp-gradient {
          animation: gradientShift 5s ease-in-out infinite;
          background-size: 200% 200%;
          background-image: linear-gradient(135deg, #a1a1a1 0%, #d4d4d4 25%, #5a5a5a 50%, #d4d4d4 75%, #a1a1a1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">

        {/* ── EDUCATIONAL EXPERIENCE ─────────────────────────────── */}
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
            <span className="text-white">Educational </span>
            <span className="exp-gradient">Experience</span>
          </h2>

          <ScrollRevealCard>
          <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
            <div className="bg-black/20 rounded-xl p-5 mb-6">
              <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                <h3 className="font-display text-2xl font-semibold">
                  <span className="exp-gradient">BSc in </span>
                  <span className="text-white">Applied Informatics - Information Systems</span>
                </h3>
                <span className="exp-gradient text-base md:text-xl font-bold whitespace-nowrap leading-relaxed">Sep 2021 – Feb 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-display text-2xl font-semibold text-zinc-300 leading-relaxed">University of Macedonia</span>
                <span className="exp-gradient text-base md:text-xl font-bold leading-relaxed">Thessaloniki, Greece</span>
              </div>
            </div>

            <ul className="ml-4 space-y-3 mb-8">
              <li className="flex gap-2 text-base md:text-xl text-zinc-400 leading-relaxed">
                <span className="shrink-0">•</span>
                <span><span className="font-bold">GPA:</span> 7.4/10.</span>
              </li>
              <li className="flex gap-2 text-base md:text-xl text-zinc-400 leading-relaxed">
                <span className="shrink-0">•</span>
                <span><span className="font-bold">Focused Coursework:</span> Data Structures, Algorithms, System Analysis &amp; Design, Operations Research, Mathematical Analysis.</span>
              </li>
              <li className="text-base md:text-xl text-zinc-500 leading-relaxed">
                Exceeded degree requirements (265/240 ECTS) to undertake an optional quantitative research thesis and complete additional advanced coursework.
              </li>
            </ul>

            <div className="border-t border-zinc-700/50 pt-6">
              <Link
                href="https://github.com/patramanis/dissertation"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group w-fit"
              >
                <FileCode2
                  size={28}
                  className="text-zinc-400 group-hover:text-zinc-200 transition-colors duration-200"
                />
                <span className="font-display text-xl font-semibold tracking-wider text-white group-hover:text-zinc-300 transition-colors duration-200">
                  My Thesis Project
                </span>
              </Link>
            </div>
          </LiquidBorderCard>
          </ScrollRevealCard>
        </div>

        <ExperienceDivider />

        {/* ── PROFESSIONAL EXPERIENCE ────────────────────────────── */}
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 text-right">
            <span className="text-white">Professional </span>
            <span className="exp-gradient">Experience</span>
          </h2>

          <div className="space-y-6">

            {/* Tradi Art — Present */}
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                    <h3 className="font-display text-2xl font-semibold text-white">Operations Coordinator</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base md:text-xl text-zinc-500 font-medium">Contract based</span>
                      <span className="font-display text-base md:text-xl font-bold text-white">·</span>
                      <span className="exp-gradient text-base md:text-xl font-bold whitespace-nowrap leading-relaxed">Sep 2021 – Present</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-2xl font-semibold text-zinc-300 leading-relaxed">Tradi Art</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base md:text-xl text-zinc-500 font-medium">Hybrid</span>
                      <span className="font-display text-base md:text-xl font-bold text-white">·</span>
                      <span className="exp-gradient text-base md:text-xl font-bold leading-relaxed">Ioannina, Epirus, Greece</span>
                    </div>
                  </div>
                </div>
                <ul className="ml-4 space-y-3">
                  <li className="flex gap-2 text-base md:text-xl text-zinc-400 leading-relaxed">
                    <span className="shrink-0">•</span>
                    <span>Assisted with logistical coordination and on-site support in over 120 technical projects, ensuring smooth execution under strict deadlines.</span>
                  </li>
                  <li className="flex gap-2 text-base md:text-xl text-zinc-400 leading-relaxed">
                    <span className="shrink-0">•</span>
                    <span>Conducted safety inspections and quality checks, proactively identifying and resolving 10+ overlooked issues, contributing to safer and more efficient work environments.</span>
                  </li>
                  <li className="text-base md:text-xl text-zinc-500 leading-relaxed">
                    Since October 2024, transitioned to a fully remote coordination role, maintaining Excel trackers and weekly status summaries (deliveries, milestones, constraints) to improve planning visibility and coordination.
                  </li>
                </ul>
              </LiquidBorderCard>
            </ScrollRevealCard>

            {/* Water Solutions — Sep 2024 */}
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                    <h3 className="font-display text-2xl font-semibold text-white">Administrative &amp; Data Support</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base md:text-xl text-zinc-500 font-medium">Seasonal</span>
                      <span className="font-display text-base md:text-xl font-bold text-white">·</span>
                      <span className="exp-gradient text-base md:text-xl font-bold whitespace-nowrap leading-relaxed">Jul 2023 – Sep 2024</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-2xl font-semibold text-zinc-300 leading-relaxed">Water Solutions</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base md:text-xl text-zinc-500 font-medium">On-site</span>
                      <span className="font-display text-base md:text-xl font-bold text-white">·</span>
                      <span className="exp-gradient text-base md:text-xl font-bold leading-relaxed">Rhodes, Greece</span>
                    </div>
                  </div>
                </div>
                <ul className="ml-4 space-y-3">
                  <li className="flex gap-2 text-base md:text-xl text-zinc-400 leading-relaxed">
                    <span className="shrink-0">•</span>
                    <span>Reorganized and reclassified 150+ financial documents, eliminating missing-record incidents and improving reporting accuracy.</span>
                  </li>
                  <li className="flex gap-2 text-base md:text-xl text-zinc-400 leading-relaxed">
                    <span className="shrink-0">•</span>
                    <span>Supported inventory and logistics tracking for technical materials, resolving 5 SKU mismatches and improving operational coordination.</span>
                  </li>
                  <li className="flex gap-2 text-base md:text-xl text-zinc-400 leading-relaxed">
                    <span className="shrink-0">•</span>
                    <span>Created structured directories and assisted with quotations/client offers, contributing to better document control and internal workflow efficiency.</span>
                  </li>
                </ul>
              </LiquidBorderCard>
            </ScrollRevealCard>

          </div>
        </div>

        <ExperienceDivider />

        {/* ── VOLUNTEERING EXPERIENCE ────────────────────────────── */}
        {/*
          Ordered by end date, newest first. Tiebreaker: shorter duration goes lower.
          1. Finance Club UoM     — Present · 6 mos  (Present, longer → higher)
          2. Data Engineer AIESEC — Present · 2 mos  (Present, shorter → lower)
          3. Team Leader AIESEC   — Jul 2025 · 6 mos
          4. Associate AIESEC     — Feb 2025 · 6 mos
          5. Marathon             — Oct 2024 · 1 mo
        */}
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
            <span className="text-white">Volunteering </span>
            <span className="exp-gradient">Experience</span>
          </h2>

          <div className="space-y-6">

            {/* 1. Finance Club UoM — Present */}
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                    <h3 className="font-display text-2xl font-semibold text-white">Associate</h3>
                    <span className="exp-gradient text-base md:text-xl font-bold whitespace-nowrap leading-relaxed">Oct 2025 – Present</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-2xl font-semibold text-zinc-300 leading-relaxed">Finance Club UoM</span>
                    <span className="exp-gradient text-base md:text-xl font-bold leading-relaxed">Thessaloniki, Greece</span>
                  </div>
                </div>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed">
                  Co-authored an analytical article on Decentralized Crypto Trading for the Finance Club&apos;s Journal (exp. publication April 2026), alongside active participation in seminars on equity markets and finance.
                </p>
              </LiquidBorderCard>
            </ScrollRevealCard>

            {/* 2. Data Engineer AIESEC — Present */}
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                    <h3 className="font-display text-2xl font-semibold text-white">Data Engineer</h3>
                    <span className="exp-gradient text-base md:text-xl font-bold whitespace-nowrap leading-relaxed">Feb 2026 – Present</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-2xl font-semibold text-zinc-300 leading-relaxed">AIESEC in Greece</span>
                    <span className="exp-gradient text-base md:text-xl font-bold leading-relaxed">Remote</span>
                  </div>
                </div>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed">
                  Co-developing an internal data platform and centralized database via API integrations, aiming to bypass legacy system bottlenecks and automate reporting.
                </p>
              </LiquidBorderCard>
            </ScrollRevealCard>

            {/* 3. Team Leader AIESEC — Jul 2025 */}
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                    <h3 className="font-display text-2xl font-semibold text-white">Team Leader</h3>
                    <span className="exp-gradient text-base md:text-xl font-bold whitespace-nowrap leading-relaxed">Feb 2025 – Jul 2025</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-2xl font-semibold text-zinc-300 leading-relaxed">AIESEC in Greece</span>
                    <span className="exp-gradient text-base md:text-xl font-bold leading-relaxed">Thessaloniki, Greece</span>
                  </div>
                </div>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed">
                  Led a team of 4 in strategizing and executing marketing initiatives. Delivered training, tracked performance, and coordinated with external partners. Focused on developing leadership potential within the team and increasing visibility of AIESEC&apos;s programs.
                </p>
                <div className="border-t border-zinc-700/50 pt-6 mt-6">
                  <Link
                    href="https://drive.google.com/file/d/1gVgILucfKIJtIcYgedM_1L3KzGeazzVj/view?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group w-fit"
                  >
                    <ExternalLink
                      size={28}
                      className="text-zinc-400 group-hover:text-zinc-200 transition-colors duration-200"
                    />
                    <span className="font-display text-xl font-semibold tracking-wider text-white group-hover:text-zinc-300 transition-colors duration-200">
                      View Certificate
                    </span>
                  </Link>
                </div>
              </LiquidBorderCard>
            </ScrollRevealCard>

            {/* 4. Associate AIESEC — Feb 2025 */}
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                    <h3 className="font-display text-2xl font-semibold text-white">Associate</h3>
                    <span className="exp-gradient text-base md:text-xl font-bold whitespace-nowrap leading-relaxed">Sep 2024 – Feb 2025</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-2xl font-semibold text-zinc-300 leading-relaxed">AIESEC in Greece</span>
                    <span className="exp-gradient text-base md:text-xl font-bold leading-relaxed">Thessaloniki, Greece</span>
                  </div>
                </div>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed">
                  Contributed to local marketing campaigns to promote exchange programs via digital content, events, and direct outreach. Collaborated with cross-functional teams to reach engagement goals.
                </p>
                <div className="border-t border-zinc-700/50 pt-6 mt-6">
                  <Link
                    href="https://drive.google.com/file/d/17HujltRF_7hHHwQ99OW8dyLur69HZv__/view?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group w-fit"
                  >
                    <ExternalLink
                      size={28}
                      className="text-zinc-400 group-hover:text-zinc-200 transition-colors duration-200"
                    />
                    <span className="font-display text-xl font-semibold tracking-wider text-white group-hover:text-zinc-300 transition-colors duration-200">
                      View Certificate
                    </span>
                  </Link>
                </div>
              </LiquidBorderCard>
            </ScrollRevealCard>

            {/* 5. Marathon — Oct 2024 */}
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap mb-1">
                    <h3 className="font-display text-2xl font-semibold text-white">Volunteer Assistant</h3>
                    <span className="exp-gradient text-base md:text-xl font-bold whitespace-nowrap leading-relaxed">Oct 2024</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-2xl font-semibold text-zinc-300 leading-relaxed">Thessaloniki Night Half Marathon</span>
                    <span className="exp-gradient text-base md:text-xl font-bold leading-relaxed">Thessaloniki, Greece</span>
                  </div>
                </div>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed">
                  Managed course safety, spectator control, and runner assistance for a designated race sector.
                </p>
                <div className="border-t border-zinc-700/50 pt-6 mt-6">
                  <Link
                    href="https://drive.google.com/file/d/1X61cJ6URCA_F4wUekTOIOLdkYTV5g-Vi/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group w-fit"
                  >
                    <ExternalLink
                      size={28}
                      className="text-zinc-400 group-hover:text-zinc-200 transition-colors duration-200"
                    />
                    <span className="font-display text-xl font-semibold tracking-wider text-white group-hover:text-zinc-300 transition-colors duration-200">
                      View Certificate
                    </span>
                  </Link>
                </div>
              </LiquidBorderCard>
            </ScrollRevealCard>

          </div>
        </div>

      </div>
    </section>
  )
}
