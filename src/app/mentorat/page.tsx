"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import { Award, Clock, MessageSquare, Code, Star, Trophy, Play } from "lucide-react"

const mentorsOfMonth = [
  { name: "Alexandre Martin", domain: "Développement", sessions: 47, rating: 4.9, avatar: "A", color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)]" },
  { name: "Sophie Chen", domain: "Cybersécurité", sessions: 38, rating: 4.8, avatar: "S", color: "from-[oklch(0.58_0.24_20)] to-[oklch(0.55_0.25_240)]" },
  { name: "Thomas Dubois", domain: "IA/ML", sessions: 42, rating: 4.9, avatar: "T", color: "from-[oklch(0.6_0.25_290)] to-[oklch(0.75_0.22_150)]" }
]

const recentSessions = [
  {
    id: 1,
    date: "2024-11-03",
    time: "14:30",
    duration: "1h 15min",
    domain: "React Hooks",
    participants: ["Vous", "Marie_Dev"],
    messages: [
      { user: "Marie_Dev", content: "Peux-tu m'expliquer useEffect ?", time: "14:30" },
      { user: "Vous", content: "Bien sûr ! useEffect permet de gérer les effets de bord...", time: "14:32" },
      { user: "Marie_Dev", content: "Je comprends mieux maintenant, merci !", time: "14:45" }
    ],
    codeSnippets: [
      { language: "javascript", code: "useEffect(() => {\n  // Effect logic\n}, [dependencies])" }
    ],
    actions: ["Explication useEffect", "Exemple code", "Questions réponses"]
  },
  {
    id: 2,
    date: "2024-11-02",
    time: "10:00",
    duration: "45min",
    domain: "Algorithmes",
    participants: ["Vous", "Paul_Code"],
    messages: [
      { user: "Paul_Code", content: "Comment optimiser cet algorithme ?", time: "10:00" },
      { user: "Vous", content: "Utilisons une HashMap pour améliorer la complexité", time: "10:05" }
    ],
    codeSnippets: [
      { language: "python", code: "def optimize(arr):\n    cache = {}\n    # Optimized logic" }
    ],
    actions: ["Analyse complexité", "Refactoring", "Tests unitaires"]
  }
]

export default function Mentorat() {
  const [selectedSession, setSelectedSession] = useState<typeof recentSessions[0] | null>(null)

  return (
    <div className="min-h-screen animate-page-enter">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">ENGAGEMENT_MENTORAT</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight header-glow">
            <span className="bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
              Engagement & Mentorat
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Reconnaissance, suivi d'activité et historique de vos sessions
          </p>
        </div>

        {/* Mentors of the Month */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-[oklch(0.75_0.22_150)]" />
            <h2 className="text-3xl font-bold tracking-tight">Mentors du mois</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mentorsOfMonth.map((mentor, i) => (
              <div key={i} className="glass rounded-2xl p-6 cyber-frame card-hover">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${mentor.color} flex items-center justify-center text-white text-2xl font-bold`}>
                    {mentor.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg">{mentor.name}</div>
                    <div className="text-sm text-muted-foreground">{mentor.domain}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="glass rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{mentor.sessions}</div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                  <div className="glass rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-[oklch(0.75_0.22_150)] flex items-center justify-center gap-1">
                      {mentor.rating} <Star className="w-4 h-4 fill-current" />
                    </div>
                    <div className="text-xs text-muted-foreground">Note</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Badge "Expert pédagogue"</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">Feedback positif : 98%</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-all">
                  Demander une session
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Session Replays */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Replay de vos sessions</h2>
          </div>
          
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="glass rounded-xl p-6 cyber-frame hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{session.domain}</h3>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {session.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.date} à {session.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {session.messages.length} messages
                      </span>
                      <span className="flex items-center gap-1">
                        <Code className="w-4 h-4" />
                        {session.codeSnippets.length} snippets
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedSession(session)}
                    className="px-4 py-2 bg-primary text-white rounded-lg btn-hover flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Voir le replay
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  {session.participants.map((p, i) => (
                    <div key={i} className="px-3 py-1 bg-background rounded-full text-sm">
                      {p}
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {session.actions.map((action, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-primary/5 text-primary rounded border border-primary/20">
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Replay Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSelectedSession(null)}>
            <div className="glass rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden cyber-frame" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedSession.domain}</h2>
                    <p className="text-muted-foreground">{selectedSession.date} • {selectedSession.duration}</p>
                  </div>
                  <button onClick={() => setSelectedSession(null)} className="text-muted-foreground hover:text-foreground">
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
                {/* Messages Timeline */}
                <div className="mb-8">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Historique des messages
                  </h3>
                  <div className="space-y-4">
                    {selectedSession.messages.map((msg, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {msg.user[0]}
                        </div>
                        <div className="flex-1 glass rounded-lg p-3">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-semibold text-sm">{msg.user}</span>
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                          </div>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Code Snippets */}
                <div>
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    Extraits de code
                  </h3>
                  {selectedSession.codeSnippets.map((snippet, i) => (
                    <div key={i} className="glass rounded-lg p-4 mb-4">
                      <div className="text-xs text-muted-foreground mb-2 font-mono">{snippet.language}</div>
                      <pre className="bg-[oklch(0.15_0.02_240)] text-[oklch(0.85_0.05_150)] p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm font-mono">{snippet.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
