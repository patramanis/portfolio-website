"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useLoading } from "@/components/providers/loading-provider"
import { usePageTransition } from "@/components/providers/page-transition-provider"

export default function Template({ children }: { children: React.ReactNode }) {
  const { isTransitionDone } = useLoading()
  const { transitionPhase, notifyMounted } = usePageTransition()

  // Capture the phase at mount time before any state updates run
  const mountPhaseRef = useRef(transitionPhase)

  // Tell the provider the new page is in the DOM — safe to start the wave reveal
  useEffect(() => {
    if (mountPhaseRef.current === "waiting") {
      notifyMounted()
    }
    // Intentionally runs once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Visibility logic ──────────────────────────────────────────────────────
  // During a navigation:
  //   "waiting"  → content is hidden (wave covers the screen; keeps old content
  //                from flashing if Next.js re-uses the Template instance)
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
