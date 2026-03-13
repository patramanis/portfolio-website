"use client"

import dynamic from "next/dynamic"

const AnimatedWireframeBackgroundDynamic = dynamic(
  async () => {
    const { AnimatedWireframeBackground } = await import(
      "@/components/ui/animated-wireframe-background"
    )
    return AnimatedWireframeBackground
  },
  {
    ssr: false,
  }
)

export function WireframeBackground() {
  return <AnimatedWireframeBackgroundDynamic />
}
