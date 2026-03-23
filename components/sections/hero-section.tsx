"use client"

import Image from "next/image"

const imgBase = process.env.NEXT_PUBLIC_BASE_PATH || ""
import { ChevronDown } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LiquidMetalBorder } from "@/components/ui/liquid-metal-border"
import { FloatingClouds } from "@/components/ui/floating-clouds"
import { usePerspectiveTransform } from "@/hooks/use-perspective-transform"
import { useTopSectionReady } from "@/components/providers/top-section-ready-provider"

// ── Module-level constants & components ──────────────────────────────────────
// Defined outside HeroSection so React never treats them as new types on re-render.
// Inline definitions inside a component body cause full unmount/remount cycles.

const GREY_GRADIENT: React.CSSProperties = {
  background: "linear-gradient(135deg, #a1a1a1, #5a5a5a)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
}

function TitleBlock() {
  return (
    <div
      className="hero-title-text"
      style={{
        lineHeight: "1",
        fontFamily: '"Cal Sans", system-ui, sans-serif',
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      <span className="text-white">Hi, I am </span>
      <span className="animated-gradient-thomas">Thomas</span>
      <span style={GREY_GRADIENT}>.</span>
    </div>
  )
}

function CtaContent({ scrollOpacity }: { scrollOpacity: number }) {
  return (
    <div
      className="flex flex-col items-center animate-bounce transition-opacity duration-300"
      style={{
        opacity: scrollOpacity,
        pointerEvents: scrollOpacity < 0.1 ? "none" : "auto",
      }}
    >
      <span className="text-sm text-zinc-400 font-medium tracking-wide transition-colors duration-300 hover:text-zinc-200">
        More about me
      </span>
      <ChevronDown className="w-4 h-4 text-zinc-500 mt-1 transition-colors duration-300 hover:text-zinc-300" />
    </div>
  )
}

const reveal = (delay: number) => ({
  initial: { opacity: 0, scale: 0.88, y: 24 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 300, damping: 24, delay },
})

// ─────────────────────────────────────────────────────────────────────────────

export function HeroSection() {
  const profileImageRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollOpacity, setScrollOpacity] = useState(1)
  const [ctaLeft, setCtaLeft] = useState<string | undefined>(undefined)
  const { markReady } = useTopSectionReady()

  usePerspectiveTransform(profileImageRef, {
    maxRotation: 12,
    distance: 600,
    easing: 0.05,
  })

  useEffect(() => {
    const aboutHeading = document.querySelector('[data-about-heading]')
    if (!aboutHeading) return
    const observer = new IntersectionObserver(
      ([entry]) => setScrollOpacity(1 - entry.intersectionRatio),
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] }
    )
    observer.observe(aboutHeading)
    return () => observer.disconnect()
  }, [])

  // Position CTA so its visual center aligns with the subheadline text center.
  // Uses querySelector to avoid Framer Motion ref-forwarding quirks in React 19.
  // Observes only the hero section element (not the entire document) to avoid
  // firing on every Lenis scroll micro-adjustment.
  useEffect(() => {
    const update = () => {
      if (window.innerWidth <= 900) {
        setCtaLeft(undefined)
        return
      }
      const section = sectionRef.current
      const sub = document.querySelector<HTMLElement>('.hero-subheadline')
      const cta = document.querySelector<HTMLElement>('.hero-cta-abs')
      if (!section || !sub || !cta) {
        setCtaLeft(undefined)
        return
      }
      const sectionRect = section.getBoundingClientRect()
      const subRect = sub.getBoundingClientRect()
      const pl = parseFloat(window.getComputedStyle(sub).paddingLeft) || 0
      const textCenterX = subRect.left - sectionRect.left + pl + (subRect.width - pl) / 2
      setCtaLeft(`${textCenterX - cta.offsetWidth / 2}px`)
    }
    update()
    const ro = new ResizeObserver(update)
    // Observe only the section itself, not document.documentElement.
    // Lenis smooth scroll causes micro layout-changes on the root that would
    // trigger setCtaLeft (and a full HeroSection re-render) on every scroll frame.
    if (sectionRef.current) ro.observe(sectionRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="hero-section relative w-full mt-14">
      <style>{`
        /* ── Keyframes ── */
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animated-gradient-thomas {
          animation: gradientShift 6s ease-in-out infinite;
          background-size: 200% 200%;
          background-image: linear-gradient(135deg,#ffffff 0%,#e0e0e0 25%,#ffffff 50%,#b8b8b8 75%,#ffffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .animated-gradient-secondary {
          animation: gradientShift 5s ease-in-out infinite;
          background-size: 200% 200%;
          background-image: linear-gradient(135deg,#a1a1a1 0%,#d4d4d4 25%,#5a5a5a 50%,#d4d4d4 75%,#a1a1a1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes glowFlicker {
          0%,85%  { text-shadow: 0 0 20px rgba(255,255,255,0.8),0 0 40px rgba(100,200,255,0.6); }
          90%     { text-shadow: 0 0 20px rgba(255,255,255,0.56),0 0 40px rgba(100,200,255,0.42); }
          95%,100%{ text-shadow: 0 0 20px rgba(255,255,255,0.8),0 0 40px rgba(100,200,255,0.6); }
        }

        .glow-website { animation: glowFlicker 4s ease-in-out infinite; }

        /* ── Anti-jitter: keep key elements on GPU composite layers ── */
        .hero-section,
        .hero-main-row,
        .hero-image-col,
        .hero-text-col {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .hero-title-text,
        .hero-welcome-block,
        .hero-profile-img {
          will-change: transform;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        /* ── Fluid font sizes ── */
        .hero-title-text { font-size: clamp(36px, 5.5vw, 80px);  transition: font-size 0.25s ease; }
        .hero-welcome-sz { font-size: clamp(30px, 5vw, 72px)   !important; letter-spacing: .03em; transition: font-size 0.25s ease; }
        .hero-to-sz      { font-size: clamp(20px, 3.6vw, 50px) !important; transition: font-size 0.25s ease; }
        .hero-my-sz      { font-size: clamp(16px, 2.8vw, 40px) !important; transition: font-size 0.25s ease; }
        .hero-website-sz { font-size: clamp(52px, 8.5vw, 120px)!important; transition: font-size 0.25s ease; }

        /* ── Profile image: fluid size, never overflows bounds ── */
        .hero-profile-img {
          width:  clamp(210px, 28vw, 384px);
          height: clamp(240px, 32vw, 440px);
          border-radius: 18px;
          overflow: hidden;
          background: rgb(24 24 27);
          user-select: none;
          flex-shrink: 0;
          transition: width 0.35s ease, height 0.35s ease;
        }

        /* Image offset: reduces to zero before going out of bounds */
        .hero-image-offset {
          transform: translateX(-11%);
          transition: transform 0.35s ease;
        }
        @media (max-width: 1200px) { .hero-image-offset { transform: translateX(-5%);  } }
        @media (max-width: 1050px) { .hero-image-offset { transform: translateX(0%);   } }

        /* ══════════════════════════════════════════════════════
           TIER 1 — DESKTOP (≥ 901px)
           Image left 50% | Full text stack right 50%
        ══════════════════════════════════════════════════════ */
        .hero-section {
          height: calc(100dvh - 56px);
          display: flex;
          flex-direction: column;
          padding-top:    clamp(16px, 2.5vh, 36px);
          padding-bottom: 52px;
        }

        .hero-main-row {
          display: flex;
          flex: 1;
          width: 100%;
          min-height: 0;
        }

        .hero-image-col {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 10px;
        }

        .hero-text-col {
          width: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: visible;
          padding: 16px clamp(16px, 3vw, 48px) 16px 10px;
        }

        .hero-text-stack {
          display: flex;
          flex-direction: column;
          gap: clamp(24px, 3vh, 48px);
          align-items: flex-start;
          position: relative;
          z-index: 20;
        }

        /* Welcome: shifted left on desktop for visual balance */
        .hero-welcome-block {
          transform: translateX(-38%);
          transition: transform 0.4s ease;
        }

        .hero-title-desktop       { display: block; padding-left: 20px; }
        .hero-title-mobile        { display: none; }
        .hero-subheadline         { display: block; padding-left: 30px; margin-left: 2.5%; }
        .hero-subheadline-ext     { display: none; }

        .hero-cta-abs {
          position: absolute;
          bottom: 10px;
          left: calc(52.5vw + 233px);
          z-index: 30;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-cta-flow { display: none; }

        /* ══════════════════════════════════════════════════════
           TIER 2 — MEDIUM (541px – 900px)
           Title above | Image left 50% | Welcome right 50%
           Subheadline + CTA below
        ══════════════════════════════════════════════════════ */
        @media (max-width: 900px) {
          /* Section: flex column, space-evenly distributes content between navbar and CTA */
          .hero-section {
            padding: clamp(20px, 4vh, 48px) 10px 52px;
            gap: 0;
            justify-content: space-evenly;
          }

          /* Swap title slots */
          .hero-title-desktop   { display: none; }
          .hero-title-mobile    { display: flex; justify-content: center; width: 100%; }

          /* Move subheadline outside the text-col */
          .hero-subheadline     { display: none; }
          .hero-subheadline-ext {
            display: block;
            text-align: center;
            padding: 0;
            margin: 0;
          }

          /* Remove desktop welcome offset */
          .hero-welcome-block {
            transform: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
          }
          .hero-welcome-row { justify-content: center !important; }

          /* CTA: always absolute, centered via margin auto (avoids FM transform conflict) */
          .hero-cta-abs  { display: flex; left: 0; right: 0; width: fit-content; margin-left: auto; margin-right: auto; }
          .hero-cta-flow { display: none; }
        }

        /* Medium-specific: keep the main row as a ROW (image | welcome) */
        @media (max-width: 900px) and (min-width: 541px) {
          .hero-main-row {
            flex-direction: row;
            align-items: center;
            flex: none;
            padding: 0;
            gap: 0;
            width: 100%;
          }

          .hero-image-col {
            width: 50%;
            padding: 0 8px;
            justify-content: center;
          }

          /* Remove offset in this range (already gone at 1050px but be explicit) */
          .hero-image-offset { transform: none !important; }

          .hero-text-col {
            width: 50%;
            padding: 0 8px;
            align-items: center;
            justify-content: center;
          }

          .hero-text-stack {
            align-items: center;
            gap: 0; /* welcome block only, no gap needed */
            width: 100%;
          }

          /* Scale welcome text up a bit for the half-panel */
          .hero-welcome-sz { font-size: clamp(26px, 5.5vw, 52px) !important; }
          .hero-website-sz { font-size: clamp(44px, 9vw,   84px) !important; }
          .hero-to-sz      { font-size: clamp(18px, 3.8vw, 40px) !important; }
          .hero-my-sz      { font-size: clamp(14px, 3.2vw, 32px) !important; }
        }

        /* ══════════════════════════════════════════════════════
           TIER 3 — NARROW (≤ 540px)
           Fully stacked column — all items in single column
        ══════════════════════════════════════════════════════ */
        @media (max-width: 540px) {
          .hero-section {
            padding: clamp(16px, 3.5vh, 36px) 10px 52px;
            gap: 0;
            justify-content: space-evenly;
          }

          /* Now the main row becomes a column */
          .hero-main-row {
            flex-direction: column;
            align-items: center;
            flex: none;
            width: 100%;
            padding: 0;
            gap: clamp(16px, 3vh, 28px);
          }

          .hero-image-col {
            width: 100%;
            padding: 0;
            justify-content: center;
          }
          .hero-image-offset { transform: none !important; }

          .hero-text-col {
            width: 100%;
            padding: 0;
            align-items: center;
            justify-content: flex-start;
          }

          .hero-text-stack {
            align-items: center;
            gap: clamp(16px, 3vh, 28px);
            width: 100%;
          }

          /* Smaller welcome text for narrow screens */
          .hero-welcome-sz { font-size: clamp(24px, 7vw, 40px) !important; }
          .hero-website-sz { font-size: clamp(38px,11vw, 72px) !important; }
          .hero-to-sz      { font-size: clamp(16px, 5vw, 30px) !important; }
          .hero-my-sz      { font-size: clamp(12px, 4vw, 24px) !important; }
        }
      `}</style>

      {/* Floating Clouds */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <FloatingClouds />
      </div>

      {/* Tier 2+3: Title above everything */}
      <motion.div className="hero-title-mobile relative z-10" {...reveal(0.1)}>
        <TitleBlock />
      </motion.div>

      {/* Main row: image + text */}
      <div className="hero-main-row relative z-10">

        {/* LEFT — Profile Image */}
        <motion.div className="hero-image-col" {...reveal(0)}>
          <div className="hero-image-offset">
            <div
              ref={profileImageRef}
              className="relative"
              style={{ transformStyle: "preserve-3d", zIndex: 20 }}
            >
              <LiquidMetalBorder
                borderRadius={24}
                borderWidth={3}
                opacity={0.85}
                speed={0.7}
              >
                <div className="hero-profile-img select-none">
                  <Image
                    src={`${imgBase}/images/profile.png`}
                    alt="Profile photo"
                    width={400}
                    height={500}
                    className="object-cover w-full h-full object-top select-none"
                    priority
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onLoad={markReady}
                  />
                </div>
              </LiquidMetalBorder>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — Text Content */}
        <div className="hero-text-col" style={{ zIndex: 20 }}>
          <div className="hero-text-stack">

            {/* Tier 1 only: title inside right col */}
            <motion.div className="hero-title-desktop" {...reveal(0.1)}>
              <TitleBlock />
            </motion.div>

            {/* Welcome to my website (all tiers) */}
            <motion.div className="hero-welcome-block" {...reveal(0.19)}>
              <div
                className="hero-welcome-row"
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span className="hero-welcome-sz font-display font-bold text-white leading-none">
                  Welcome
                </span>
                <span
                  className="hero-to-sz font-display font-bold animated-gradient-secondary"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    marginLeft: "calc(-2% - 5px)",
                    marginTop: "2px",
                    transform: "rotate(360deg)",
                  }}
                >
                  to
                </span>
              </div>
              <div
                className="hero-welcome-row"
                style={{ display: "flex", alignItems: "center", gap: "3px", marginTop: "-4px" }}
              >
                <span
                  className="hero-my-sz font-display font-bold leading-none animated-gradient-secondary"
                  style={{ paddingBottom: "6px", marginTop: "-18%", marginLeft: "1%" }}
                >
                  my
                </span>
                <span
                  className="hero-website-sz glow-website leading-none text-white"
                  style={{
                    fontFamily: "'Allura', cursive",
                    marginTop: "-2%",
                    fontWeight: 400,
                    marginLeft: "-2%",
                    letterSpacing: "0.02em",
                  }}
                >
                  website
                </span>
              </div>
            </motion.div>

            {/* Tier 1 only: subheadline inside right col */}
            <motion.p
              className="hero-subheadline text-base md:text-xl text-zinc-500 leading-relaxed"
              {...reveal(0.27)}
            >
              I am an applied informatics graduate, with strong<br />
              interest in data science and quantitative analysis.
            </motion.p>

          </div>
        </div>
      </div>

      {/* Tier 2+3: subheadline below the main row */}
      <motion.p
        className="hero-subheadline-ext text-base text-zinc-500 leading-relaxed"
        {...reveal(0.27)}
      >
        I am an applied informatics graduate, with strong<br />
        interest in data science and quantitative analysis.
      </motion.p>

      {/* CTA — absolute on desktop (Tier 1) */}
      <motion.div className="hero-cta-abs" {...reveal(0.37)} style={ctaLeft !== undefined ? { left: ctaLeft } : undefined}>
        <CtaContent scrollOpacity={scrollOpacity} />
      </motion.div>

      {/* CTA — flow on medium/narrow (Tier 2+3) */}
      <motion.div className="hero-cta-flow relative" {...reveal(0.37)}>
        <CtaContent scrollOpacity={scrollOpacity} />
      </motion.div>
    </section>
  )
}
