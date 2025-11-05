"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import { History, Zap, Target, Trophy, Clock, Filter, TrendingUp, Calendar } from "lucide-react"

interface DuelHistory {
  id: number
  title: string
  opponent: string
  result: "Victoire" | "Défaite" | "Égalité"
  date: string
  language: string
  difficulty: string
  score: number
  duration: string
  tags: {
    rapidite: number // 0-100
    precision: number // 0-100
    rigueur: number // 0-100
  }
}

const mockHistory: DuelHistory[] = [
  {
    id: 1,
    title: "Algorithme de tri rapide",
    opponent: "CodeMaster92",
    result: "Victoire",
    date: "2025-11-03",
    language: "JavaScript",
    difficulty: "Avancé",
    score: 285,
    duration: "24:15",
    tags: { rapidite: 85, precision: 92, rigueur: 88 }
  },
  {
    id: 2,
    title: "Validation de formulaire complexe",
    opponent: "DevPro",
    result: "Défaite",
    date: "2025-11-02",
    language: "TypeScript",
    difficulty: "Intermédiaire",
    score: 156,
    duration: "18:42",
    tags: { rapidite: 72, precision: 65, rigueur: 70 }
  },
  {
    id: 3,
    title: "Système de cache LRU",
    opponent: "AlgoExpert",
    result: "Victoire",
    date: "2025-11-01",
    language: "Python",
    difficulty: "Avancé",
    score: 310,
    duration: "28:30",
    tags: { rapidite: 78, precision: 95, rigueur: 92 }
  },
  {
    id: 4,
    title: "Parser JSON personnalisé",
    opponent: "BinaryNinja",
    result: "Égalité",
    date: "2025-10-31",
    language: "JavaScript",
    difficulty: "Intermédiaire",
    score: 198,
    duration: "22:18",
    tags: { rapidite: 80, precision: 82, rigueur: 85 }
  },
  {
    id: 5,
    title: "Détecteur d'injection SQL",
    opponent: "SecurityPro",
    result: "Victoire",
    date: "2025-10-30",
    language: "JavaScript",
    difficulty: "Avancé",
    score: 295,
    duration: "25:45",
    tags: { rapidite: 88, precision: 90, rigueur: 94 }
  },
  {
    id: 6,
    title: "Calculateur de moyenne",
    opponent: "NewbieCoder",
    result: "Victoire",
    date: "2025-10-29",
    language: "JavaScript",
    difficulty: "Débutant",
    score: 125,
    duration: "08:20",
    tags: { rapidite: 95, precision: 88, rigueur: 85 }
  }
]

export default function HistoriquePage() {
  const [history] = useState<DuelHistory[]>(mockHistory)
  const [filterResult, setFilterResult] = useState<"Tous" | "Victoire" | "Défaite" | "Égalité">("Tous")
  const [filterDifficulty, setFilterDifficulty] = useState<"Tous" | "Débutant" | "Intermédiaire" | "Avancé">("Tous")
  
  const filteredHistory = history.filter(duel => {
    if (filterResult !== "Tous" && duel.result !== filterResult) return false
    if (filterDifficulty !== "Tous" && duel.difficulty !== filterDifficulty) return false
    return true
  })

  const getResultColor = (result: string) => {
    switch(result) {
      case "Victoire": return "text-[oklch(0.75_0.22_150)] bg-[oklch(0.75_0.22_150)]/10 border-[oklch(0.75_0.22_150)]/30"
      case "Défaite": return "text-destructive bg-destructive/10 border-destructive/30"
      case "Égalité": return "text-primary bg-primary/10 border-primary/30"
      default: return "text-muted-foreground"
    }
  }

  const getTagColor = (value: number) => {
    if (value >= 90) return "bg-[oklch(0.75_0.22_150)] text-white"
    if (value >= 75) return "bg-[oklch(0.65_0.2_200)] text-white"
    if (value >= 60) return "bg-primary text-white"
    return "bg-muted text-muted-foreground"
  }

  const stats = {
    totalDuels: history.length,
    victories: history.filter(d => d.result === "Victoire").length,
    avgRapidite: Math.round(history.reduce((sum, d) => sum + d.tags.rapidite, 0) / history.length),
    avgPrecision: Math.round(history.reduce((sum, d) => sum + d.tags.precision, 0) / history.length),
    avgRigueur: Math.round(history.reduce((sum, d) => sum + d.tags.rigueur, 0) / history.length),
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-6 py-10 animate-page-enter">
        {/* Header */}
        <div className="mb-12 relative">
          <div className="absolute top-0 right-0 text-primary/10 text-8xl font-mono">{"[ ]"}</div>
          <div className="flex items-center gap-3 mb-4">
            <History className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">HISTORY</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight header-glow bg-gradient-to-r from-[oklch(0.55_0.25_240)] via-[oklch(0.65_0.2_200)] to-[oklch(0.75_0.22_150)] bg-clip-text text-transparent mb-4">
            Historique détaillé des duels
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Analyse complète de vos performances avec tags de rapidité, précision et rigueur
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
          <div className="glass rounded-2xl p-6 card-hover cyber-frame">
            <div className="text-sm text-muted-foreground mb-2 font-mono">Total Duels</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">{stats.totalDuels}</div>
          </div>
          <div className="glass rounded-2xl p-6 card-hover cyber-frame">
            <div className="text-sm text-muted-foreground mb-2 font-mono">Victoires</div>
            <div className="text-4xl font-bold text-[oklch(0.75_0.22_150)]">{stats.victories}</div>
          </div>
          <div className="glass rounded-2xl p-6 card-hover cyber-frame">
            <div className="text-sm text-muted-foreground mb-2 font-mono flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Rapidité
            </div>
            <div className="text-4xl font-bold">{stats.avgRapidite}%</div>
          </div>
          <div className="glass rounded-2xl p-6 card-hover cyber-frame">
            <div className="text-sm text-muted-foreground mb-2 font-mono flex items-center gap-2">
              <Target className="w-4 h-4" />
              Précision
            </div>
            <div className="text-4xl font-bold">{stats.avgPrecision}%</div>
          </div>
          <div className="glass rounded-2xl p-6 card-hover cyber-frame">
            <div className="text-sm text-muted-foreground mb-2 font-mono flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Rigueur
            </div>
            <div className="text-4xl font-bold">{stats.avgRigueur}%</div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <span className="font-semibold">Filtres :</span>
          </div>
          
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground">Résultat:</span>
            {(["Tous", "Victoire", "Défaite", "Égalité"] as const).map(result => (
              <button
                key={result}
                onClick={() => setFilterResult(result)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterResult === result
                    ? "bg-primary text-white"
                    : "glass border border-primary/20 hover:border-primary/40"
                }`}
              >
                {result}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground">Difficulté:</span>
            {(["Tous", "Débutant", "Intermédiaire", "Avancé"] as const).map(difficulty => (
              <button
                key={difficulty}
                onClick={() => setFilterDifficulty(difficulty)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterDifficulty === difficulty
                    ? "bg-primary text-white"
                    : "glass border border-primary/20 hover:border-primary/40"
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.map((duel) => (
            <div
              key={duel.id}
              className="glass border-2 border-primary/20 rounded-2xl p-6 card-hover cyber-frame scanline group relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">{duel.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-medium">vs. {duel.opponent}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(duel.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {duel.duration}
                    </span>
                  </div>
                </div>
                
                <div className={`px-5 py-2.5 rounded-xl font-bold border-2 ${getResultColor(duel.result)}`}>
                  {duel.result}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-5">
                <div className="glass rounded-lg p-4 border border-primary/20">
                  <div className="text-xs text-muted-foreground mb-1">Langage</div>
                  <div className="font-bold">{duel.language}</div>
                </div>
                <div className="glass rounded-lg p-4 border border-primary/20">
                  <div className="text-xs text-muted-foreground mb-1">Difficulté</div>
                  <div className="font-bold">{duel.difficulty}</div>
                </div>
                <div className="glass rounded-lg p-4 border border-primary/20">
                  <div className="text-xs text-muted-foreground mb-1">Score</div>
                  <div className="font-bold text-primary">{duel.score} pts</div>
                </div>
                
                {/* Performance Tags */}
                <div className="glass rounded-lg p-4 border border-[oklch(0.75_0.22_150)]/30">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Rapidité
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] transition-all"
                        style={{ width: `${duel.tags.rapidite}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getTagColor(duel.tags.rapidite)}`}>
                      {duel.tags.rapidite}%
                    </span>
                  </div>
                </div>
                
                <div className="glass rounded-lg p-4 border border-primary/30">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Précision
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] transition-all"
                        style={{ width: `${duel.tags.precision}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getTagColor(duel.tags.precision)}`}>
                      {duel.tags.precision}%
                    </span>
                  </div>
                </div>
                
                <div className="glass rounded-lg p-4 border border-[oklch(0.6_0.25_290)]/30">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Rigueur
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[oklch(0.6_0.25_290)] to-[oklch(0.55_0.25_240)] transition-all"
                        style={{ width: `${duel.tags.rigueur}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getTagColor(duel.tags.rigueur)}`}>
                      {duel.tags.rigueur}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="glass rounded-lg p-4 border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-semibold">Analyse :</span>
                  <span className="text-muted-foreground">
                    {duel.tags.rapidite >= 85 ? "Excellent temps de réponse" : "Bonne vitesse d'exécution"} • 
                    {duel.tags.precision >= 85 ? " Code très précis" : " Code fonctionnel"} • 
                    {duel.tags.rigueur >= 85 ? " Structure exemplaire" : " Structure correcte"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Aucun duel trouvé</h3>
            <p className="text-muted-foreground">Essayez de modifier vos filtres</p>
          </div>
        )}
      </div>
    </div>
  )
}
