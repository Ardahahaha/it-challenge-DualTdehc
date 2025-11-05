"use client"

import { useEffect, useState } from "react"
import { Trophy, Flame } from "lucide-react"

interface ScoreboardProps {
  wins?: number
  losses?: number
  draws?: number
}

export default function Scoreboard({ wins = 28, losses = 14, draws = 3 }: ScoreboardProps) {
  const [animatedWins, setAnimatedWins] = useState(0)
  const [animatedLosses, setAnimatedLosses] = useState(0)
  const [animatedDraws, setAnimatedDraws] = useState(0)
  
  const total = wins + losses + draws
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0

  useEffect(() => {
    // Animate counters on mount
    const duration = 1000
    const steps = 30
    const winStep = wins / steps
    const lossStep = losses / steps
    const drawStep = draws / steps
    
    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      if (currentStep <= steps) {
        setAnimatedWins(Math.round(winStep * currentStep))
        setAnimatedLosses(Math.round(lossStep * currentStep))
        setAnimatedDraws(Math.round(drawStep * currentStep))
      } else {
        clearInterval(timer)
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [wins, losses, draws])

  return (
    <div className="glass rounded-2xl p-8 card-hover cyber-frame">
      <h2 className="text-3xl font-bold mb-8 tracking-tight flex items-center gap-3">
        <Trophy className="w-7 h-7 text-primary" />
        Tableau des scores
      </h2>
      
      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="text-center glass rounded-xl p-5 border-2 border-primary/30">
          <div className="text-4xl font-bold bg-gradient-to-r from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] bg-clip-text text-transparent mb-2 transition-all duration-300">
            {animatedWins}
          </div>
          <div className="text-xs font-semibold text-primary">Victoires</div>
        </div>
        <div className="text-center glass rounded-xl p-5 border border-border/30">
          <div className="text-4xl font-bold text-muted-foreground mb-2 transition-all duration-300">
            {animatedDraws}
          </div>
          <div className="text-xs font-semibold text-muted-foreground">Matchs nuls</div>
        </div>
        <div className="text-center glass rounded-xl p-5 border-2 border-destructive/30">
          <div className="text-4xl font-bold text-destructive mb-2 transition-all duration-300">
            {animatedLosses}
          </div>
          <div className="text-xs font-semibold text-destructive">Défaites</div>
        </div>
      </div>

      {/* Win Rate Bar with NEW violet gradient */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-base">
          <span className="text-muted-foreground font-medium">Taux de victoire</span>
          <span className="font-bold bg-gradient-to-r from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] bg-clip-text text-transparent text-lg">{winRate}%</span>
        </div>
        <div className="relative h-4 glass rounded-full overflow-hidden border border-primary/30">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[oklch(0.6_0.25_280)] via-[oklch(0.5_0.22_285)] to-[oklch(0.4_0.2_290)] rounded-full transition-all duration-1000 ease-out shadow-lg"
            style={{ width: `${winRate}%` }}
          >
            <div className="absolute inset-0 animate-pulse opacity-30 bg-gradient-to-r from-white/50 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Streak Indicator with NEW violet gradient */}
      <div className="pt-6 border-t border-border/30">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground font-medium">Série actuelle</span>
          <div className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-[oklch(0.5_0.22_285)]/20 px-4 py-2 rounded-lg border border-primary/30">
            <Flame className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary text-lg">5 victoires</span>
          </div>
        </div>
      </div>
    </div>
  )
}