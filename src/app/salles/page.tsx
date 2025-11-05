"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import { Code2, Shield, Brain, Network, MessageSquare, BookOpen, Zap, Users, Send, X } from "lucide-react"

type Room = {
  id: string
  name: string
  icon: typeof Code2
  color: string
  description: string
  members: number
  resources: { title: string; type: string }[]
}

const rooms: Room[] = [
  {
    id: "dev",
    name: "Développement",
    icon: Code2,
    color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)]",
    description: "Web, mobile, logiciel - Langages, frameworks, architecture",
    members: 342,
    resources: [
      { title: "Clean Code Principles", type: "Article" },
      { title: "React Best Practices", type: "Guide" },
      { title: "API Design Patterns", type: "Tutorial" }
    ]
  },
  {
    id: "cyber",
    name: "Cybersécurité",
    icon: Shield,
    color: "from-[oklch(0.58_0.24_20)] to-[oklch(0.55_0.25_240)]",
    description: "Pentest, forensics, sécurité applicative et réseau",
    members: 218,
    resources: [
      { title: "OWASP Top 10", type: "Article" },
      { title: "CTF Writeups", type: "Guide" },
      { title: "Network Security", type: "Tutorial" }
    ]
  },
  {
    id: "ia",
    name: "IA / Machine Learning",
    icon: Brain,
    color: "from-[oklch(0.6_0.25_290)] to-[oklch(0.75_0.22_150)]",
    description: "Deep learning, NLP, computer vision, modèles génératifs",
    members: 289,
    resources: [
      { title: "Neural Networks Intro", type: "Article" },
      { title: "PyTorch Guide", type: "Guide" },
      { title: "ML Algorithms", type: "Tutorial" }
    ]
  },
  {
    id: "reseau",
    name: "Réseau",
    icon: Network,
    color: "from-[oklch(0.65_0.2_200)] to-[oklch(0.75_0.22_150)]",
    description: "Protocoles, infrastructure, cloud, DevOps",
    members: 195,
    resources: [
      { title: "TCP/IP Explained", type: "Article" },
      { title: "Docker & Kubernetes", type: "Guide" },
      { title: "AWS Basics", type: "Tutorial" }
    ]
  }
]

export default function SallesThematiques() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<{ user: string; message: string; time: string }[]>([
    { user: "AlexDev", message: "Quelqu'un pour un 1v1 sur les algorithmes ?", time: "14:23" },
    { user: "Sophie_ML", message: "Je suis disponible ! Niveau intermédiaire ?", time: "14:24" },
    { user: "TechMaster", message: "Je peux arbitrer si besoin", time: "14:25" }
  ])

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    setChatMessages([...chatMessages, {
      user: "Vous",
      message: chatMessage,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    }])
    setChatMessage("")
  }

  return (
    <div className="min-h-screen animate-page-enter">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">SALLES_THEMATIQUES</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight header-glow">
            <span className="bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
              Salles thématiques permanentes
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Rejoignez des espaces dédiés par domaine - échangez, apprenez, défiez
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {rooms.map((room) => {
            const Icon = room.icon
            return (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className="glass rounded-2xl p-8 cursor-pointer card-hover cyber-frame group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${room.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-[oklch(0.75_0.22_150)] animate-pulse"></div>
                    <span className="font-mono">{room.members} membres</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2 tracking-tight">{room.name}</h3>
                <p className="text-muted-foreground mb-6">{room.description}</p>
                
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Accéder au chat
                  </button>
                  <button className="px-4 py-2.5 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-lg font-medium btn-hover glow-subtle flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    1v1
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Room Detail Modal */}
        {selectedRoom && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSelectedRoom(null)}>
            <div className="glass rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden cyber-frame" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className={`bg-gradient-to-r ${selectedRoom.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                        <selectedRoom.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedRoom.name}</h2>
                        <p className="text-white/80 text-sm">{selectedRoom.members} membres actifs</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedRoom(null)} className="p-2 hover:bg-white/20 rounded-lg transition-all">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Chat Section */}
                  <div className="lg:col-span-2">
                    <div className="glass rounded-xl p-4 h-[400px] flex flex-col">
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/50">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Chat de la salle</h3>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {msg.user[0]}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-baseline gap-2">
                                <span className="font-semibold text-sm">{msg.user}</span>
                                <span className="text-xs text-muted-foreground">{msg.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{msg.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          placeholder="Écrire un message..."
                          className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button
                          onClick={handleSendMessage}
                          className="px-4 py-2.5 bg-primary text-white rounded-lg btn-hover flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Resources & Actions */}
                  <div className="space-y-6">
                    {/* Quick 1v1 */}
                    <div className="glass rounded-xl p-4">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        Rejoindre un 1v1
                      </h3>
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-lg font-semibold btn-hover glow-subtle">
                        Lancer un 1v1
                      </button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Matchmaking automatique par niveau
                      </p>
                    </div>

                    {/* Resources */}
                    <div className="glass rounded-xl p-4">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Ressources
                      </h3>
                      <div className="space-y-2">
                        {selectedRoom.resources.map((resource, i) => (
                          <div key={i} className="p-3 bg-background rounded-lg hover:bg-primary/5 transition-all cursor-pointer">
                            <div className="font-medium text-sm">{resource.title}</div>
                            <div className="text-xs text-muted-foreground">{resource.type}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
