"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import { Trophy, Star, TrendingUp, Award, Sparkles, Code2, Shield, Network, Server, Brain, Users } from "lucide-react"

export default function Gamification() {
  return (
    <div className="min-h-screen animate-page-enter">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">GAMIFICATION_INTELLIGENTE</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight header-glow">
            <span className="bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
              Progression & Compétences
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Visualisez votre évolution et comparez-vous aux meilleurs
          </p>
        </div>

        {/* Stats Overview - Empty State */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-xl p-6 text-center cyber-frame">
            <div className="text-5xl font-bold text-primary mb-2 font-mono">0</div>
            <div className="text-muted-foreground mb-2">XP Total</div>
            <div className="text-sm text-muted-foreground">
              Commencez à gagner de l'XP
            </div>
          </div>
          <div className="glass rounded-xl p-6 text-center cyber-frame">
            <div className="text-5xl font-bold text-[oklch(0.75_0.22_150)] mb-2 font-mono">0</div>
            <div className="text-muted-foreground mb-2">Réputation</div>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-muted-foreground" />
              ))}
            </div>
          </div>
          <div className="glass rounded-xl p-6 text-center cyber-frame">
            <div className="text-5xl font-bold text-[oklch(0.6_0.25_290)] mb-2 font-mono">0</div>
            <div className="text-muted-foreground mb-2">Sessions complétées</div>
            <div className="text-sm text-muted-foreground">Lancez votre premier défi</div>
          </div>
        </div>

        {/* Empty State for Skills */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">Arbre de compétences</h2>
          <div className="glass rounded-2xl p-12 cyber-frame text-center">
            <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Aucune compétence suivie</h3>
            <p className="text-muted-foreground mb-6">
              Complétez des défis pour débloquer et suivre vos compétences
            </p>
          </div>
        </div>

        {/* Empty State for Leaderboards */}
        <div>
          <h2 className="text-3xl font-bold mb-6 tracking-tight">Classements par spécialité</h2>
          <div className="glass rounded-2xl p-12 cyber-frame text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Classements non disponibles</h3>
            <p className="text-muted-foreground">
              Les classements apparaîtront une fois que vous aurez commencé à participer à des défis
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}