"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import Scoreboard from "@/components/Scoreboard"
import BadgeCard from "@/components/BadgeCard"
import { useRouter } from "next/navigation"
import { User, Zap, Trophy, Activity, Sparkles, Code2 } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"history" | "stats">("history")

  const handleChallenge = () => {
    router.push('/room/1')
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-6 py-10 animate-page-enter">
        {/* Profile Header */}
        <div className="glass rounded-2xl p-10 mb-10 card-hover cyber-frame relative overflow-hidden">
          <div className="absolute top-4 right-4 text-primary/10 text-3xl font-mono">03</div>
          
          <div className="flex items-start gap-10">
            <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
              U
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-mono text-primary tech-bracket">PROFILE</span>
              </div>
              <h1 className="text-5xl font-bold mb-3 tracking-tight header-glow">Utilisateur</h1>
              <p className="text-lg text-muted-foreground mb-2 flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Niveau : <span className="font-bold text-primary">Intermédiaire</span>
              </p>
              <p className="mb-8 leading-relaxed text-lg">Bio : Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <button 
                onClick={handleChallenge}
                className="bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white px-8 py-4 rounded-xl font-bold btn-hover glow-subtle pulse-ring flex items-center gap-2 text-lg"
              >
                <Zap className="w-5 h-5" />
                Défier l'utilisateur
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-8 border-b-2 border-border/30">
          <div className="flex gap-12">
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-4 px-2 border-b-3 font-semibold text-lg transition-all duration-300 relative ${
                activeTab === "history"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity className="w-5 h-5 inline mr-2" />
              Historique des défis
              {activeTab === "history" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] animate-pulse"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`pb-4 px-2 border-b-3 font-semibold text-lg transition-all duration-300 relative ${
                activeTab === "stats"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Trophy className="w-5 h-5 inline mr-2" />
              Statistiques
              {activeTab === "stats" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] animate-pulse"></div>
              )}
            </button>
          </div>
        </div>
        
        {activeTab === "stats" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass rounded-2xl p-8 card-hover cyber-frame relative overflow-hidden">
                <div className="absolute top-4 right-4 text-primary/10 text-2xl font-mono">01</div>
                <div className="text-sm text-muted-foreground mb-3 font-mono">Total des défis</div>
                <div className="text-5xl font-bold tracking-tight bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">42</div>
              </div>
              <div className="glass rounded-2xl p-8 card-hover cyber-frame relative overflow-hidden">
                <div className="absolute top-4 right-4 text-primary/10 text-2xl font-mono">02</div>
                <div className="text-sm text-muted-foreground mb-3 font-mono">Victoires</div>
                <div className="text-5xl font-bold tracking-tight text-[oklch(0.75_0.22_150)]">28</div>
              </div>
              <div className="glass rounded-2xl p-8 card-hover cyber-frame relative overflow-hidden">
                <div className="absolute top-4 right-4 text-primary/10 text-2xl font-mono">03</div>
                <div className="text-sm text-muted-foreground mb-3 font-mono">Défaites</div>
                <div className="text-5xl font-bold tracking-tight text-destructive">12</div>
              </div>
              <div className="glass rounded-2xl p-8 card-hover cyber-frame relative overflow-hidden">
                <div className="absolute top-4 right-4 text-primary/10 text-2xl font-mono">04</div>
                <div className="text-sm text-muted-foreground mb-3 font-mono">Taux de victoire</div>
                <div className="text-5xl font-bold tracking-tight bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">67%</div>
              </div>
            </div>

            {/* Scoreboard and Badges */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Scoreboard wins={28} losses={12} draws={2} />
              
              {/* Badges */}
              <div className="glass rounded-2xl p-8 card-hover">
                <h2 className="text-3xl font-bold mb-8 tracking-tight flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-primary animate-pulse" />
                  Badges
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <BadgeCard name="Première victoire" unlocked icon="🏆" />
                  <BadgeCard name="Série de 5" unlocked icon="🔥" />
                  <BadgeCard name="Vétéran" unlocked icon="⭐" />
                  <BadgeCard name="Expert code" icon="💻" />
                  <BadgeCard name="Maître du temps" icon="⏱️" />
                  <BadgeCard name="Légende" icon="👑" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "history" && (
          <div className="glass rounded-2xl p-8 scanline">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="glass border-2 border-primary/20 rounded-xl p-6 cursor-pointer card-hover group relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-primary/10 text-xl font-mono group-hover:text-primary/20 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-bold text-xl mb-2">Titre du défi</div>
                      <div className="text-base text-muted-foreground">vs. Adversaire</div>
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">Il y a {i + 1} jours</div>
                  </div>
                  <div className="flex gap-8 text-base mt-4">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Langage :</span>
                      <span className="font-semibold">JavaScript</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Difficulté :</span>
                      <span className="font-semibold">Moyen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Résultat :</span>
                      <span className={`font-bold ${i % 2 === 0 ? "text-[oklch(0.75_0.22_150)]" : "text-destructive"}`}>
                        {i % 2 === 0 ? "Victoire" : "Défaite"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}