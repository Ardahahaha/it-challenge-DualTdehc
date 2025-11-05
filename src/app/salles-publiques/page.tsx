"use client"

import Navigation from "@/components/Navigation"
import { useRouter } from "next/navigation"
import { Coffee, Users, MessageCircle, Zap, Code2, Shield, Brain, Network, Sparkles, User, Crown, Star } from "lucide-react"
import { useState } from "react"

interface Room {
  id: string
  name: string
  theme: string
  icon: any
  description: string
  activeUsers: number
  color: string
  users: { name: string; status: string; level: string }[]
}

export default function SallesPubliquesPage() {
  const router = useRouter()
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    { user: "DevMaster", message: "Qui veut un défi JavaScript ?", timestamp: "Il y a 2 min", room: "dev" },
    { user: "CyberNinja", message: "Challenge cryptographie dispo !", timestamp: "Il y a 5 min", room: "cyber" },
    { user: "AIEnthusiast", message: "Quelqu'un pour un défi ML ?", timestamp: "Il y a 8 min", room: "ia" }
  ])

  const rooms: Room[] = [
    {
      id: "dev",
      name: "Salle Développement",
      theme: "Code & Algorithmes",
      icon: Code2,
      description: "Discussions sur le code, les algorithmes et les meilleures pratiques",
      activeUsers: 24,
      color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)]",
      users: [
        { name: "DevMaster", status: "En ligne", level: "Expert" },
        { name: "CodeNinja", status: "En ligne", level: "Intermédiaire" },
        { name: "WebWizard", status: "En ligne", level: "Avancé" }
      ]
    },
    {
      id: "cyber",
      name: "Salle Cybersécurité",
      theme: "Hacking & Sécurité",
      icon: Shield,
      description: "Pentesting, cryptographie et défense informatique",
      activeUsers: 18,
      color: "from-[oklch(0.65_0.2_40)] to-[oklch(0.55_0.25_240)]",
      users: [
        { name: "CyberNinja", status: "En ligne", level: "Expert" },
        { name: "HackMaster", status: "En ligne", level: "Avancé" },
        { name: "SecPro", status: "Occupé", level: "Expert" }
      ]
    },
    {
      id: "ia",
      name: "Salle Intelligence Artificielle",
      theme: "ML & Deep Learning",
      icon: Brain,
      description: "Machine learning, réseaux de neurones et IA générative",
      activeUsers: 15,
      color: "from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)]",
      users: [
        { name: "AIEnthusiast", status: "En ligne", level: "Avancé" },
        { name: "MLPro", status: "En ligne", level: "Expert" },
        { name: "DataScientist", status: "En ligne", level: "Intermédiaire" }
      ]
    },
    {
      id: "network",
      name: "Salle Réseau",
      theme: "Protocoles & Infrastructure",
      icon: Network,
      description: "TCP/IP, DNS, routage et architecture réseau",
      activeUsers: 12,
      color: "from-[oklch(0.6_0.25_290)] to-[oklch(0.75_0.22_150)]",
      users: [
        { name: "NetAdmin", status: "En ligne", level: "Expert" },
        { name: "CloudGuru", status: "En ligne", level: "Avancé" }
      ]
    }
  ]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && selectedRoom) {
      setMessages([
        { user: "Vous", message: message, timestamp: "À l'instant", room: selectedRoom },
        ...messages
      ])
      setMessage("")
    }
  }

  const handleStartDuel = () => {
    router.push("/realtime-1v1")
  }

  const selectedRoomData = rooms.find(r => r.id === selectedRoom)

  return (
    <div className="min-h-screen animate-page-enter">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Coffee className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">VIRTUAL_CAFÉ</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight header-glow">
            Salles Publiques
          </h1>
          <p className="text-xl text-muted-foreground">
            Rejoignez des développeurs, discutez et lancez des défis en temps réel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rooms List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Salles actives
            </h2>
            
            {rooms.map((room) => {
              const Icon = room.icon
              const isSelected = selectedRoom === room.id
              
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`glass rounded-xl p-6 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-2 border-primary scale-105' 
                      : 'border border-border/30 hover:border-primary/50'
                  } card-hover cyber-frame`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${room.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1">{room.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{room.theme}</p>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">{room.activeUsers} en ligne</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Quick Stats */}
            <div className="glass rounded-xl p-6 border border-primary/30 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-bold">Statistiques du café</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total utilisateurs</span>
                  <span className="font-bold">69</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Défis en cours</span>
                  <span className="font-bold text-[oklch(0.75_0.22_150)]">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Matchs aujourd'hui</span>
                  <span className="font-bold text-primary">47</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat & Room Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedRoomData ? (
              <>
                {/* Room Header */}
                <div className={`glass rounded-2xl p-8 border-2 border-primary/30 bg-gradient-to-r ${selectedRoomData.color} bg-opacity-5`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{selectedRoomData.name}</h2>
                      <p className="text-muted-foreground">{selectedRoomData.description}</p>
                    </div>
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedRoomData.color} flex items-center justify-center`}>
                      <selectedRoomData.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[oklch(0.75_0.22_150)] animate-pulse"></div>
                    <span className="text-sm font-semibold">{selectedRoomData.activeUsers} développeurs présents</span>
                  </div>
                </div>

                {/* Users Present */}
                <div className="glass rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Utilisateurs présents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedRoomData.users.map((user, index) => (
                      <div key={index} className="flex items-center gap-3 glass rounded-lg p-4 border border-border/30 hover:border-primary/30 transition-all">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[oklch(0.65_0.2_200)] flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{user.name}</span>
                            {user.level === "Expert" && <Crown className="w-4 h-4 text-[oklch(0.65_0.2_40)]" />}
                            {user.level === "Avancé" && <Star className="w-4 h-4 text-primary" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${user.status === "En ligne" ? "bg-[oklch(0.75_0.22_150)]" : "bg-[oklch(0.65_0.2_40)]"}`}></div>
                            <span className="text-xs text-muted-foreground">{user.status} • {user.level}</span>
                          </div>
                        </div>
                        <button
                          onClick={handleStartDuel}
                          className="glass px-3 py-2 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all"
                        >
                          Défier
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat */}
                <div className="glass rounded-xl overflow-hidden border border-primary/20">
                  <div className="bg-gradient-to-r from-primary/10 to-transparent px-6 py-4 border-b border-primary/20">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      Discussion en direct
                    </h3>
                  </div>
                  
                  <div className="p-6 h-64 overflow-auto space-y-4">
                    {messages
                      .filter(msg => msg.room === selectedRoom)
                      .map((msg, index) => (
                        <div key={index} className="animate-page-enter">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-[oklch(0.65_0.2_200)] flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">{msg.user[0]}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm">{msg.user}</span>
                                <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                              </div>
                              <div className={`rounded-xl p-3 ${
                                msg.user === "Vous" 
                                  ? "bg-gradient-to-r from-primary to-[oklch(0.65_0.2_200)] text-white" 
                                  : "glass border border-border/30"
                              }`}>
                                {msg.message}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="border-t border-primary/20 p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tapez votre message..."
                        className="flex-1 glass border-2 border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary input-focus"
                      />
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-primary to-[oklch(0.65_0.2_200)] text-white px-6 py-3 rounded-xl font-bold btn-hover glow-subtle flex items-center gap-2"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Envoyer
                      </button>
                    </form>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleStartDuel}
                    className="glass rounded-xl p-6 border-2 border-primary/30 hover:border-primary hover:scale-105 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-[oklch(0.65_0.2_200)] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-lg">Lancer un défi</div>
                        <div className="text-sm text-muted-foreground">Démarrer un 1v1 maintenant</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push("/matchmaking")}
                    className="glass rounded-xl p-6 border-2 border-[oklch(0.75_0.22_150)]/30 hover:border-[oklch(0.75_0.22_150)] hover:scale-105 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-lg">Matchmaking</div>
                        <div className="text-sm text-muted-foreground">Trouver un partenaire</div>
                      </div>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="glass rounded-2xl p-12 text-center border-2 border-dashed border-primary/30">
                <Coffee className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Sélectionnez une salle</h3>
                <p className="text-muted-foreground">
                  Choisissez une salle thématique pour commencer à discuter et lancer des défis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
