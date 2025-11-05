"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/Navigation"
import { Play, CheckCircle2, Clock, Target, Code2, Zap, User } from "lucide-react"
import { generateSubject, type UserLevel, type SubjectCategory } from "@/lib/subject-generator"

export default function ModeSoloPage() {
  const [userLevel, setUserLevel] = useState<UserLevel>("Intermédiaire")
  const [category, setCategory] = useState<SubjectCategory | "Tous">("Tous")
  const [currentChallenge, setCurrentChallenge] = useState<any>(null)
  const [code, setCode] = useState("// Écrivez votre solution ici...")
  const [isStarted, setIsStarted] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Timer
  useEffect(() => {
    if (isStarted && !isComplete) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isStarted, isComplete])

  const handleStartChallenge = () => {
    const subject = generateSubject(userLevel, category === "Tous" ? undefined : category)
    setCurrentChallenge(subject)
    setIsStarted(true)
    setCode("// Écrivez votre solution ici...")
    setTimeElapsed(0)
    setIsComplete(false)
  }

  const handleRunCode = () => {
    // Simuler l'exécution du code
    const randomScore = Math.floor(Math.random() * 50) + 50
    setScore(randomScore)
  }

  const handleSubmit = () => {
    // Simuler la soumission
    const finalScore = score + Math.floor(Math.random() * 30) + 70
    setScore(finalScore)
    setIsComplete(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-6 py-10 animate-page-enter">
        {/* Header */}
        <div className="mb-12 relative">
          <div className="absolute top-0 right-0 text-primary/10 text-8xl font-mono">{"{ }"}</div>
          <div className="flex items-center gap-3 mb-4">
            <User className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">SOLO_MODE</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight header-glow bg-gradient-to-r from-[oklch(0.55_0.25_240)] via-[oklch(0.65_0.2_200)] to-[oklch(0.75_0.22_150)] bg-clip-text text-transparent mb-4">
            Mode Solo - Entraînement personnel
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Pratiquez les défis localement à votre rythme sans adversaire
          </p>
        </div>

        {!isStarted ? (
          <div className="max-w-3xl mx-auto">
            <div className="glass rounded-2xl p-10 cyber-frame">
              <h2 className="text-3xl font-bold mb-8 tracking-tight">Configurez votre session d'entraînement</h2>
              
              <div className="space-y-6 mb-10">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-foreground">
                    Votre niveau
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {(["Débutant", "Intermédiaire", "Avancé", "Expert"] as UserLevel[]).map(level => (
                      <button
                        key={level}
                        onClick={() => setUserLevel(level)}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                          userLevel === level
                            ? "bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white"
                            : "glass border-2 border-primary/20 hover:border-primary/40"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-foreground">
                    Catégorie
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {(["Tous", "Développement", "Cybersécurité", "IA"] as const).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                          category === cat
                            ? "bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] text-white"
                            : "glass border-2 border-primary/20 hover:border-primary/40"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartChallenge}
                className="w-full px-8 py-5 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle pulse-ring flex items-center justify-center gap-3 text-lg"
              >
                <Play className="w-6 h-6" />
                Commencer l'entraînement
              </button>
            </div>
          </div>
        ) : isComplete ? (
          <div className="max-w-3xl mx-auto">
            <div className="glass rounded-2xl p-12 text-center cyber-frame">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] flex items-center justify-center mx-auto mb-8 glow-subtle">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>

              <h2 className="text-5xl font-bold mb-4 tracking-tight header-glow">
                Défi terminé !
              </h2>

              <div className="text-7xl font-bold mb-8 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
                {score} pts
              </div>

              <div className="glass rounded-xl p-6 mb-10 border border-primary/20">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Temps écoulé</div>
                    <div className="text-3xl font-bold">{formatTime(timeElapsed)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Difficulté</div>
                    <div className="text-3xl font-bold">{currentChallenge.difficulty}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Points</div>
                    <div className="text-3xl font-bold text-primary">{currentChallenge.points}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleStartChallenge}
                  className="px-8 py-4 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle"
                >
                  Nouveau défi
                </button>
                <button
                  onClick={() => setIsStarted(false)}
                  className="px-8 py-4 glass border-2 border-primary/20 rounded-xl font-bold btn-hover"
                >
                  Changer de niveau
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Challenge Info */}
            <div className="glass rounded-2xl p-8 flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-xs font-mono text-primary tech-bracket">CHALLENGE</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">{currentChallenge.title}</h2>
                <p className="text-muted-foreground text-lg">{currentChallenge.description}</p>
              </div>
              
              <div className="flex gap-6">
                <div className="text-center glass rounded-xl px-6 py-3 border-2 border-primary/30">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold">{formatTime(timeElapsed)}</div>
                  <div className="text-xs text-muted-foreground">Temps écoulé</div>
                </div>
                
                <div className="text-center glass rounded-xl px-6 py-3 border-2 border-[oklch(0.75_0.22_150)]/30">
                  <Zap className="w-5 h-5 mx-auto mb-1 text-[oklch(0.75_0.22_150)]" />
                  <div className="text-2xl font-bold text-[oklch(0.75_0.22_150)]">{currentChallenge.points}</div>
                  <div className="text-xs text-muted-foreground">Points max</div>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="glass rounded-2xl overflow-hidden cyber-frame">
              <div className="border-b-2 border-primary/20 bg-gradient-to-r from-primary/10 to-transparent px-6 py-4">
                <div className="font-bold text-lg flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  Votre code
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 p-8 bg-gradient-to-br from-primary/5 to-transparent font-mono text-sm resize-none focus:outline-none border-none"
              />
              <div className="border-t-2 border-primary/20 p-5 flex gap-4">
                <button 
                  onClick={handleRunCode}
                  className="flex-1 glass border-2 border-primary/30 px-6 py-3.5 rounded-xl font-bold btn-hover hover:border-primary/60 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Tester le code
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] text-white px-6 py-3.5 rounded-xl font-bold btn-hover glow-subtle flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Terminer
                </button>
              </div>
            </div>

            {/* Score Display */}
            {score > 0 && (
              <div className="glass rounded-xl p-6 border-2 border-primary/30 animate-page-enter">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[oklch(0.75_0.22_150)]" />
                  <span className="text-lg font-semibold">Dernier test : <span className="text-2xl text-[oklch(0.75_0.22_150)]">{score} points</span></span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
