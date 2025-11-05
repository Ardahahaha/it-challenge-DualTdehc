"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check localStorage or default to light mode
    const stored = localStorage.getItem("theme")
    const prefersDark = stored === "dark"
    setIsDark(prefersDark)
    if (prefersDark) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    if (newIsDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button 
        className="p-2.5 rounded-xl glass border border-primary/20 transition-all opacity-0"
        aria-label="Toggle dark mode"
      >
        <Sun className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2.5 rounded-xl glass border border-primary/20 hover:border-primary/40 hover:scale-105 transition-all group relative overflow-hidden"
      aria-label="Toggle dark mode"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] opacity-0 group-hover:opacity-10 transition-opacity" />
      
      {/* Icon with rotation animation */}
      <div className="relative">
        {isDark ? (
          <Moon className="w-5 h-5 text-primary transition-transform group-hover:rotate-12" />
        ) : (
          <Sun className="w-5 h-5 text-primary transition-transform group-hover:rotate-90" />
        )}
      </div>
    </button>
  )
}
