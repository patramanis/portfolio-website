"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface TopSectionReadyContextType {
    isReady: boolean
    markReady: () => void
    reset: () => void
}

const TopSectionReadyContext = createContext<TopSectionReadyContextType>({
    isReady: false,
    markReady: () => {},
    reset: () => {},
})

export function TopSectionReadyProvider({ children }: { children: ReactNode }) {
    const [isReady, setIsReady] = useState(false)

    const markReady = useCallback(() => {
        setIsReady(true)
    }, [])

    const reset = useCallback(() => {
        setIsReady(false)
    }, [])

    return (
        <TopSectionReadyContext.Provider value={{ isReady, markReady, reset }}>
            {children}
        </TopSectionReadyContext.Provider>
    )
}

export function useTopSectionReady() {
    return useContext(TopSectionReadyContext)
}
