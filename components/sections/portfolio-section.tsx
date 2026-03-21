import Link from "next/link"
import Image from "next/image"
import { Github } from "lucide-react"
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
            <span className="exp-gradient">Projects</span>
          </h2>

          <div className="space-y-6">
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h3 className="font-display text-2xl font-semibold text-white" style={{ maxWidth: "82%" }}>
                      Adaptive Filters in Machine Learning Models for Sector Rotation Forecasting: A Comparative Study under Shifting Uncertainty Regimes
                    </h3>
                    <span className="exp-gradient text-base md:text-xl font-bold whitespace-nowrap leading-relaxed">Feb 2026</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-2xl font-semibold text-zinc-300 leading-relaxed">BSc Thesis</span>
                    <span className="exp-gradient text-base md:text-xl font-bold leading-relaxed">Grade: 10/10</span>
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
                        className="object-cover"
                      />
                    </div>
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                      <Image
                        src="/images/equitycurve.png"
                        alt="Equity Curve"
                        fill
                        className="object-cover"
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
                    <Github
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
            <span className="exp-gradient">Writing</span>
          </h2>

          <div className="space-y-6">
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-800/70 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h3 className="font-display text-2xl font-semibold text-white" style={{ maxWidth: "82%" }}>
                      Decentralized Trading: Liquidity, Arbitrage &amp; Capital Efficiency
                    </h3>
                    <span className="exp-gradient text-base md:text-xl font-bold whitespace-nowrap leading-relaxed">Forthcoming, Apr 2026</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-base font-semibold text-zinc-300 leading-relaxed">Finance Club Magazine, University of Macedonia</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 italic mb-4">
                  Co-authored with another member.
                </p>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed text-justify">
                  Technical analysis of how decentralized finance is reshaping market microstructure, structured in two parts. Part I covers the architectural shift from Central Limit Order Books (CLOBs) to Automated Market Makers (AMMs), explaining the constant product formula (x·y=k) that governs liquidity pools, the &quot;lazy liquidity&quot; inefficiency of uniform distribution across all price ranges, and Uniswap v3&apos;s concentrated liquidity as a solution that improves capital efficiency but transforms liquidity provision into active risk management. Part II examines the &quot;dark forest&quot; of transaction ordering: how the public mempool creates an adversarial pre-execution environment, the MEV (Maximal Extractable Value) extraction pipeline (searchers, builders, relays, validators), and a quantitative framework for measuring MEV as a component of total execution cost. Empirical data on sandwich attacks (~95,000 over 12 months, ~$60M in estimated annual user losses), high attacker concentration (one entity linked to ~70% of attacks), and the distinction between price efficiency through arbitrage and execution fairness for end users. Includes analysis of DEX-to-CEX volume convergence and its implications for cross-venue arbitrage dynamics.
                </p>
              </LiquidBorderCard>
            </ScrollRevealCard>

            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h3 className="font-display text-2xl font-semibold text-white" style={{ maxWidth: "82%" }}>
                      Corporate &amp; Financial Overview of Jumbo A.E.E.
                    </h3>
                    <span className="exp-gradient text-base md:text-xl font-bold whitespace-nowrap leading-relaxed">Oct 2023</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-base font-semibold text-zinc-300 leading-relaxed">Hellenic Investors Association (SED) — Listed Companies General Meetings Monitoring Programme</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 italic mb-4">
                  Co-authored with four students from three Greek universities.
                </p>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed text-justify">
                  Comprehensive analysis of Jumbo A.E.E., one of Greece&apos;s largest retail chains, produced as part of SED&apos;s Listed Companies General Meetings Monitoring Programme. The report covers the company&apos;s corporate profile and historical expansion from a single Athens store in 1986 to 80 locations across four countries, with detailed financial analysis including revenue trajectory (€116M in 2002 to a record €949M in 2022), profitability metrics (€248M net income, €336M EBITDA), stock performance and market capitalization (€3.27B), seasonality patterns in sales, the COVID-19 impact and subsequent recovery, competitive positioning within Greek retail, capital structure events (IPO, bond issuances, share capital increases), board composition and governance structure, and CSR activities. The analysis concludes with coverage of the 2023 Annual General Meeting.
                </p>
              </LiquidBorderCard>
            </ScrollRevealCard>
          </div>
        </div>

        <ExperienceDivider />

        {/* ── AWARDS ───────────────────────────────────────── */}
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
            <span className="exp-gradient">Awards</span>
          </h2>

          <div className="space-y-6">
            {/* AIESEC in Greece */}
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="flex items-center gap-4">
                    <h3 className="font-display text-2xl font-semibold text-white">
                      AIESEC in Greece
                    </h3>
                  </div>
                </div>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed text-justify mb-6">
                  Recognized for achieving the highest overall performance among peers, evaluated against a comprehensive set of quantitative and qualitative KPIs.
                </p>
                {/* Timeline */}
                <div className="border border-zinc-600/50 bg-zinc-800/40 rounded-xl px-5 py-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: 'linear-gradient(135deg, #a1a1a1 0%, #d4d4d4 50%, #5a5a5a 100%)' }} />
                    <span className="exp-gradient text-lg font-bold">June 2025</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: 'linear-gradient(135deg, #a1a1a1 0%, #d4d4d4 50%, #5a5a5a 100%)' }} />
                    <span className="exp-gradient text-lg font-bold">April 2025</span>
                  </div>
                </div>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed text-justify">
                  Directed a 4-member team that secured the #1 national ranking for three out of five months. By consistently driving top-tier results across core metrics, my team maintained a top-3 standing nationally throughout the semester, culminating in my dual recognition for April and June.
                </p>
              </LiquidBorderCard>
            </ScrollRevealCard>

            {/* Project Recognition */}
            <ScrollRevealCard>
              <LiquidBorderCard className="bg-zinc-900/75 backdrop-blur-sm ring-1 ring-zinc-700/40 rounded-2xl p-8">
                <div className="bg-black/20 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h3 className="font-display text-2xl font-semibold text-white" style={{ maxWidth: "82%" }}>
                      Project Recognition
                    </h3>
                    <span className="exp-gradient text-base md:text-xl font-bold whitespace-nowrap leading-relaxed">January 2025</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-base font-semibold text-zinc-300 leading-relaxed">University of Macedonia</span>
                  </div>
                </div>
                <p className="text-base md:text-xl text-zinc-500 leading-relaxed text-justify">
                  Chosen to present our course project at the Pfizer Center of Digital Innovation (CDI), bridging academic coursework with industry exposure.
                </p>
              </LiquidBorderCard>
            </ScrollRevealCard>
          </div>
        </div>

        <ExperienceDivider />

        {/* ── SKILLS ───────────────────────────────────────── */}
        <div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 text-center">
            <span className="exp-gradient">Skills</span>
          </h2>
        </div>

      </div>
    </section>
  )
}
