"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import { Calendar, Users, Mic, Code2, Shield, Brain, Trophy, Flag, Bug, Lightbulb, Clock, MapPin } from "lucide-react"

const clubs = [
  {
    id: "dev-club",
    name: "Dev Club",
    domain: "Développement",
    icon: Code2,
    color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)]",
    members: 342,
    description: "Web, mobile, architecture - discussions et projets collaboratifs",
    voiceChannels: ["Général", "Frontend", "Backend", "Mobile"],
    nextMeeting: "Mercredi 20:00 - Patterns de design"
  },
  {
    id: "cyber-club",
    name: "Cyber Club",
    domain: "Cybersécurité",
    icon: Shield,
    color: "from-[oklch(0.58_0.24_20)] to-[oklch(0.55_0.25_240)]",
    members: 218,
    description: "Pentest, forensics, CTF - apprenez la sécurité offensive et défensive",
    voiceChannels: ["Général", "CTF", "Bug Bounty", "Forensics"],
    nextMeeting: "Vendredi 18:00 - CTF Training"
  },
  {
    id: "ia-club",
    name: "IA Lab",
    domain: "Intelligence Artificielle",
    icon: Brain,
    color: "from-[oklch(0.6_0.25_290)] to-[oklch(0.75_0.22_150)]",
    members: 289,
    description: "ML, deep learning, NLP - explorez les dernières technologies IA",
    voiceChannels: ["Général", "ML", "NLP", "Computer Vision"],
    nextMeeting: "Jeudi 19:00 - Transformers expliqués"
  }
]

const weeklyEvents = [
  {
    id: "ctf-friday",
    name: "CTF Friday",
    icon: Flag,
    color: "from-[oklch(0.58_0.24_20)] to-[oklch(0.55_0.25_240)]",
    day: "Vendredi",
    time: "18:00 - 22:00",
    description: "Capture The Flag - Défis de sécurité en équipe",
    difficulty: "Tous niveaux",
    participants: 45,
    type: "Compétition"
  },
  {
    id: "bug-monday",
    name: "Bug Monday",
    icon: Bug,
    color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)]",
    day: "Lundi",
    time: "19:00 - 21:00",
    description: "Debugging collaboratif - Résolvez des bugs réels ensemble",
    difficulty: "Intermédiaire",
    participants: 38,
    type: "Atelier"
  },
  {
    id: "ai-lab",
    name: "AI Lab",
    icon: Lightbulb,
    color: "from-[oklch(0.6_0.25_290)] to-[oklch(0.75_0.22_150)]",
    day: "Jeudi",
    time: "19:00 - 21:00",
    description: "Expérimentations IA - Projets et découvertes ML/DL",
    difficulty: "Tous niveaux",
    participants: 52,
    type: "Lab"
  }
]

const botSuggestions = [
  { level: "Débutant", topics: ["HTML/CSS Basics", "JavaScript Introduction", "Git Fundamentals"] },
  { level: "Intermédiaire", topics: ["React Hooks", "API REST", "Database Design"] },
  { level: "Avancé", topics: ["Microservices Architecture", "WebAssembly", "System Design"] }
]

export default function Evenements() {
  const [selectedClub, setSelectedClub] = useState<typeof clubs[0] | null>(null)
  const [userLevel] = useState("Intermédiaire")
  const [joinedClubs, setJoinedClubs] = useState<string[]>([])

  const toggleJoinClub = (clubId: string) => {
    setJoinedClubs(prev => 
      prev.includes(clubId) 
        ? prev.filter(id => id !== clubId)
        : [...prev, clubId]
    )
  }

  const suggestions = botSuggestions.find(s => s.level === userLevel)?.topics || []

  return (
    <div className="min-h-screen animate-page-enter">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">COMMUNAUTE_EVENEMENTS</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight header-glow">
            <span className="bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
              Communauté & Événements
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Rejoignez des clubs, participez aux événements hebdomadaires
          </p>
        </div>

        {/* Weekly Events */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">Événements hebdomadaires</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {weeklyEvents.map((event) => {
              const Icon = event.icon
              return (
                <div key={event.id} className="glass rounded-2xl p-6 cyber-frame card-hover">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {event.day} {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {event.participants} participants
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                        {event.type}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 text-sm">{event.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-muted-foreground">Difficulté: {event.difficulty}</span>
                  </div>
                  
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-lg font-semibold btn-hover glow-subtle">
                    S'inscrire
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Thematic Clubs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">Clubs thématiques</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {clubs.map((club) => {
              const Icon = club.icon
              const isJoined = joinedClubs.includes(club.id)
              
              return (
                <div key={club.id} className="glass rounded-2xl p-6 cyber-frame">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${club.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{club.name}</h3>
                      <p className="text-sm text-muted-foreground">{club.domain}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{club.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{club.members} membres</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-semibold mb-2">Prochain rendez-vous</div>
                    <div className="glass rounded-lg p-3 text-sm">
                      <MapPin className="w-4 h-4 text-primary inline mr-2" />
                      {club.nextMeeting}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-primary" />
                      Salons vocaux (placeholder)
                    </div>
                    <div className="space-y-1">
                      {club.voiceChannels.map((channel, i) => (
                        <div key={i} className="text-xs px-3 py-2 bg-background rounded hover:bg-primary/5 transition-all cursor-pointer">
                          🔊 {channel}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleJoinClub(club.id)}
                    className={`w-full px-4 py-3 rounded-lg font-semibold btn-hover transition-all ${
                      isJoined
                        ? 'bg-border text-foreground'
                        : `bg-gradient-to-r ${club.color} text-white glow-subtle`
                    }`}
                  >
                    {isJoined ? 'Quitter' : 'Rejoindre'}
                  </button>
                  
                  <button
                    onClick={() => setSelectedClub(club)}
                    className="w-full mt-2 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-all"
                  >
                    Voir les détails
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bot Suggestions */}
        <div className="glass rounded-2xl p-8 cyber-frame">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.6_0.25_290)] to-[oklch(0.75_0.22_150)] flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Bot de suggestions</h2>
              <p className="text-sm text-muted-foreground">Sujets recommandés pour votre niveau: {userLevel}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestions.map((topic, i) => (
              <div key={i} className="glass rounded-lg p-4 hover:bg-primary/5 transition-all cursor-pointer">
                <div className="font-semibold mb-2">{topic}</div>
                <div className="text-xs text-muted-foreground mb-3">Recommandé pour vous</div>
                <button className="w-full px-3 py-2 bg-primary/10 text-primary text-sm rounded hover:bg-primary/20 transition-all">
                  Explorer
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Club Details Modal */}
        {selectedClub && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSelectedClub(null)}>
            <div className="glass rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto cyber-frame" onClick={(e) => e.stopPropagation()}>
              <div className={`bg-gradient-to-r ${selectedClub.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <selectedClub.icon className="w-12 h-12" />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedClub.name}</h2>
                      <p className="text-white/80">{selectedClub.members} membres</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedClub(null)} className="text-white/80 hover:text-white">
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-bold mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedClub.description}</p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">Prochain événement</h3>
                  <div className="glass rounded-lg p-4">
                    <MapPin className="w-4 h-4 text-primary inline mr-2" />
                    {selectedClub.nextMeeting}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">Salons vocaux disponibles</h3>
                  <div className="space-y-2">
                    {selectedClub.voiceChannels.map((channel, i) => (
                      <div key={i} className="glass rounded-lg p-3 flex items-center justify-between">
                        <span>🔊 {channel}</span>
                        <button className="px-3 py-1 bg-primary/10 text-primary text-sm rounded hover:bg-primary/20 transition-all">
                          Rejoindre
                        </button>
                      </div>
                    ))}
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
