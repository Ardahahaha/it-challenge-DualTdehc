"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import { useRouter } from "next/navigation"
import { Search, Code2, Shield, Brain, Network, Server, Users, Filter, Zap } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"

const domains = [
  { name: "Développement", icon: Code2, color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)]" },
  { name: "Cybersécurité", icon: Shield, color: "from-[oklch(0.6_0.25_290)] to-[oklch(0.55_0.25_240)]" },
  { name: "IA", icon: Brain, color: "from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)]" },
  { name: "Réseau", icon: Network, color: "from-[oklch(0.65_0.2_200)] to-[oklch(0.75_0.22_150)]" },
  { name: "SysAdmin", icon: Server, color: "from-[oklch(0.65_0.2_40)] to-[oklch(0.75_0.22_60)]" }
]

const levels = ["Tous", "Débutant", "Intermédiaire", "Avancé", "Expert"]

export default function ProfilesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState("Tous")

  return (
    <div className="min-h-screen">
      <Navigation />
      <Toaster />
      
      <div className="container mx-auto px-6 py-10 animate-page-enter">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">EXPLORER</span>
          </div>
          <h1 className="text-6xl font-bold tracking-tight header-glow mb-4">
            <span className="bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
              Profils
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Découvrez et connectez-vous avec d'autres développeurs
          </p>
        </div>

        {/* Search & Filters */}
        <div className="glass rounded-2xl p-8 mb-8 cyber-frame">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 glass rounded-xl border-2 border-primary/20 focus:border-primary focus:outline-none transition-all text-lg"
            />
          </div>

          {/* Filters */}
          <div className="space-y-4">
            {/* Domain Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-primary" />
                <span className="font-semibold text-lg">Domaine</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedDomain(null)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all btn-hover ${
                    selectedDomain === null
                      ? "bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white"
                      : "glass border border-border"
                  }`}
                >
                  Tous
                </button>
                {domains.map(domain => {
                  const Icon = domain.icon
                  return (
                    <button
                      key={domain.name}
                      onClick={() => setSelectedDomain(domain.name)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all btn-hover flex items-center gap-2 ${
                        selectedDomain === domain.name
                          ? `bg-gradient-to-r ${domain.color} text-white`
                          : "glass border border-border"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {domain.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-primary" />
                <span className="font-semibold text-lg">Niveau</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {levels.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all btn-hover ${
                      selectedLevel === level
                        ? "bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white"
                        : "glass border border-border"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 pt-6 border-t border-border/30 text-muted-foreground font-mono">
            0 utilisateur trouvé
          </div>
        </div>

        {/* Empty State */}
        <div className="glass rounded-2xl p-16 text-center">
          <Users className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Aucun profil pour le moment</h2>
          <p className="text-xl text-muted-foreground mb-8">
            La communauté va bientôt s'agrandir. Soyez parmi les premiers !
          </p>
          <button 
            onClick={() => router.push('/signup')}
            className="px-8 py-4 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle flex items-center justify-center gap-2 mx-auto"
          >
            <Zap className="w-5 h-5" />
            Rejoindre la plateforme
          </button>
        </div>
      </div>
    </div>
  )
}