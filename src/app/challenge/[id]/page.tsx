"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import { useRouter } from "next/navigation"
import { Play, Code2, CheckCircle2, Zap, Clock, Target, Sparkles } from "lucide-react"

export default function ChallengePage() {
  const router = useRouter()
  const [language, setLanguage] = useState("JavaScript")
  const [code, setCode] = useState("// Écrivez votre code ici...")
  const [testResults, setTestResults] = useState<string | null>(null)

  const handleRunTests = () => {
    setTestResults("Exécution des tests...\n✓ Test 1 : Réussi\n✓ Test 2 : Réussi\n✗ Test 3 : Échoué")
  }

  const handleSubmit = () => {
    setTestResults("Solution soumise avec succès !\n\nScore : 85/100\nTemps : 12 minutes")
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  const handleStart = () => {
    router.push('/room/1')
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-6 py-10 animate-page-enter">
        {/* Challenge Header */}
        <div className="glass rounded-2xl p-8 mb-8 card-hover cyber-frame relative overflow-hidden">
          <div className="absolute top-4 right-4 text-primary/10 text-6xl font-mono">{"{ }"}</div>
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-7 h-7 text-primary animate-pulse" />
                <span className="text-sm font-mono text-primary tech-bracket">CHALLENGE_#001</span>
              </div>
              
              <h1 className="text-5xl font-bold mb-4 tracking-tight header-glow">Titre du défi</h1>
              
              <div className="flex gap-8 text-base">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[oklch(0.75_0.22_150)] animate-pulse"></div>
                  <span className="text-muted-foreground">Difficulté :</span>
                  <span className="font-bold text-[oklch(0.75_0.22_150)]">Moyen</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[oklch(0.65_0.2_200)] animate-pulse"></div>
                  <span className="text-muted-foreground">Langage :</span>
                  <span className="font-bold">JavaScript</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Limite :</span>
                  <span className="font-bold">30 min</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleStart}
              className="px-8 py-4 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle pulse-ring btn-shimmer flex items-center gap-3 text-lg shadow-2xl"
            >
              <Sparkles className="w-6 h-6" />
              Démarrer le défi
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="glass rounded-2xl p-8 card-hover scanline">
            <div className="flex items-center gap-3 mb-6">
              <Code2 className="w-7 h-7 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">Description du problème</h2>
            </div>
            
            <div className="space-y-6 text-base leading-relaxed">
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua.
              </p>
              
              <div>
                <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Exemples
                </h3>
                <div className="glass border-2 border-primary/20 p-5 rounded-xl font-mono text-sm">
                  <div className="text-muted-foreground mb-1">Entrée : [1, 2, 3]</div>
                  <div className="text-foreground font-bold">Sortie : 6</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Contraintes
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">→</span>
                    <span>Contrainte 1</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">→</span>
                    <span>Contrainte 2</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">→</span>
                    <span>Contrainte 3</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Code Editor */}
          <div className="glass rounded-2xl p-8 card-hover cyber-frame">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Code2 className="w-7 h-7 text-primary" />
                Éditeur de code
              </h2>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="glass border-2 border-primary/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary input-focus font-medium cursor-pointer"
              >
                <option>JavaScript</option>
                <option>Python</option>
                <option>Java</option>
              </select>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full glass border-2 border-primary/20 rounded-xl p-5 font-mono text-sm h-96 overflow-auto focus:outline-none focus:border-primary resize-none input-focus"
            />
            
            <div className="flex gap-4 mt-6">
              <button 
                onClick={handleRunTests}
                className="flex-1 glass border-2 border-primary/30 px-6 py-3.5 rounded-xl font-bold btn-hover hover:border-primary/60 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Exécuter les tests
              </button>
              <button 
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] text-white px-6 py-3.5 rounded-xl font-bold btn-hover glow-subtle flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Soumettre
              </button>
            </div>
          </div>
        </div>
        
        {/* Test Results */}
        <div className="glass rounded-2xl p-8 mt-8 card-hover">
          <h2 className="text-3xl font-bold mb-6 tracking-tight flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-primary" />
            Résultats des tests
          </h2>
          <div className="text-base font-mono whitespace-pre-wrap bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-xl p-6">
            {testResults || <span className="text-muted-foreground">Exécutez votre code pour voir les résultats des tests ici...</span>}
          </div>
        </div>
      </div>
    </div>
  )
}