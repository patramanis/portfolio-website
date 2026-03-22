"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Split into two contexts so consumers of markDone don't re-render when
// isTransitionDone changes (prevents mid-animation re-renders in LoadingScreen)
const LoadingStatusContext = createContext<boolean>(false)
const LoadingMarkDoneContext = createContext<() => void>(() => {})

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isTransitionDone, setIsTransitionDone] = useState(false)
  const markDone = useCallback(() => setIsTransitionDone(true), [])

  return (
    <LoadingMarkDoneContext.Provider value={markDone}>
      <LoadingStatusContext.Provider value={isTransitionDone}>
        {children}
      </LoadingStatusContext.Provider>
    </LoadingMarkDoneContext.Provider>
  )
}

// For components that trigger loading completion (e.g. LoadingScreen)
export const useMarkDone = () => useContext(LoadingMarkDoneContext)

// For components that react to loading completion (e.g. Template, PageTransitionProvider)
export const useLoading = () => ({
  isTransitionDone: useContext(LoadingStatusContext),
  markDone: useContext(LoadingMarkDoneContext),
})
