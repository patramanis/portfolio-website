"use client"

import { useState } from "react"
import { ChevronUp } from "lucide-react"

export function DebugMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 w-14 h-14 rounded-full bg-zinc-900 border border-zinc-700 hover:border-zinc-600 flex items-center justify-center transition-all duration-300 z-50 hover:bg-zinc-800"
        aria-label="Debug Menu"
      >
        <span className="text-zinc-300 font-bold text-sm">⚙️</span>
      </button>

      {/* Menu Popup */}
      {isOpen && (
        <div className="fixed bottom-24 left-8 w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-50">
          <div className="p-4 space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded transition-colors">
              Route
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded transition-colors">
              Turbopack
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded transition-colors">
              Route Info
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded transition-colors">
              Preferences
            </button>
          </div>
        </div>
      )}
    </>
  )
}
