import Link from "next/link"
import Image from "next/image"
import { ExternalLink, FileText } from "lucide-react"
import { ExperienceDivider } from "@/components/ui/experience-divider"
import { LiquidBorderCard } from "@/components/ui/liquid-border-card"
import { ScrollRevealCard } from "@/components/ui/scroll-reveal-card"

export function PortfolioSection() {
  return (
    <section className="relative z-10 px-6 md:px-12 pt-8" style={{ paddingBottom: '24px' }}>
      <div className="max-w-5xl mx-auto">

        {/* ── PROJECTS ─────────────────────────────────────── */}
        <div>
          <h2 data-projects-heading className="font-display text-4xl md:text-5xl font-bold mb-8">
            <span className="text-white">Projects </span><span className="exp-gradient">Portfolio</span>
          </h2>

          <div className="space-y-6">
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-4 gap-y-1">
                    <h3 className="font-display text-base sm:text-2xl font-semibold leading-snug sm:row-start-1 sm:col-start-1">
                      <span className="text-white">Adaptive Filters in Machine Learning Models for Sector Rotation Forecasting: </span>
                      <span className="exp-gradient">A Comparative Study under Shifting Uncertainty Regimes</span>
                    </h3>
                    <span className="font-display text-sm sm:text-2xl font-semibold text-zinc-300 sm:row-start-2 sm:col-start-1">BSc Thesis</span>
                    <span className="exp-gradient text-xs sm:text-base md:text-xl font-bold whitespace-nowrap sm:row-start-1 sm:col-start-2 sm:text-right">Feb 2026</span>
                    <span className="exp-gradient text-xs sm:text-base md:text-xl font-bold sm:row-start-2 sm:col-start-2 sm:text-right">Grade: 10/10</span>
                  </div>
                </div>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed text-justify">
                  Developed a robust ML pipeline for S&amp;P 500 sector rotation forecasting (2000–2025), leveraging the AutoGluon-Tabular framework to ensemble tree-based algorithms trained on approximately 450 engineered macroeconomic and technical features. Validated through strict Point-in-Time rolling windows with purge gaps, the core research evaluates 14 risk-filtering mechanisms across multiple time horizons using VectorBT, Alphalens, and QuantStats. Results demonstrate that predictive accuracy (Information Coefficient) becomes statistically significant at the quarterly horizon, while regime-based filters prove essential for strategy viability; successfully reducing maximum drawdown by 73% and generating positive Alpha compared to the high-risk, negative-Alpha profile of unfiltered ML predictions.
                </p>
                <div className="border border-zinc-600/50 bg-zinc-800/40 rounded-xl p-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                      <Image
                        src="/images/distributions.png"
                        alt="Distributions"
                        fill
                        draggable={false}
                        className="object-cover select-none"
                      />
                    </div>
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                      <Image
                        src="/images/equitycurve.png"
                        alt="Equity Curve"
                        fill
                        draggable={false}
                        className="object-cover select-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t border-zinc-700/50 pt-6 mt-6">
                  <Link
                    href="https://github.com/patramanis/dissertation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group w-fit"
                  >
                    <ExternalLink
                      size={28}
                      className="text-zinc-400 group-hover:text-zinc-200 transition-colors duration-200"
                    />
                    <span className="font-display text-xl font-semibold tracking-wider text-white group-hover:text-zinc-300 transition-colors duration-200">
                      Github
                    </span>
                  </Link>
                </div>
              </LiquidBorderCard>
            </ScrollRevealCard>
          </div>
        </div>

        <ExperienceDivider />

        {/* ── WRITING ──────────────────────────────────────── */}
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 text-right">
            <span className="text-white">Writing </span><span className="exp-gradient">Portfolio</span>
          </h2>

          <div className="space-y-6">
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-800/70 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-4 gap-y-1">
                    <h3 className="font-display text-base sm:text-2xl font-semibold leading-snug sm:row-start-1 sm:col-start-1">
                      <span className="text-white">Decentralized Trading: </span>
                      <span className="exp-gradient">Liquidity, Arbitrage &amp; Capital Efficiency</span>
                    </h3>
                    <span className="font-display text-sm sm:text-2xl font-semibold text-zinc-300 sm:row-start-2 sm:col-start-1">Finance Club Magazine, University of Macedonia</span>
                    <span className="exp-gradient text-xs sm:text-base md:text-xl font-bold whitespace-nowrap sm:row-start-1 sm:col-start-2 sm:text-right">Forthcoming, Apr 2026</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 italic mb-4">
                  Co-authored with another member.
                </p>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed text-justify">
                  Analysis of how decentralized finance is reshaping market microstructure, structured in two parts. Part I covers the shift from Central Limit Order Books to Automated Market Makers, explaining the constant product formula (x·y=k) that governs liquidity pools, the &quot;lazy liquidity&quot; inefficiency of uniform distribution across all price ranges, and Uniswap v3&apos;s concentrated liquidity as a solution. Part II examines the &quot;dark forest&quot; of transaction ordering: how the public mempool creates an adversarial pre-execution environment, the MEV extraction pipeline, and a quantitative framework for measuring MEV as a component of total execution cost. Empirical data on sandwich attacks, high attacker concentration, and the distinction between price efficiency through arbitrage and execution fairness for end users.
                </p>
              </LiquidBorderCard>
            </ScrollRevealCard>

            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-4 gap-y-1">
                    <h3 className="font-display text-base sm:text-2xl font-semibold leading-snug sm:row-start-1 sm:col-start-1">
                      <span className="text-white">Corporate &amp; Financial Overview </span>
                      <span className="exp-gradient">of Jumbo A.E.E.</span>
                    </h3>
                    <span className="font-display text-sm sm:text-2xl font-semibold text-zinc-300 sm:row-start-2 sm:col-start-1">Hellenic Investors Association (SED)</span>
                    <span className="exp-gradient text-xs sm:text-base md:text-xl font-bold whitespace-nowrap sm:row-start-1 sm:col-start-2 sm:text-right">Oct 2023</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 italic mb-4">
                  Co-authored with four students from three Greek universities.
                </p>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed text-justify">
                  Comprehensive analysis of Jumbo A.E.E., one of Greece&apos;s largest retail chains, produced as part of SED&apos;s Listed Companies General Meetings Monitoring Programme. The report covers the company&apos;s corporate profile and historical expansion, with detailed financial analysis including revenue trajectory, profitability metrics, stock performance and market capitalization, seasonality patterns in sales, the COVID-19 impact and subsequent recovery, competitive positioning within Greek retail, capital structure events (IPO, bond issuances, share capital increases), board composition and governance structure, and CSR activities. The analysis concludes with coverage of the 2023 Annual General Meeting.
                </p>
                <div className="border-t border-zinc-700/50 pt-6 mt-6">
                  <Link
                    href="https://drive.google.com/file/d/1t5sAd6NGO0RgrQNA244ny37wnLPGQb4y/view?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group w-fit"
                  >
                    <FileText
                      size={28}
                      className="text-zinc-400 group-hover:text-zinc-200 transition-colors duration-200"
                    />
                    <span className="font-display text-xl font-semibold tracking-wider text-white group-hover:text-zinc-300 transition-colors duration-200">
                      Paper
                    </span>
                  </Link>
                </div>
              </LiquidBorderCard>
            </ScrollRevealCard>
          </div>
        </div>

        <ExperienceDivider />

        {/* ── AWARDS ───────────────────────────────────────── */}
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
            <span className="text-white">Awards </span><span className="exp-gradient">Portfolio</span>
          </h2>

          <div className="space-y-6">
            {/* AIESEC in Greece */}
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-4 gap-y-1">
                    <h3 className="font-display text-base sm:text-2xl font-semibold text-white leading-snug sm:row-start-1 sm:col-start-1">Best Team Leader</h3>
                    <span className="font-display text-sm sm:text-2xl font-semibold text-zinc-300 sm:row-start-2 sm:col-start-1">AIESEC in Greece</span>
                    <span className="text-xs sm:text-base md:text-xl font-bold whitespace-nowrap sm:row-start-1 sm:col-start-2 sm:text-right">
                      <span className="exp-gradient">April 2025</span>
                      <span className="text-white mx-1">&amp;</span>
                      <span className="exp-gradient">June 2025</span>
                    </span>
                  </div>
                </div>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed text-justify">
                  Recognized for achieving the highest overall performance among peers, evaluated against a comprehensive set of quantitative and qualitative KPIs. My team secured the #1 national ranking for three out of five months and maintained a top-3 standing nationally throughout the semester.
                </p>
                <div className="border border-zinc-600/50 bg-zinc-800/40 rounded-xl p-4 mt-6 max-w-sm ">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <Image
                        src="/images/besttl.jfif"
                        alt="Best Team Leader Award"
                        fill
                        draggable={false}
                        className="object-cover select-none"
                      />
                    </div>
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <Image
                        src="/images/bestteam.jfif"
                        alt="Best Team Award"
                        fill
                        draggable={false}
                        className="object-cover select-none"
                      />
                    </div>
                  </div>
                </div>
              </LiquidBorderCard>
            </ScrollRevealCard>

            {/* Project Recognition */}
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-4 gap-y-1">
                    <h3 className="font-display text-base sm:text-2xl font-semibold text-white leading-snug sm:row-start-1 sm:col-start-1">Project Recognition</h3>
                    <span className="font-display text-sm sm:text-2xl font-semibold text-zinc-300 sm:row-start-2 sm:col-start-1">University of Macedonia</span>
                    <span className="exp-gradient text-xs sm:text-base md:text-xl font-bold whitespace-nowrap sm:row-start-1 sm:col-start-2 sm:text-right">January 2025</span>
                  </div>
                </div>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed text-justify">
                  Our project was selected via a competitive voting process to be presented at Pfizer's Center for Digital Innovation (CDI) in Thessaloniki.
                </p>
                <div className="border border-zinc-600/50 bg-zinc-800/40 rounded-xl p-4 mt-6 max-w-[566px]">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <Image
                        src="/images/pfizer1.jfif"
                        alt="Pfizer CDI Presentation 1"
                        fill
                        draggable={false}
                        className="object-cover select-none"
                      />
                    </div>
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <Image
                        src="/images/pfizer2.jfif"
                        alt="Pfizer CDI Presentation 2"
                        fill
                        draggable={false}
                        className="object-cover select-none"
                      />
                    </div>
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <Image
                        src="/images/pfizer3.jfif"
                        alt="Pfizer CDI Presentation 3"
                        fill
                        draggable={false}
                        className="object-cover select-none"
                      />
                    </div>
                  </div>
                </div>
              </LiquidBorderCard>
            </ScrollRevealCard>
          </div>
        </div>

      </div>
    </section>
  )
}
