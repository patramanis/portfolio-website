"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useMarkDone } from "@/components/providers/loading-provider"

const LOGO_SIZE = 100

// Durations (ms → s for Framer Motion)
const POP_IN_DURATION = 0.62   // total time for the 3-segment bounce
const POP_OUT_DURATION = 0.72   // logo zoom-out
const BG_FADE_DURATION = 0.45   // background opacity fade (0.4s earlier than before)
// Reveal content slightly before the bg fully fades so the transition is seamless
const REVEAL_DELAY_MS = 380
const DONE_DELAY_MS = 760

export function LoadingScreen() {
  const [phase, setPhase] = useState<"loading" | "exiting" | "done">("loading")
  const [logoVisible, setLogoVisible] = useState(false)
  const markDone = useMarkDone()

  // Trigger pop-in on first browser paint (avoids hydration timing issues)
  useEffect(() => {
    const id = requestAnimationFrame(() => setLogoVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Schedule exit once the page is fully loaded
  useEffect(() => {
    const mountTime = Date.now()
    let exitTimer: ReturnType<typeof setTimeout>
    let revealTimer: ReturnType<typeof setTimeout>
    let doneTimer: ReturnType<typeof setTimeout>

    const beginExit = () => {
      setPhase("exiting")
      revealTimer = setTimeout(markDone, REVEAL_DELAY_MS)
      doneTimer = setTimeout(() => setPhase("done"), DONE_DELAY_MS)
    }

    const scheduleExit = () => {
      // Give pop-in spring a moment to fully settle before we fire exit
      const elapsed = Date.now() - mountTime
      const wait = Math.max(0, 1400 - elapsed)
      exitTimer = setTimeout(beginExit, wait)
    }

    if (document.readyState === "complete") {
      scheduleExit()
    } else {
      window.addEventListener("load", scheduleExit, { once: true })
      const fallback = setTimeout(beginExit, 7000)
      return () => {
        clearTimeout(exitTimer)
        clearTimeout(revealTimer)
        clearTimeout(doneTimer)
        clearTimeout(fallback)
        window.removeEventListener("load", scheduleExit)
      }
    }

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(revealTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  if (phase === "done") return null

  const isExiting = phase === "exiting"

  const logoAnimate = isExiting
    ? { scale: 90, opacity: 0 }
    : logoVisible
      ? { scale: [0.01, 1.18, 0.96, 1.00], opacity: [0, 1, 1, 1] }
      : { scale: 0.01, opacity: 0 }

  const logoTransition = isExiting
    ? {
      duration: POP_OUT_DURATION,
      ease: [0.42, 0, 1, 1] as const,
    }
    : {
      duration: POP_IN_DURATION,
      times: [0, 0.55, 0.77, 1],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ease: ["easeOut", "easeInOut", "easeInOut"] as any,
    }

  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={isExiting
          ? { duration: BG_FADE_DURATION, ease: [0.4, 0, 0.2, 1] }
          : { duration: 0 }
        }
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background:
            "radial-gradient(ellipse at 50% 46%, #1d1d1d 0%, #121212 52%, #080808 100%)",
          pointerEvents: isExiting ? "none" : "all",
          willChange: "opacity",
        }}
      />

      <motion.div
        style={{
          position: "fixed",
          zIndex: 10000,
          width: LOGO_SIZE,
          height: LOGO_SIZE,
          left: "50%",
          top: "50%",
          marginLeft: -LOGO_SIZE / 2,
          marginTop: -LOGO_SIZE / 2,
          pointerEvents: "none",
          willChange: "transform, opacity",
          transformOrigin: "70% 40%",
        }}
        initial={{ scale: 0.01, opacity: 0 }}
        animate={logoAnimate}
        transition={logoTransition}
      >
        <Image
          src="/images/bomb.png"
          alt="Logo"
          width={LOGO_SIZE}
          height={LOGO_SIZE}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          priority
        />
      </motion.div>
    </>
  )
}
