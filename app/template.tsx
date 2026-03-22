"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useLoading } from "@/components/providers/loading-provider"
import { usePageTransition } from "@/components/providers/page-transition-provider"
import { useTopSectionReady } from "@/components/providers/top-section-ready-provider"

export default function Template({ children }: { children: React.ReactNode }) {
  const { isTransitionDone } = useLoading()
  const { transitionPhase, notifyMounted } = usePageTransition()
  const { isReady } = useTopSectionReady()

  // Capture the phase at mount time before any state updates run
  const mountPhaseRef = useRef(transitionPhase)
  const hasNotifiedRef = useRef(false)

  // Tell the provider the new page is ready — wait for top section to signal
  useEffect(() => {
    if (mountPhaseRef.current !== "waiting") return
    if (hasNotifiedRef.current) return
    if (!isReady) return

    hasNotifiedRef.current = true
    notifyMounted()
  }, [isReady, notifyMounted])

  // Fallback: if isReady never fires within 3s, reveal anyway to avoid hanging
  useEffect(() => {
    if (mountPhaseRef.current !== "waiting") return

    const fallback = setTimeout(() => {
      if (!hasNotifiedRef.current) {
        hasNotifiedRef.current = true
        notifyMounted()
      }
    }, 3000)

    return () => clearTimeout(fallback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Visibility logic ──────────────────────────────────────────────────────
  // During a navigation:
  //   "waiting"  → content is hidden (wave covers the screen)
  //   "entering" → content becomes visible; the wave slides away on top of it
  //
  // On a fresh page load (!isTransitionDone):
  //   hidden until the loading screen finishes
  const shouldHide = transitionPhase === "waiting" || !isTransitionDone

  const isNavTransition =
    transitionPhase === "entering" ||
    transitionPhase === "waiting" ||
    transitionPhase === "exiting"

  const variants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
  }

  const duration = isNavTransition ? 0.25 : 0.5

  return (
    <motion.div
      className="relative z-10"
      initial="hidden"
      animate={shouldHide ? "hidden" : "visible"}
      variants={variants}
      transition={{ duration, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}
