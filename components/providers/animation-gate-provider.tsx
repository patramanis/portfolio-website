"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

/**
 * AnimationGateProvider
 *
 * Provides a global "gate" that heavy canvas/WebGL animations subscribe to.
 * When the gate is CLOSED (isGated = true), animations pause their work.
 * This ensures loading and transition animations play with no competition.
 *
 * Uses a ref-count so multiple callers can gate/ungate independently:
 *   gate()   → increment count (pauses if count was 0)
 *   ungate() → decrement count (resumes when count reaches 0)
 */
interface AnimationGateContextType {
  isGated: boolean
  gate: () => void
  ungate: () => void
}

const AnimationGateContext = createContext<AnimationGateContextType>({
  isGated: false,
  gate: () => {},
  ungate: () => {},
})

export function AnimationGateProvider({ children }: { children: ReactNode }) {
  const [gateCount, setGateCount] = useState(0)

  const gate = useCallback(() => setGateCount((c) => c + 1), [])
  const ungate = useCallback(() => setGateCount((c) => Math.max(0, c - 1)), [])

  return (
    <AnimationGateContext.Provider
      value={{ isGated: gateCount > 0, gate, ungate }}
    >
      {children}
    </AnimationGateContext.Provider>
  )
}

export function useAnimationGate() {
  return useContext(AnimationGateContext)
}
