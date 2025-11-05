"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/Navigation"
import { useRouter } from "next/navigation"
import { SessionFeedbackModal } from "@/components/SessionFeedbackModal"
import WebRTCPlaceholder from "@/components/WebRTCPlaceholder"
import { Clock, Zap, Send, Play, CheckCircle2, MessageCircle, Code2, Target, Maximize2, Minimize2, Swords, Eye } from "lucide-react"

export default function RoomPage() {
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState(930) // 15:30 in seconds
  const [yourCode, setYourCode] = useState("// Écrivez votre solution ici...")
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { sender: "Adversaire", message: "Bonne chance !", id: 1 },
    { sender: "Vous", message: "À toi aussi !", id: 2 }
  ])
  const [showFeedback, setShowFeedback] = useState(false)
  const [sessionResult, setSessionResult] = useState<"win" | "loss" | "draw">("win")
  const [score, setScore] = useState(85)
  const [focusMode, setFocusMode] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [hasGhosted, setHasGhosted] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  
  // Challenge state
  const [yourPoints, setYourPoints] = useState(0)
  const [opponentPoints, setOpponentPoints] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState("Quelle est la complexité temporelle de la recherche binaire ?")
  const [answer, setAnswer] = useState("")
  const [questionNumber, setQuestionNumber] = useState(1)
  const [isAnswering, setIsAnswering] = useState(false)

  const questions = [
    "Quelle est la complexité temporelle de la recherche binaire ?",
    "Quel est le principe de l'encapsulation en POO ?",
    "Qu'est-ce qu'une closure en JavaScript ?",
    "Différence entre TCP et UDP ?",
    "Qu'est-ce que le Big O notation ?"
  ]

  const motivationalMessages = [
    "Bienvenue, prêt à progresser ?",
    "Montre tes compétences !",
    "Chaque défi est une opportunité d'apprendre.",
    "Concentre-toi et donne le meilleur de toi-même.",
    "La victoire commence par l'effort."
  ]

  // Intro animation (3 seconds)
  useEffect(() => {
    const introTimer = setTimeout(() => {
      setShowIntro(false)
    }, 3000)
    return () => clearTimeout(introTimer)
  }, [])

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Cooldown timer for ghosting
  useEffect(() => {
    if (cooldownTime > 0) {
      const cooldownTimer = setInterval(() => {
        setCooldownTime((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(cooldownTimer)
    }
  }, [cooldownTime])

  // Simulate opponent answering
  useEffect(() => {
    const opponentInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const pointsGained = Math.floor(Math.random() * 15) + 5
        setOpponentPoints(prev => prev + pointsGained)
        
        setChatMessages(prev => [...prev, {
          sender: "Adversaire",
          message: `+${pointsGained} points !`,
          id: Date.now()
        }])
      }
    }, 15000) // Every 15 seconds

    return () => clearInterval(opponentInterval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatMessage.trim()) {
      setChatMessages([...chatMessages, { 
        sender: "Vous", 
        message: chatMessage, 
        id: Date.now() 
      }])
      setChatMessage("")
      
      // Simulate opponent response
      setTimeout(() => {
        const responses = ["Bien joué !", "Continue comme ça !", "Pas mal !", "Rapide !"]
        setChatMessages(prev => [...prev, { 
          sender: "Adversaire", 
          message: responses[Math.floor(Math.random() * responses.length)], 
          id: Date.now() 
        }])
      }, 2000)
    }
  }

  const handleSubmitAnswer = () => {
    if (!answer.trim() || isAnswering) return
    
    setIsAnswering(true)
    
    // Simulate answer checking (random success)
    setTimeout(() => {
      const isCorrect = Math.random() > 0.3 // 70% chance of correct
      const pointsGained = isCorrect ? Math.floor(Math.random() * 20) + 10 : 0
      
      if (isCorrect) {
        setYourPoints(prev => prev + pointsGained)
        setChatMessages(prev => [...prev, {
          sender: "Système",
          message: `✅ Correct ! +${pointsGained} points`,
          id: Date.now()
        }])
      } else {
        setChatMessages(prev => [...prev, {
          sender: "Système",
          message: "❌ Incorrect, continuez !",
          id: Date.now()
        }])
      }
      
      // Move to next question
      if (questionNumber < questions.length) {
        setQuestionNumber(prev => prev + 1)
        setCurrentQuestion(questions[questionNumber])
      } else {
        setCurrentQuestion(questions[Math.floor(Math.random() * questions.length)])
      }
      
      setAnswer("")
      setIsAnswering(false)
    }, 1000)
  }

  const handleRunCode = () => {
    // Simulate code execution with points
    const pointsGained = Math.floor(Math.random() * 10) + 5
    setYourPoints(prev => prev + pointsGained)
    
    setChatMessages(prev => [...prev, {
      sender: "Système",
      message: `Code exécuté ! +${pointsGained} points`,
      id: Date.now()
    }])
  }

  const handleSubmit = () => {
    // Calculate final scores
    const totalYourPoints = yourPoints + Math.floor(Math.random() * 20)
    const totalOpponentPoints = opponentPoints + Math.floor(Math.random() * 20)
    
    let result: "win" | "loss" | "draw"
    if (totalYourPoints > totalOpponentPoints) {
      result = "win"
    } else if (totalYourPoints < totalOpponentPoints) {
      result = "loss"
    } else {
      result = "draw"
    }
    
    setSessionResult(result)
    setScore(totalYourPoints)
    setShowFeedback(true)
  }

  const handleLeaveRoom = () => {
    // Simulate ghosting penalty
    if (timeRemaining > 60 && !hasGhosted) {
      setHasGhosted(true)
      setCooldownTime(300) // 5 minutes cooldown
    }
    router.push('/dashboard')
  }

  const handleCloseFeedback = () => {
    setShowFeedback(false)
    router.push('/dashboard')
  }

  // Intro Animation Overlay
  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[oklch(0.55_0.25_240)] via-[oklch(0.65_0.2_200)] to-[oklch(0.75_0.22_150)] flex items-center justify-center z-50 animate-[fadeIn_0.3s_ease-out]">
        <div className="text-center animate-[fadeInSlide_0.6s_cubic-bezier(0.16,1,0.3,1)]">
          <div className="mb-8">
            <Swords className="w-24 h-24 text-white mx-auto animate-pulse" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            {motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]}
          </h1>
          <p className="text-2xl text-white/80 mb-8">Le défi commence...</p>
          <div className="flex gap-2 justify-center">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col animate-page-enter">
      <Navigation />
      
      {/* Anti-ghosting cooldown warning */}
      {cooldownTime > 0 && (
        <div className="bg-destructive text-white px-6 py-3 text-center font-bold">
          ⚠️ Pénalité d'abandon : Cooldown de {formatTime(cooldownTime)} avant le prochain défi
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        {/* Room Header with Timer and Points */}
        <div className="border-b-2 border-primary/20 glass backdrop-blur-xl">
          <div className="container mx-auto px-6 py-5">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-xs font-mono text-primary tech-bracket">ROOM_#001</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Salle de défi 1v1</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]}
                </p>
              </div>
              
              {/* Points Counter */}
              <div className="flex items-center gap-6">
                {/* Observer Mode Link */}
                <a
                  href="/observer/1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 glass border border-primary/20 rounded-lg font-semibold hover:border-primary/40 transition-all flex items-center gap-2 text-sm"
                  title="Partager en mode observateur"
                >
                  <Eye className="w-4 h-4" />
                  Mode Observateur
                </a>

                {/* Focus Mode Toggle */}
                <button
                  onClick={() => setFocusMode(!focusMode)}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all btn-hover flex items-center gap-2 ${
                    focusMode 
                      ? 'bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] text-white' 
                      : 'glass border-2 border-primary/20'
                  }`}
                  title="Mode Focus : concentrez-vous uniquement sur le problème"
                >
                  {focusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  {focusMode ? 'Quitter Focus' : 'Mode Focus'}
                </button>

                <div className="flex items-center gap-4">
                  <div className="text-center glass rounded-xl px-6 py-3 border-2 border-primary/40 glow-subtle">
                    <div className="text-3xl font-bold bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">{yourPoints}</div>
                    <div className="text-xs text-muted-foreground font-semibold mt-1">Vos points</div>
                  </div>
                  <div className="text-muted-foreground font-bold text-2xl">VS</div>
                  <div className="text-center glass rounded-xl px-6 py-3 border border-border/40">
                    <div className="text-3xl font-bold">{opponentPoints}</div>
                    <div className="text-xs text-muted-foreground font-semibold mt-1">Adversaire</div>
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
                
                <button 
                  onClick={handleLeaveRoom}
                  className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive text-white px-6 py-3 rounded-xl font-bold btn-hover"
                >
                  Quitter
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Split Screen - Left Side (Your Code) - Full width in Focus Mode */}
          <div className={`${focusMode ? 'flex-1' : 'flex-1'} ${!focusMode && 'border-r-2 border-primary/20'} flex flex-col glass`}>
            <div className="border-b-2 border-primary/20 bg-gradient-to-r from-primary/10 to-transparent px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="font-bold text-lg flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  {focusMode ? 'Mode Focus - Votre code' : 'Votre code'}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.75_0.22_150)] animate-pulse glow-subtle"></div>
                  <span className="text-sm font-semibold text-[oklch(0.75_0.22_150)]">Connecté</span>
                </div>
              </div>
            </div>
            <textarea
              value={yourCode}
              onChange={(e) => setYourCode(e.target.value)}
              className="flex-1 p-8 bg-gradient-to-br from-primary/5 to-transparent font-mono text-sm overflow-auto resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 border-none"
            />
            <div className="border-t-2 border-primary/20 p-5 flex gap-4 glass">
              <button 
                onClick={handleRunCode}
                className="flex-1 glass border-2 border-primary/30 px-6 py-3.5 rounded-xl font-bold btn-hover hover:border-primary/60 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Exécuter le code
              </button>
              <button 
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white px-6 py-3.5 rounded-xl font-bold btn-hover glow-subtle flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Soumettre
              </button>
            </div>
          </div>
          
          {/* Split Screen - Right Side (Opponent Code) - Hidden in Focus Mode */}
          {!focusMode && (
            <div className="flex-1 flex flex-col glass">
              <div className="border-b-2 border-primary/20 bg-gradient-to-l from-primary/10 to-transparent px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-lg flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" />
                    Code de l'adversaire
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[oklch(0.75_0.22_150)] animate-pulse glow-subtle"></div>
                    <span className="text-sm font-semibold text-[oklch(0.75_0.22_150)]">Connecté</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-8 bg-gradient-to-br from-primary/5 to-transparent font-mono text-sm overflow-auto">
                <div className="text-muted-foreground">// L'adversaire code...</div>
              </div>
              <div className="border-t-2 border-primary/20 p-5 glass">
                <div className="text-sm text-muted-foreground font-medium">
                  Progression de l'adversaire visible après soumission
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom Section - Question & Answer + Chat - Hidden in Focus Mode except Question */}
        <div className={`border-t-2 border-primary/20 ${focusMode ? 'h-auto' : 'h-72'} flex`}>
          {/* Question & Answer Section */}
          <div className={`${focusMode ? 'flex-1' : 'flex-1 border-r-2 border-primary/20'} p-8 overflow-auto glass flex flex-col`}>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-5">
                <h2 className="font-bold text-xl tracking-tight flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary animate-pulse" />
                  Question #{questionNumber}
                </h2>
                <div className="text-xs font-mono bg-gradient-to-r from-primary/20 to-[oklch(0.65_0.2_200)]/20 text-primary px-4 py-2 rounded-lg border border-primary/30">
                  {focusMode ? 'Mode Focus Actif' : 'Challenge en cours'}
                </div>
              </div>
              
              <div className="glass border-2 border-primary/30 rounded-xl p-5 mb-5">
                <p className="text-base font-semibold leading-relaxed">
                  {currentQuestion}
                </p>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-muted-foreground">Votre réponse :</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSubmitAnswer()
                    }
                  }}
                  className="w-full glass border-2 border-primary/20 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-primary input-focus resize-none"
                  placeholder="Tapez votre réponse ici..."
                  rows={3}
                  disabled={isAnswering}
                />
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground font-mono">Ctrl + Entrée pour soumettre</div>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim() || isAnswering}
                    className="bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] text-white px-6 py-3 rounded-xl text-sm font-bold btn-hover glow-subtle disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isAnswering ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Vérification...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Soumettre
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Panel - Hidden in Focus Mode */}
          {!focusMode && (
            <div className="w-96 flex flex-col glass">
              <div className="border-b-2 border-primary/20 px-6 py-4 font-bold text-lg flex items-center gap-2 bg-gradient-to-r from-primary/10 to-transparent">
                <MessageCircle className="w-5 h-5 text-primary" />
                Chat
              </div>
              <div className="flex-1 p-5 overflow-auto space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="text-sm animate-page-enter">
                    <div className="font-bold text-xs text-muted-foreground mb-2">{msg.sender}</div>
                    <div className={`rounded-xl p-4 transition-all ${
                      msg.sender === "Vous" 
                        ? "bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white font-medium" 
                        : msg.sender === "Système"
                        ? "glass border border-primary/30"
                        : "glass border border-border/30"
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-primary/20 p-5">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input 
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 glass border-2 border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary input-focus font-medium"
                    placeholder="Tapez un message..."
                  />
                  <button 
                    type="submit"
                    className="bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white px-5 py-3 rounded-xl text-sm font-bold btn-hover glow-subtle flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <SessionFeedbackModal
        isOpen={showFeedback}
        onClose={handleCloseFeedback}
        result={sessionResult}
        score={score}
        opponentName="Utilisateur5"
      />
    </div>
  )
}