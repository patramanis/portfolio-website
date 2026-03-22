"use client"

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react"
import { useRouter, usePathname } from "next/navigation"
import { useLenis } from "@studio-freight/react-lenis"
import { useLoading } from "./loading-provider"

type TransitionType = "standard" | "sibling" | "none"
// "waiting" = wave is opaque on screen, router.push fired, waiting for new Template to mount
type TransitionPhase = "idle" | "exiting" | "waiting" | "entering"

interface PageTransitionContextType {
  transitionPhase: TransitionPhase
  transitionType: TransitionType
  navigateTo: (href: string) => void
  notifyMounted: () => void
  notifyEnterComplete: () => void
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  transitionPhase: "idle",
  transitionType: "none",
  navigateTo: () => {},
  notifyMounted: () => {},
  notifyEnterComplete: () => {},
})

const SIBLING_ROUTES = ["/experience", "/portfolio"]

function getTransitionType(from: string, to: string): TransitionType {
  if (from === to) return "none"
  if (SIBLING_ROUTES.includes(from) && SIBLING_ROUTES.includes(to))
    return "sibling"
  return "standard"
}

// Time (ms) to wait after starting the exit before calling router.push.
// Must be ≥ the time the wave takes to fully cover the screen.
// Wave: last layer (light, coverDelay=320ms) + COVER_DUR (380ms) = 700ms → use 720ms.
const EXIT_DURATION: Record<TransitionType, number> = {
  standard: 720,
  sibling:  520,
  none: 0,
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const { isTransitionDone } = useLoading()

  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>("idle")
  const [transitionType,  setTransitionType]  = useState<TransitionType>("none")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = useRef<any>(null)
  useLenis((lenis) => { lenisRef.current = lenis })

  const navigateTo = useCallback(
    async (href: string) => {
      if (transitionPhase !== "idle") return
      if (!isTransitionDone) return
      if (href === pathname) return

      const type = getTransitionType(pathname, href)
      if (type === "none") return

      setTransitionType(type)
      setTransitionPhase("exiting")

      // Freeze smooth scroll while the wave covers the screen
      lenisRef.current?.stop()

      // Wait for the wave to fully cover the viewport
      await new Promise<void>((resolve) =>
        setTimeout(resolve, EXIT_DURATION[type])
      )

      // Reset scroll to top while safely hidden behind the wave
      window.scrollTo(0, 0)
      lenisRef.current?.scrollTo(0, { immediate: true })

      // Trigger Next.js navigation — unmounts old Template, mounts new one
      router.push(href)

      // Hold wave on screen until the new Template signals it has mounted
      setTransitionPhase("waiting")
    },
    [transitionPhase, isTransitionDone, pathname, router]
  )

  // Called from Template's mount effect — new page is in the DOM, safe to reveal
  const notifyMounted = useCallback(() => {
    setTransitionPhase("entering")
  }, [])

  // Called from WaveTransitionOverlay once the last wave panel is fully off-screen
  const notifyEnterComplete = useCallback(() => {
    setTransitionPhase("idle")
    setTransitionType("none")
    lenisRef.current?.start()
  }, [])

  return (
    <PageTransitionContext.Provider
      value={{
        transitionPhase,
        transitionType,
        navigateTo,
        notifyMounted,
        notifyEnterComplete,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  )
}

export const usePageTransition = () => useContext(PageTransitionContext)
