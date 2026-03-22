"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, X, Linkedin } from "lucide-react"

const footerLinks = {
  navigation: [
    { label: "Portfolio", href: "/portfolio" },
    { label: "Experience", href: "/experience" },
    { label: "Contact", href: "/contact" },
  ],
}

export function FooterSection() {
  return (
    <footer className="px-6 py-6 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <Image
                src="/images/bomb.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-zinc-500">
              Informatics Graduate | Quantitative Finance | Machine Learning
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            {footerLinks.navigation.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">© {new Date().getFullYear()} All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="https://github.com/patramanis" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="https://x.com/TPatramanis" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors" aria-label="X">
              <X className="w-5 h-5" />
            </Link>
            <Link href="https://www.linkedin.com/in/patramanis/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
