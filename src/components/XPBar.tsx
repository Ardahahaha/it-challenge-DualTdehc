"use client"

import { useEffect, useState } from "react"
import { Zap } from "lucide-react"

interface XPBarProps {
  currentXP?: number
  maxXP?: number
  level?: number
}

export default function XPBar({ currentXP = 0, maxXP = 100, level = 1 }: XPBarProps) {
  const [animatedXP, setAnimatedXP] = useState(0)
  const percentage = maxXP > 0 ? (currentXP / maxXP) * 100 : 0

  useEffect(() => {
    // Animate XP bar on mount
    const timer = setTimeout(() => {
      setAnimatedXP(percentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-xs font-bold bg-gradient-to-r from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] text-white px-3 py-1.5 rounded-lg glow-subtle">
        <Zap className="w-3 h-3" />
        Niv. {level}
      </div>
      <div className="flex-1 max-w-[200px]">
        <div className="relative h-2.5 glass rounded-full overflow-hidden border border-primary/30">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[oklch(0.6_0.25_280)] via-[oklch(0.5_0.22_285)] to-[oklch(0.4_0.2_290)] rounded-full transition-all duration-1000 ease-out shadow-lg"
            style={{ width: `${animatedXP}%` }}
          >
            <div className="absolute inset-0 animate-pulse opacity-40 bg-gradient-to-r from-white/40 to-transparent"></div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1.5 font-medium">
          {currentXP} / {maxXP} XP
        </div>
      </div>
    </div>
  )
}