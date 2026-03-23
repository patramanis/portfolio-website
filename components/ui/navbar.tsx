"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useLoading } from "@/components/providers/loading-provider"
import { usePageTransition } from "@/components/providers/page-transition-provider"

const imgBase = process.env.NEXT_PUBLIC_BASE_PATH || ""

const navLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/experience", label: "Experience" },
]

export function Navbar() {
  const pathname  = usePathname()
  const { isTransitionDone } = useLoading()
  const { navigateTo } = usePageTransition()

  // Intercept every link click: prevent the default instant navigation,
  // fire the wave transition, then let the provider call router.push.
  const handleNav = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    navigateTo(href)
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 p-4"
      initial={{ opacity: 0, y: -12, filter: "blur(4px)" }}
      animate={isTransitionDone
        ? { opacity: 1, y: 0, filter: "blur(0px)" }
        : { opacity: 0, y: -12, filter: "blur(4px)" }
      }
      transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
    >
      <nav className="max-w-5xl mx-auto flex items-center justify-between h-12 px-6 rounded-full bg-zinc-900/70 border border-zinc-800/50 backdrop-blur-md">
        <Link
          href="/"
          onClick={(e) => handleNav(e, "/")}
          className="flex items-center gap-2 transition-transform hover:scale-105"
          data-nav-logo
        >
          <Image
            src={`${imgBase}/images/bomb.png`}
            alt="Logo"
            width={28}
            height={28}
            className="object-contain"
          />
        </Link>
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className={`px-4 py-1.5 text-sm rounded-full transition-all duration-300 ${
                  isActive
                    ? "text-zinc-100 font-medium"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </motion.header>
  )
}
