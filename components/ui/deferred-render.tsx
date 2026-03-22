"use client"

import { useState, useEffect, startTransition, type ReactNode } from "react"

/**
 * Delays rendering of children by `delay` ms.
 * Uses React.startTransition so the mounting work is treated as
 * low-priority and can be interrupted by animation frames, preventing
 * the main thread from blocking during the loading screen animation.
 */
export function DeferredRender({
  children,
  delay = 680,
}: {
  children: ReactNode
  delay?: number
}) {
  const [render, setRender] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      // Low-priority update: React can yield to animation frames mid-render
      startTransition(() => setRender(true))
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!render) return null
  return <>{children}</>
}
