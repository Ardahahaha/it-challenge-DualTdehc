"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/Navigation"
import { Zap, Users, Timer, Code2, Trophy, Play, CheckCircle } from "lucide-react"

export default function ModesChallenge() {
  const [speedChallengeActive, setSpeedChallengeActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [points, setPoints] = useState(0)
  const [answer, setAnswer] = useState("")
  const [pairDebugActive, setPairDebugActive] = useState(false)
  const [codeContent, setCodeContent] = useState(`function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i <= arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

// Bug: i <= arr.length devrait être i < arr.length
// Cela cause un accès hors limites`)

  useEffect(() => {
    if (speedChallengeActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
    if (timeLeft === 0 && speedChallengeActive) {
      setSpeedChallengeActive(false)
      alert(`Temps écoulé ! Vous avez obtenu ${points} points`)
    }
  }, [speedChallengeActive, timeLeft, points])

  const startSpeedChallenge = () => {
    setSpeedChallengeActive(true)
    setTimeLeft(300)
    setPoints(0)
    setAnswer("")
  }

  const submitSpeedAnswer = () => {
    if (answer.toLowerCase().includes("binary") || answer.toLowerCase().includes("binaire")) {
      setPoints(points + 100)
      setSpeedChallengeActive(false)
      alert("Correct ! +100 points")
    } else {
      alert("Incorrect. Réessayez !")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen animate-page-enter">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">NOUVEAUX_MODES</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight header-glow">
            <span className="bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
              Modes de challenge
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Des formats variés pour progresser rapidement et efficacement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Speed Challenge */}
          <div className="glass rounded-2xl p-8 cyber-frame">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] flex items-center justify-center">
                <Timer className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Speed Challenge</h2>
                <p className="text-muted-foreground text-sm">5 minutes • 1 problème • Chrono</p>
              </div>
            </div>

            {!speedChallengeActive ? (
              <>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-semibold">Rapide et intense</div>
                      <div className="text-sm text-muted-foreground">Un seul problème, 5 minutes pour le résoudre</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-semibold">Points et classement</div>
                      <div className="text-sm text-muted-foreground">Gagnez des points selon votre rapidité</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-semibold">Entraînement quotidien</div>
                      <div className="text-sm text-muted-foreground">Parfait pour maintenir ses compétences</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={startSpeedChallenge}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-semibold btn-hover glow-subtle flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Démarrer un Speed Challenge
                </button>
              </>
            ) : (
              <div>
                {/* Timer & Points */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-primary font-mono">{formatTime(timeLeft)}</div>
                    <div className="text-sm text-muted-foreground">Temps restant</div>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-[oklch(0.75_0.22_150)] font-mono">{points}</div>
                    <div className="text-sm text-muted-foreground">Points</div>
                  </div>
                </div>

                {/* Problem */}
                <div className="glass rounded-xl p-6 mb-4">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" />
                    Problème
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Quelle structure de données permet une recherche en O(log n) dans un ensemble trié ?
                  </p>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Votre réponse..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
                  />
                  <button
                    onClick={submitSpeedAnswer}
                    className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium btn-hover"
                  >
                    Soumettre la réponse
                  </button>
                </div>

                <button
                  onClick={() => setSpeedChallengeActive(false)}
                  className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-all"
                >
                  Abandonner
                </button>
              </div>
            )}
          </div>

          {/* Pair Debugging */}
          <div className="glass rounded-2xl p-8 cyber-frame">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[oklch(0.6_0.25_290)] to-[oklch(0.75_0.22_150)] flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Pair Debugging</h2>
                <p className="text-muted-foreground text-sm">Collaboratif • Code partagé</p>
              </div>
            </div>

            {!pairDebugActive ? (
              <>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-semibold">Écran de code partagé</div>
                      <div className="text-sm text-muted-foreground">Travaillez ensemble sur le même code</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-semibold">Corrections ensemble</div>
                      <div className="text-sm text-muted-foreground">Trouvez et corrigez les bugs en équipe</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-semibold">Apprentissage par la pratique</div>
                      <div className="text-sm text-muted-foreground">Comprenez les erreurs courantes</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setPairDebugActive(true)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[oklch(0.6_0.25_290)] to-[oklch(0.75_0.22_150)] text-white rounded-xl font-semibold btn-hover glow-subtle flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Démarrer une session
                </button>
              </>
            ) : (
              <div>
                {/* Partner Info */}
                <div className="glass rounded-xl p-4 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Marie_Debug</div>
                    <div className="text-sm text-muted-foreground">Niveau Intermédiaire</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[oklch(0.75_0.22_150)] animate-pulse"></div>
                </div>

                {/* Code Editor */}
                <div className="glass rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-primary" />
                      Code partagé
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono">JavaScript</span>
                  </div>
                  <textarea
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    className="w-full h-64 px-4 py-3 bg-[oklch(0.15_0.02_240)] text-[oklch(0.85_0.05_150)] border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium btn-hover">
                    <Trophy className="w-4 h-4 inline mr-2" />
                    Bug corrigé !
                  </button>
                  <button
                    onClick={() => setPairDebugActive(false)}
                    className="px-4 py-3 bg-border text-foreground rounded-lg font-medium btn-hover"
                  >
                    Quitter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2 font-mono">143</div>
            <div className="text-muted-foreground">Speed Challenges complétés</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-[oklch(0.6_0.25_290)] mb-2 font-mono">89</div>
            <div className="text-muted-foreground">Sessions de Pair Debugging</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-[oklch(0.75_0.22_150)] mb-2 font-mono">2847</div>
            <div className="text-muted-foreground">Points totaux gagnés</div>
          </div>
        </div>
      </div>
    </div>
  )
}
