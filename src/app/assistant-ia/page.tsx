"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import { Brain, Lightbulb, Shield, BarChart3, MessageSquare, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react"

const hints = [
  { level: 1, hint: "Pensez à la structure de données qui permet un accès rapide..." },
  { level: 2, hint: "Une HashMap pourrait être utile ici..." },
  { level: 3, hint: "Utilisez un dictionnaire pour stocker les valeurs déjà vues..." }
]

const sessionFeedback = {
  strengths: [
    "Excellente compréhension des structures de données",
    "Bonne capacité d'analyse du problème",
    "Communication claire et structurée"
  ],
  weaknesses: [
    "Complexité temporelle à optimiser",
    "Gestion des cas limites à améliorer",
    "Tests unitaires incomplets"
  ],
  suggestions: [
    "Revoir les algorithmes de tri avancés",
    "Pratiquer la programmation dynamique",
    "Approfondir les patterns de design"
  ]
}

export default function AssistantIA() {
  const [currentHintLevel, setCurrentHintLevel] = useState(0)
  const [code, setCode] = useState(`function findDuplicate(arr) {
  // Votre code ici
  
}`)
  const [showFeedback, setShowFeedback] = useState(false)
  const [antiCheatActive, setAntiCheatActive] = useState(true)

  const showNextHint = () => {
    if (currentHintLevel < hints.length) {
      setCurrentHintLevel(currentHintLevel + 1)
    }
  }

  return (
    <div className="min-h-screen animate-page-enter">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">IA_UTILE</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight header-glow">
            <span className="bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
              Assistant IA Intelligent
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Un tuteur silencieux qui guide sans donner les réponses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Code Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tuteur Silencieux */}
            <div className="glass rounded-2xl p-6 cyber-frame">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Tuteur silencieux
                </h2>
                <div className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                  Indices progressifs
                </div>
              </div>
              
              <div className="mb-6">
                <div className="font-semibold mb-3">Problème:</div>
                <div className="p-4 bg-background rounded-lg">
                  <p className="text-muted-foreground">
                    Écrivez une fonction qui trouve un élément dupliqué dans un tableau d'entiers en O(n) temps et O(n) espace.
                  </p>
                </div>
              </div>

              {/* Code Editor */}
              <div className="mb-6">
                <div className="font-semibold mb-2">Votre solution:</div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-64 px-4 py-3 bg-[oklch(0.15_0.02_240)] text-[oklch(0.85_0.05_150)] border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              {/* Hints Display */}
              <div className="space-y-3 mb-6">
                {hints.slice(0, currentHintLevel).map((hint, i) => (
                  <div key={i} className="p-4 bg-[oklch(0.75_0.22_150)]/10 border border-[oklch(0.75_0.22_150)]/30 rounded-lg animate-page-enter">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-[oklch(0.75_0.22_150)] mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-[oklch(0.75_0.22_150)] mb-1">
                          Indice niveau {hint.level}
                        </div>
                        <div className="text-sm">{hint.hint}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={showNextHint}
                  disabled={currentHintLevel >= hints.length}
                  className="px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentHintLevel >= hints.length ? "Tous les indices révélés" : "Demander un indice"}
                </button>
                <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium btn-hover">
                  Vérifier la solution
                </button>
              </div>

              <div className="mt-4 p-3 bg-background rounded-lg">
                <div className="text-sm text-muted-foreground">
                  💡 L'IA ne donne jamais la réponse directe - elle vous guide avec des indices progressifs pour que vous trouviez la solution par vous-même.
                </div>
              </div>
            </div>

            {/* Anti-Cheat System */}
            <div className="glass rounded-2xl p-6 cyber-frame">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Système anti-triche (placeholder)
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${antiCheatActive ? 'bg-[oklch(0.75_0.22_150)]' : 'bg-muted'} animate-pulse`}></div>
                    <div>
                      <div className="font-semibold">Détection de copier-coller</div>
                      <div className="text-sm text-muted-foreground">Surveillanceactive</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setAntiCheatActive(!antiCheatActive)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      antiCheatActive ? 'bg-[oklch(0.75_0.22_150)]/20 text-[oklch(0.75_0.22_150)]' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {antiCheatActive ? 'Actif' : 'Inactif'}
                  </button>
                </div>

                <div className="p-4 bg-background rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[oklch(0.65_0.2_40)] mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">Analyse du comportement</div>
                      <div className="text-sm text-muted-foreground">
                        L'IA analyse les patterns de frappe et détecte les comportements suspects (collage de code externe, changements brusques de style, etc.)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[oklch(0.75_0.22_150)]/10 border border-[oklch(0.75_0.22_150)]/30 rounded-lg">
                  <div className="flex items-center gap-2 text-[oklch(0.75_0.22_150)]">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Aucune activité suspecte détectée</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Feedback */}
          <div className="space-y-6">
            {/* Session Feedback */}
            <div className="glass rounded-2xl p-6 cyber-frame">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Feedback de session
              </h2>
              
              {!showFeedback ? (
                <>
                  <p className="text-muted-foreground mb-6">
                    Recevez une analyse détaillée de votre performance après chaque session
                  </p>
                  <button
                    onClick={() => setShowFeedback(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-lg font-semibold btn-hover glow-subtle"
                  >
                    Voir le feedback
                  </button>
                </>
              ) : (
                <div className="space-y-6">
                  {/* Strengths */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-[oklch(0.75_0.22_150)]" />
                      <h3 className="font-bold">Points forts</h3>
                    </div>
                    <div className="space-y-2">
                      {sessionFeedback.strengths.map((strength, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-[oklch(0.75_0.22_150)]/10 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-[oklch(0.75_0.22_150)] mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weaknesses */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="w-5 h-5 text-[oklch(0.65_0.2_40)]" />
                      <h3 className="font-bold">À améliorer</h3>
                    </div>
                    <div className="space-y-2">
                      {sessionFeedback.weaknesses.map((weakness, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-[oklch(0.65_0.2_40)]/10 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-[oklch(0.65_0.2_40)] mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{weakness}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      <h3 className="font-bold">Suggestions</h3>
                    </div>
                    <div className="space-y-2">
                      {sessionFeedback.suggestions.map((suggestion, i) => (
                        <div key={i} className="p-3 bg-primary/5 rounded-lg text-sm">
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowFeedback(false)}
                    className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all"
                  >
                    Masquer le feedback
                  </button>
                </div>
              )}
            </div>

            {/* AI Stats */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-bold mb-4">Statistiques IA</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Indices utilisés</span>
                    <span className="font-semibold">{currentHintLevel}/{hints.length}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] transition-all"
                      style={{ width: `${(currentHintLevel / hints.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Autonomie</span>
                    <span className="font-semibold">{100 - (currentHintLevel / hints.length) * 100}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] transition-all"
                      style={{ width: `${100 - (currentHintLevel / hints.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
