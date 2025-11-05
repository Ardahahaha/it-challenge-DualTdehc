"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import { Target, Users, Brain, FileCheck, Star, Zap, TrendingUp, Shield } from "lucide-react"

const learningStyles = [
  { id: "visual", name: "Visuel", description: "Schémas, diagrammes, code commenté", icon: "👁️" },
  { id: "auditif", name: "Auditif", description: "Explications orales, discussions", icon: "🎧" },
  { id: "kinesthetic", name: "Kinesthésique", description: "Pratique, exercices, essai-erreur", icon: "✋" },
  { id: "logique", name: "Logique", description: "Analyse, déduction, patterns", icon: "🧠" }
]

const suggestedPartners = [
  {
    name: "Marie_Dev",
    level: "Intermédiaire",
    style: "Visuel",
    compatibility: 95,
    domains: ["React", "TypeScript", "Node.js"],
    avatar: "M",
    color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)]"
  },
  {
    name: "Thomas_Code",
    level: "Avancé",
    style: "Logique",
    compatibility: 88,
    domains: ["Architecture", "System Design", "Algorithms"],
    avatar: "T",
    color: "from-[oklch(0.6_0.25_290)] to-[oklch(0.75_0.22_150)]"
  },
  {
    name: "Sophie_Debug",
    level: "Intermédiaire",
    style: "Kinesthésique",
    compatibility: 92,
    domains: ["Debugging", "Testing", "DevOps"],
    avatar: "S",
    color: "from-[oklch(0.65_0.2_200)] to-[oklch(0.75_0.22_150)]"
  }
]

export default function Matchmaking() {
  const [selectedStyle, setSelectedStyle] = useState<string>("logique")
  const [difficulty, setDifficulty] = useState<string>("intermediaire")
  const [contractActive, setContractActive] = useState(false)
  const [objectives, setObjectives] = useState("")
  const [notes, setNotes] = useState("")

  return (
    <div className="min-h-screen animate-page-enter">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">FONCTIONS_DIFFERENCIANTES</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight header-glow">
            <span className="bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
              Matchmaking Intelligent
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Trouvez le partenaire idéal selon votre style et vos objectifs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Settings */}
          <div className="space-y-6">
            {/* Adaptive Difficulty */}
            <div className="glass rounded-2xl p-6 cyber-frame">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Difficulté adaptative
              </h2>
              
              <div className="space-y-3">
                {["debutant", "intermediaire", "avance"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all text-left ${
                      difficulty === level
                        ? "bg-primary text-white"
                        : "bg-background hover:bg-primary/10"
                    }`}
                  >
                    <div className="font-semibold capitalize">{level}</div>
                    <div className="text-xs opacity-80">
                      {level === "debutant" && "Bases et fondamentaux"}
                      {level === "intermediaire" && "Concepts avancés"}
                      {level === "avance" && "Architecture & système"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Style */}
            <div className="glass rounded-2xl p-6 cyber-frame">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Style d'apprentissage
              </h2>
              
              <div className="space-y-2">
                {learningStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`w-full p-3 rounded-lg transition-all text-left ${
                      selectedStyle === style.id
                        ? "bg-primary/20 border-2 border-primary"
                        : "bg-background border-2 border-transparent hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{style.icon}</span>
                      <span className="font-semibold">{style.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Matching */}
            <button className="w-full px-6 py-4 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-semibold btn-hover glow-subtle flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              Lancer le matchmaking
            </button>
          </div>

          {/* Middle Column - Suggested Partners */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6 cyber-frame">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Partenaires suggérés
              </h2>
              
              <div className="space-y-4">
                {suggestedPartners.map((partner, i) => (
                  <div key={i} className="glass rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${partner.color} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}>
                        {partner.avatar}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold">{partner.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-[oklch(0.75_0.22_150)] fill-current" />
                            <span className="font-semibold">{partner.compatibility}%</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                            {partner.level}
                          </span>
                          <span className="px-2 py-1 bg-[oklch(0.6_0.25_290)]/10 text-[oklch(0.6_0.25_290)] text-xs rounded">
                            Style: {partner.style}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {partner.domains.map((domain, j) => (
                            <span key={j} className="text-xs px-2 py-1 bg-background rounded border border-border">
                              {domain}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium btn-hover">
                            Inviter à une session
                          </button>
                          <button className="px-4 py-2 bg-background hover:bg-primary/10 rounded-lg font-medium transition-all">
                            Profil
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-[oklch(0.75_0.22_150)]/10 rounded-lg border border-[oklch(0.75_0.22_150)]/20">
                      <div className="text-sm text-muted-foreground">
                        💡 <span className="font-semibold">Compatibilité élevée:</span> Styles complémentaires, 
                        expérience similaire en {partner.domains[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Contract */}
            <div className="glass rounded-2xl p-6 cyber-frame">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                Contrat de session
              </h2>
              
              {!contractActive ? (
                <>
                  <p className="text-muted-foreground mb-4">
                    Définissez des objectifs clairs avant chaque session pour maximiser votre apprentissage
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 p-4 bg-background rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">1</div>
                      <div>
                        <div className="font-semibold mb-1">Objectifs définis</div>
                        <div className="text-sm text-muted-foreground">Quels concepts voulez-vous maîtriser ?</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-background rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">2</div>
                      <div>
                        <div className="font-semibold mb-1">Session structurée</div>
                        <div className="text-sm text-muted-foreground">Suivez votre plan et progressez ensemble</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-background rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">3</div>
                      <div>
                        <div className="font-semibold mb-1">Résultat écrit</div>
                        <div className="text-sm text-muted-foreground">Récapitulatif et points clés appris</div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setContractActive(true)}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold btn-hover"
                  >
                    Créer un contrat de session
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Objectifs de la session</label>
                    <textarea
                      value={objectives}
                      onChange={(e) => setObjectives(e.target.value)}
                      placeholder="Ex: Comprendre les hooks React, maîtriser useEffect, créer un composant réutilisable..."
                      className="w-full h-32 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Notes anonymisées (pour impartialité)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Les notes seront anonymisées pour garantir une évaluation objective..."
                      className="w-full h-24 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      Les identifiants seront masqués pour garantir une évaluation impartiale
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold btn-hover">
                      Démarrer la session
                    </button>
                    <button
                      onClick={() => setContractActive(false)}
                      className="px-6 py-3 bg-border text-foreground rounded-lg font-medium btn-hover"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
