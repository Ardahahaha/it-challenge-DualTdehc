"use client"

import Navigation from "@/components/Navigation"
import { useState, useEffect, useRef } from "react"
import { MessageSquare, Zap, Clock, Trophy, Send, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { useRouter } from "next/navigation"

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error"
type Message = { id: number; sender: "user" | "opponent"; text: string; time: string }

export default function RealtimeOnePage() {
  const router = useRouter()
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting")
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [timer, setTimer] = useState(300) // 5 minutes
  const [points, setPoints] = useState(0)
  const [opponentPoints, setOpponentPoints] = useState(0)
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate connection
    const connectTimeout = setTimeout(() => {
      const success = Math.random() > 0.2 // 80% success rate
      if (success) {
        setConnectionStatus("connected")
        setQuestion("Écrivez une fonction JavaScript qui inverse une chaîne de caractères sans utiliser .reverse()")
        
        // Simulate opponent messages
        setTimeout(() => {
          addOpponentMessage("Salut ! Prêt pour le défi ?")
        }, 2000)
        
        setTimeout(() => {
          addOpponentMessage("C'est parti ! 💪")
        }, 4000)
      } else {
        setConnectionStatus("error")
      }
    }, 2000)

    return () => clearTimeout(connectTimeout)
  }, [])

  useEffect(() => {
    // Timer countdown
    if (connectionStatus === "connected" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [connectionStatus, timer])

  useEffect(() => {
    // Simulate opponent progress
    if (connectionStatus === "connected") {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          setOpponentPoints((prev) => prev + 10)
        }
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [connectionStatus])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addOpponentMessage = (text: string) => {
    const now = new Date()
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`
    setMessages((prev) => [...prev, { id: Date.now(), sender: "opponent", text, time }])
  }

  const handleSendMessage = () => {
    if (!messageInput.trim() || loading) return
    
    const now = new Date()
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`
    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: messageInput, time }])
    setMessageInput("")

    // Simulate opponent reply
    setTimeout(() => {
      const replies = ["Bonne idée !", "Intéressant 🤔", "Je vois ce que tu fais", "Pas mal !"]
      addOpponentMessage(replies[Math.floor(Math.random() * replies.length)])
    }, 1000 + Math.random() * 2000)
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || loading) return
    
    setLoading(true)
    // Simulate answer validation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const isCorrect = answer.toLowerCase().includes("function") && answer.toLowerCase().includes("split")
    if (isCorrect) {
      setPoints((prev) => prev + 100)
      setQuestion("Excellente réponse ! Prochaine question : Implémentez une fonction qui vérifie si un nombre est premier.")
      setAnswer("")
    } else {
      setPoints((prev) => prev + 10)
    }
    setLoading(false)
  }

  const handleRetry = () => {
    setConnectionStatus("connecting")
    setTimeout(() => {
      setConnectionStatus("connected")
      setQuestion("Écrivez une fonction JavaScript qui inverse une chaîne de caractères sans utiliser .reverse()")
    }, 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-[oklch(0.75_0.22_150)]"
      case "connecting":
        return "bg-[oklch(0.65_0.2_200)]"
      case "disconnected":
      case "error":
        return "bg-destructive"
    }
  }

  const getStatusIcon = () => {
    if (connectionStatus === "connected") return <Wifi className="w-4 h-4" />
    if (connectionStatus === "error" || connectionStatus === "disconnected") return <WifiOff className="w-4 h-4" />
    return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connecté"
      case "connecting":
        return "Connexion..."
      case "disconnected":
        return "Déconnecté"
      case "error":
        return "Erreur de connexion"
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-6 py-6 animate-page-enter">
        {/* Session Status Bar */}
        <div className={`glass rounded-xl p-4 mb-6 ${getStatusColor()} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <span className="font-bold">{getStatusText()}</span>
          </div>
          {connectionStatus === "connected" && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">{formatTime(timer)}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  Vous: <span className="font-bold">{points}</span>
                </div>
                <div className="text-sm">
                  Adversaire: <span className="font-bold">{opponentPoints}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {connectionStatus === "error" ? (
          <div className="glass rounded-2xl p-12 text-center cyber-frame">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Erreur de connexion</h2>
            <p className="text-muted-foreground mb-6">
              Impossible de se connecter au serveur. Vérifiez votre connexion internet.
            </p>
            <button
              onClick={handleRetry}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold btn-hover glow-subtle flex items-center gap-2 mx-auto"
            >
              <Zap className="w-5 h-5" />
              Réessayer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)]">
            {/* Left: Chat Simulation */}
            <div className="glass rounded-2xl p-6 flex flex-col cyber-frame">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <MessageSquare className="w-6 h-6 text-primary animate-pulse" />
                <h2 className="text-xl font-bold">Chat en direct</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                {connectionStatus === "connecting" ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-muted-foreground">Connexion en cours...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Aucun message pour le moment</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-xl p-3 ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/70" : "text-muted-foreground"}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex gap-2 pt-4 border-t border-border">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Écrivez un message..."
                  disabled={connectionStatus !== "connected"}
                  className="flex-1 px-4 py-3 glass rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={connectionStatus !== "connected" || !messageInput.trim()}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold btn-hover glow-subtle flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right: Challenge Panel */}
            <div className="glass rounded-2xl p-6 flex flex-col cyber-frame">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <Trophy className="w-6 h-6 text-[oklch(0.75_0.22_150)] animate-pulse" />
                <h2 className="text-xl font-bold">Défi</h2>
              </div>
              
              {connectionStatus === "connecting" ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-muted-foreground">Chargement du défi...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto mb-4">
                    <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-6 mb-6">
                      <h3 className="font-bold text-lg mb-3">Question</h3>
                      <p className="leading-relaxed">{question}</p>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-semibold mb-2">Votre réponse</label>
                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Écrivez votre code ici..."
                        disabled={loading}
                        className="w-full h-48 px-4 py-3 glass rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm resize-none disabled:opacity-50"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="glass rounded-xl p-4">
                        <div className="text-xs text-muted-foreground mb-1">Vos points</div>
                        <div className="text-3xl font-bold text-primary">{points}</div>
                      </div>
                      <div className="glass rounded-xl p-4">
                        <div className="text-xs text-muted-foreground mb-1">Adversaire</div>
                        <div className="text-3xl font-bold text-[oklch(0.65_0.2_200)]">{opponentPoints}</div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={loading || !answer.trim()}
                    className="w-full px-6 py-4 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Vérification...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Soumettre la réponse
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
