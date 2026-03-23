import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LenisProvider } from "@/components/providers/lenis-provider"
import { LoadingProvider } from "@/components/providers/loading-provider"
import { PageTransitionProvider } from "@/components/providers/page-transition-provider"
import { TopSectionReadyProvider } from "@/components/providers/top-section-ready-provider"
import { LavaLampBackground } from "@/components/ui/lava-lamp-background"
import { LoadingScreen } from "@/components/ui/loading-screen"
import { WaveTransitionOverlay } from "@/components/ui/wave-transition-overlay"
import { Navbar } from "@/components/ui/navbar"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

const imgBase = process.env.NEXT_PUBLIC_BASE_PATH || ""

export const metadata: Metadata = {
  title: "Thomas Patramanis",
  description:
    "Personal portfolio of an informatics graduate with strong interest in quantitative finance and machine learning.",
  icons: {
    icon: [
      {
        url: `${imgBase}/images/bomb.png`,
      },
    ],
    apple: `${imgBase}/images/bomb.png`,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cal+Sans&family=Instrument+Sans:wght@400;500;600;700&family=Allura&family=EB+Garamond:wght@400;700&family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.variable} font-sans antialiased text-zinc-100`}>
        <LoadingProvider>
          <TopSectionReadyProvider>
            <LoadingScreen />
            <LenisProvider>
              <PageTransitionProvider>
                <WaveTransitionOverlay />
                <LavaLampBackground />
                <Navbar />
                {children}
              </PageTransitionProvider>
            </LenisProvider>
          </TopSectionReadyProvider>
        </LoadingProvider>
        <Analytics />
      </body>
    </html>
  )
}
