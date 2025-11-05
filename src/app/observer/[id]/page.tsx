"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/Navigation"
import { useParams } from "next/navigation"
import { Clock, Eye, Users, Code2, MessageCircle, Target, Zap } from "lucide-react"

export default function ObserverModePage() {
  const params = useParams()
  const roomId = params.id
  const [timeRemaining, setTimeRemaining] = useState(720) // 12:00
  const [player1Code, setPlayer1Code] = useState("// Code du joueur 1...\nfunction calculateSum(arr) {\n  return arr.reduce((a, b) => a + b, 0);\n}")
  const [player2Code, setPlayer2Code] = useState("// Code du joueur 2...\nfunction calculateSum(numbers) {\n  let sum = 0;\n  for(let i = 0; i < numbers.length; i++) {\n    sum += numbers[i];\n  }\n  return sum;\n}")
  const [player1Points, setPlayer1Points] = useState(45)
  const [player2Points, setPlayer2Points] = useState(38)
  const [chatMessages, setChatMessages] = useState([
    { sender: "Spectateur1", message: "Belle approche !", id: 1 },
    { sender: "Spectateur2", message: "Le joueur 1 est rapide", id: 2 },
    { sender: "Système", message: "3 spectateurs en ligne", id: 3 }
  ])
  const [spectatorCount, setSpectatorCount] = useState(3)
  const [currentQuestion, setCurrentQuestion] = useState("Créer une fonction qui calcule la somme d'un tableau de nombres")

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate code updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate player typing
      if (Math.random() > 0.5) {
        const additions = [
          "\n// Optimisation...",
          "\n// Test case",
          "\nconsole.log('Testing...')"
        ]
        const random = additions[Math.floor(Math.random() * additions.length)]
        setPlayer1Code(prev => prev + random)
      }
      
      // Random points update
      if (Math.random() > 0.7) {
        setPlayer1Points(prev => prev + Math.floor(Math.random() * 5))
        setPlayer2Points(prev => prev + Math.floor(Math.random() * 5))
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Simulate spectator count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setSpectatorCount(prev => Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)))
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex flex-col animate-page-enter">
      <Navigation />
      
      {/* Observer Mode Banner */}
      <div className="bg-gradient-to-r from-[oklch(0.6_0.25_290)] to-[oklch(0.55_0.25_240)] text-white px-6 py-3 text-center font-bold flex items-center justify-center gap-3">
        <Eye className="w-5 h-5 animate-pulse" />
        MODE OBSERVATEUR - Lecture seule
        <div className="flex items-center gap-2 ml-4 glass rounded-lg px-3 py-1">
          <Users className="w-4 h-4" />
          <span>{spectatorCount} spectateurs</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        {/* Room Header */}
        <div className="border-b-2 border-primary/20 glass backdrop-blur-xl">
          <div className="container mx-auto px-6 py-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-xs font-mono text-primary tech-bracket">OBSERVER_ROOM_#{roomId}</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Duel en cours - Mode Spectateur</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Vous observez ce duel de manière anonyme
                </p>
              </div>
              
              {/* Scores and Timer */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="text-center glass rounded-xl px-6 py-3 border-2 border-primary/40 glow-subtle">
                    <div className="text-3xl font-bold bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">{player1Points}</div>
                    <div className="text-xs text-muted-foreground font-semibold mt-1">Joueur 1</div>
                  </div>
                  <div className="text-muted-foreground font-bold text-2xl">VS</div>
                  <div className="text-center glass rounded-xl px-6 py-3 border-2 border-[oklch(0.75_0.22_150)]/40 glow-subtle">
                    <div className="text-3xl font-bold bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">{player2Points}</div>
                    <div className="text-xs text-muted-foreground font-semibold mt-1">Joueur 2</div>
                  </div>
                </div>
                
                <div className="text-center glass rounded-xl px-6 py-3 border-2 border-primary/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className={`w-5 h-5 ${timeRemaining < 60 ? 'text-destructive' : 'text-primary'}`} />
                    <div className={`text-3xl font-bold tracking-tight transition-colors duration-300 ${timeRemaining < 60 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                      {formatTime(timeRemaining)}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground font-semibold">Temps restant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Split Screen - Player 1 Code */}
          <div className="flex-1 border-r-2 border-primary/20 flex flex-col glass">
            <div className="border-b-2 border-primary/20 bg-gradient-to-r from-primary/10 to-transparent px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="font-bold text-lg flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  Code Joueur 1
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[oklch(0.75_0.22_150)]" />
                  <span className="text-sm font-semibold text-[oklch(0.75_0.22_150)]">{player1Points} pts</span>
                </div>
              </div>
            </div>
            <div className="flex-1 p-8 bg-gradient-to-br from-primary/5 to-transparent font-mono text-sm overflow-auto whitespace-pre-wrap opacity-80">
              {player1Code}
            </div>
          </div>
          
          {/* Split Screen - Player 2 Code */}
          <div className="flex-1 flex flex-col glass">
            <div className="border-b-2 border-primary/20 bg-gradient-to-l from-[oklch(0.75_0.22_150)]/10 to-transparent px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="font-bold text-lg flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-[oklch(0.75_0.22_150)]" />
                  Code Joueur 2
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">{player2Points} pts</span>
                </div>
              </div>
            </div>
            <div className="flex-1 p-8 bg-gradient-to-br from-[oklch(0.75_0.22_150)]/5 to-transparent font-mono text-sm overflow-auto whitespace-pre-wrap opacity-80">
              {player2Code}
            </div>
          </div>
        </div>
        
        {/* Bottom Section - Question & Spectator Chat */}
        <div className="border-t-2 border-primary/20 h-72 flex">
          {/* Question Display */}
          <div className="flex-1 border-r-2 border-primary/20 p-8 overflow-auto glass flex flex-col">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-5">
                <h2 className="font-bold text-xl tracking-tight flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary animate-pulse" />
                  Défi en cours
                </h2>
                <div className="text-xs font-mono bg-gradient-to-r from-primary/20 to-[oklch(0.65_0.2_200)]/20 text-primary px-4 py-2 rounded-lg border border-primary/30">
                  OBSERVATEUR
                </div>
              </div>
              
              <div className="glass border-2 border-primary/30 rounded-xl p-5">
                <p className="text-base font-semibold leading-relaxed">
                  {currentQuestion}
                </p>
              </div>
            </div>
          </div>
          
          {/* Spectator Chat Panel */}
          <div className="w-96 flex flex-col glass">
            <div className="border-b-2 border-primary/20 px-6 py-4 font-bold text-lg flex items-center gap-2 bg-gradient-to-r from-primary/10 to-transparent">
              <MessageCircle className="w-5 h-5 text-primary" />
              Chat Spectateurs
            </div>
            <div className="flex-1 p-5 overflow-auto space-y-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-sm animate-page-enter">
                  <div className="font-bold text-xs text-muted-foreground mb-2 flex items-center gap-2">
                    <Eye className="w-3 h-3" />
                    {msg.sender}
                  </div>
                  <div className={`rounded-xl p-4 transition-all ${
                    msg.sender === "Système"
                      ? "glass border border-primary/30 text-primary font-medium"
                      : "glass border border-border/30"
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-primary/20 p-5 glass">
              <div className="text-center text-sm text-muted-foreground font-medium">
                💬 Chat spectateurs désactivé en mode anonyme
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
