"use client"

import { motion } from "framer-motion"
import { usePageTransition } from "@/components/providers/page-transition-provider"

// ─── Constants ───────────────────────────────────────────────────────────────

const WAVE_H = 68 // px of wave protrusion above each panel

// Three layers: dark at back, light at front (highest z-index)
// Cover order  : dark → medium → light  (dark appears first from below)
// Reveal order : light → medium → dark  (light pulls away first, revealing content from top)
const LAYERS = [
  { id: "dark",   color: "#1c1c1c", z: 36, coverDelay: 0,    revealDelay: 0.32, waveSpeed: "5.2s" },
  { id: "medium", color: "#383838", z: 37, coverDelay: 0.16, revealDelay: 0.16, waveSpeed: "4.4s" },
  { id: "light",  color: "#5e5e5e", z: 38, coverDelay: 0.32, revealDelay: 0,    waveSpeed: "3.6s" },
] as const

const COVER_DUR  = 0.38  // seconds per panel for the upward cover sweep
const REVEAL_DUR = 0.44  // seconds per panel for the downward reveal sweep

// ─── Wave SVG Path ────────────────────────────────────────────────────────────

// Width is doubled so we can translate –50% for seamless looping.
// The path starts and ends at the same y so tiling is perfect.
const W = 2880
const MID = WAVE_H * 0.54
const TOP = WAVE_H * 0.07
const BOT = WAVE_H * 0.93
const SEG = W / 8 // 360 px per segment

const WAVE_D = [
  `M 0 ${MID}`,
  ...Array.from({ length: 8 }, (_, i) => {
    const x0 = i * SEG
    const cp1 = x0 + SEG * 0.25
    const cp2 = x0 + SEG * 0.75
    const x1 = x0 + SEG
    const peak = i % 2 === 0 ? TOP : BOT
    return `C ${cp1} ${peak} ${cp2} ${peak} ${x1} ${MID}`
  }),
  `L ${W} ${WAVE_H} L 0 ${WAVE_H} Z`,
].join(" ")

// ─── Component ────────────────────────────────────────────────────────────────

export function WaveTransitionOverlay() {
  const { transitionPhase, notifyEnterComplete } = usePageTransition()

  const isCovering = transitionPhase === "exiting" || transitionPhase === "waiting"
  const isEntering = transitionPhase === "entering"

  // When idle: panels sit below the viewport (y = 110%)
  // When covering: panels sweep up to y = 0 (fully on screen)
  // When entering: panels sweep back down to y = 110%
  const yTarget = isCovering ? "0%" : "110%"

  return (
    <>
      {LAYERS.map(({ id, color, z, coverDelay, revealDelay, waveSpeed }) => {
        const delay = isEntering ? revealDelay : (isCovering ? coverDelay : 0)
        const duration = isEntering ? REVEAL_DUR : COVER_DUR
        const ease = isEntering
          ? ([0.42, 0, 0.8, 1] as const)   // ease-in: fast clear at start, gentle finish
          : ([0.16, 0, 0.3, 1] as const)   // ease-out: snap up quickly, settle at top

        return (
          <motion.div
            key={id}
            initial={{ y: "110%" }}
            animate={{ y: yTarget }}
            transition={{ duration, delay, ease }}
            onAnimationComplete={() => {
              // Dark layer has the longest revealDelay — it finishes last.
              // Once it's fully off-screen, the transition is truly done.
              if (isEntering && id === "dark") {
                notifyEnterComplete()
              }
            }}
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              // Taller than viewport so the wave edge sticks above y=0 when on screen
              height: `calc(100% + ${WAVE_H}px)`,
              zIndex: z,
              willChange: "transform",
              pointerEvents: "none",
            }}
          >
            {/* ── Wave edge — occupies the top WAVE_H px of the panel ── */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: WAVE_H,
                overflow: "hidden",
              }}
            >
              <svg
                viewBox={`0 0 ${W} ${WAVE_H}`}
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "200%",
                  height: "100%",
                  // CSS animation defined in globals.css
                  animationName: "waveScroll",
                  animationDuration: waveSpeed,
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                }}
                aria-hidden
              >
                <path d={WAVE_D} fill={color} />
              </svg>
            </div>

            {/* ── Solid body below the wave edge ── */}
            <div
              style={{
                position: "absolute",
                top: WAVE_H,
                left: 0,
                right: 0,
                bottom: 0,
                background: color,
              }}
            />
          </motion.div>
        )
      })}
    </>
  )
}
