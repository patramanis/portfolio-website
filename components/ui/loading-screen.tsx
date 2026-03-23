"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { useMarkDone } from "@/components/providers/loading-provider"
import { useTopSectionReady } from "@/components/providers/top-section-ready-provider"

const imgBase = process.env.NEXT_PUBLIC_BASE_PATH || ""

const LOGO_SIZE        = 100
const REVEAL_DELAY_MS  = 380    // when to mark loading done (content starts appearing)
const DONE_DELAY_MS    = 760    // when loading screen fully unmounts
const MIN_DISPLAY_MS   = 1400   // minimum time loading screen is shown
const POST_LOAD_GRACE_MS = 3000 // max extra wait for isReady after pageLoad
const ABSOLUTE_MAX_MS  = 7000   // hard ceiling regardless of state

export function LoadingScreen() {
  const [isDone, setIsDone] = useState(false)
  const markDone = useMarkDone()
  const { isReady } = useTopSectionReady()

  const mountTimeRef   = useRef(Date.now())
  const exitStartedRef = useRef(false)
  const bgRef          = useRef<HTMLDivElement>(null)
  const logoRef        = useRef<HTMLDivElement>(null)

  // ── Pop-in: direct DOM mutation on the first animation frame ────────────
  // Bypasses React's render cycle so the CSS animation starts on exactly the
  // first compositor frame, with zero main-thread scheduling overhead.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (logoRef.current) {
        logoRef.current.style.animation =
          "bombPopIn 0.62s ease-out forwards"
      }
    })
    return () => cancelAnimationFrame(id)
  }, [])

  // ── beginExit: direct DOM mutations for the exit sequence ───────────────
  // Applies CSS exit animations directly so no React re-render competes with
  // the fade/zoom-out on the main thread.
  const beginExit = useCallback(() => {
    if (exitStartedRef.current) return
    exitStartedRef.current = true

    // Lock the logo at its settled state, then swap to the exit animation
    if (logoRef.current) {
      logoRef.current.style.transform = "scale(1)"
      logoRef.current.style.opacity   = "1"
      logoRef.current.style.animation =
        "bombExitAnim 0.72s cubic-bezier(0.42, 0, 1, 1) forwards"
    }

    // Fade background out and disable pointer events
    if (bgRef.current) {
      bgRef.current.style.pointerEvents = "none"
      bgRef.current.style.animation     =
        "loadingBgExit 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards"
    }

    // Signal content to appear (slightly before bg fully fades for a seamless blend)
    setTimeout(markDone, REVEAL_DELAY_MS)
    // Remove DOM nodes once animations are done
    setTimeout(() => setIsDone(true), DONE_DELAY_MS)
  }, [markDone])

  // ── Page-load tracking ───────────────────────────────────────────────────
  const [pageLoaded, setPageLoaded] = useState(false)
  useEffect(() => {
    if (document.readyState === "complete") { setPageLoaded(true); return }
    const onLoad = () => setPageLoaded(true)
    window.addEventListener("load", onLoad, { once: true })
    return () => window.removeEventListener("load", onLoad)
  }, [])

  // ── Main gate: wait for BOTH pageLoaded AND isReady ──────────────────────
  useEffect(() => {
    if (!pageLoaded || !isReady) return
    const elapsed = Date.now() - mountTimeRef.current
    const wait    = Math.max(0, MIN_DISPLAY_MS - elapsed)
    const t = setTimeout(beginExit, wait)
    return () => clearTimeout(t)
  }, [pageLoaded, isReady, beginExit])

  // ── Grace: if isReady never fires within 3s of pageLoad, proceed anyway ──
  useEffect(() => {
    if (!pageLoaded) return
    const t = setTimeout(beginExit, POST_LOAD_GRACE_MS)
    return () => clearTimeout(t)
  }, [pageLoaded, beginExit])

  // ── Absolute fallback ────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(beginExit, ABSOLUTE_MAX_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isDone) return null

  return (
    <>
      {/* Background — plain div, animation injected via ref when exiting */}
      <div
        ref={bgRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background:
            "radial-gradient(ellipse at 50% 46%, #1d1d1d 0%, #121212 52%, #080808 100%)",
          pointerEvents: "all",
        }}
      />

      {/* Logo — starts invisible; pop-in CSS animation injected via ref on mount */}
      <div
        ref={logoRef}
        style={{
          position:      "fixed",
          zIndex:        10000,
          width:         LOGO_SIZE,
          height:        LOGO_SIZE,
          left:          "50%",
          top:           "50%",
          marginLeft:    -LOGO_SIZE / 2,
          marginTop:     -LOGO_SIZE / 2,
          pointerEvents: "none",
          transformOrigin: "70% 40%",
          willChange:    "transform, opacity",
          // Initial invisible state before RAF fires
          transform:     "scale(0.01)",
          opacity:       0,
        }}
      >
        <Image
          src={`${imgBase}/images/bomb.png`}
          alt="Logo"
          width={LOGO_SIZE}
          height={LOGO_SIZE}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          priority
        />
      </div>
    </>
  )
}
