"use client"

import Navigation from "@/components/Navigation"
import { useState, useEffect } from "react"
import { MapPin, Calendar, Clock, Users, Handshake, Shield, Coffee, Laptop, BookOpen, Wifi, Plus, Check, Loader2, X, Target } from "lucide-react"

interface IRLSession {
  id: number
  type: string
  domain: string
  location: string | null
  date: string
  time: string
  duration: string
  level: string
  objective: string
  timezone: string | null
  videoLink: string | null
  status: string
  organizerName: string
  maxParticipants: number
  message: string | null
  createdAt: string
  participant_count: number
  participants?: Array<{
    id: number
    participantName: string
    joinedAt: string
  }>
}

const suggestedPlaces = [
  { name: "Médiathèque municipale", icon: BookOpen, type: "Calme & Gratuit" },
  { name: "Espace coworking", icon: Laptop, type: "Professionnel" },
  { name: "Campus universitaire", icon: Users, type: "Étudiants" },
  { name: "Cybercafé", icon: Wifi, type: "Équipé" },
  { name: "Parc calme avec bancs", icon: Coffee, type: "Extérieur" }
]

const domains = [
  "Développement web/logiciel",
  "Cybersécurité",
  "Développement IA/ML"
]

const levels = ["Débutant", "Intermédiaire", "Avancé"]
const durations = ["30min", "45min", "1h", "1h30", "2h"]

export default function IRLMeetupPage() {
  const [showForm, setShowForm] = useState(false)
  const [sessions, setSessions] = useState<IRLSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [joiningSessionId, setJoiningSessionId] = useState<number | null>(null)
  const [joinedSessions, setJoinedSessions] = useState<Set<number>>(new Set())
  
  const [formData, setFormData] = useState({
    domain: domains[0],
    level: levels[0],
    objective: "",
    location: "",
    date: "",
    time: "",
    duration: durations[2],
    organizerName: "",
    message: ""
  })

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/irl-sessions?type=presentiel')
      
      if (!response.ok) {
        throw new Error('Failed to fetch sessions')
      }
      
      const data = await response.json()
      setSessions(data.filter((s: IRLSession) => s.status === 'upcoming'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.organizerName.trim() || !formData.objective.trim()) {
      setError("Veuillez remplir tous les champs requis")
      return
    }
    
    try {
      setSubmitting(true)
      setError(null)
      
      const response = await fetch('/api/irl-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: "presentiel",
          domain: formData.domain,
          location: formData.location,
          date: formData.date,
          time: formData.time,
          duration: formData.duration,
          level: formData.level,
          objective: formData.objective,
          organizerName: formData.organizerName,
          message: formData.message || null,
          maxParticipants: 4,
          status: "upcoming"
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create session')
      }
      
      await fetchSessions()
      
      setShowForm(false)
      setFormData({
        domain: domains[0],
        level: levels[0],
        objective: "",
        location: "",
        date: "",
        time: "",
        duration: durations[2],
        organizerName: "",
        message: ""
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleJoinSession = async (sessionId: number) => {
    const participantName = prompt("Entrez votre nom pour rejoindre cette session:")
    
    if (!participantName || participantName.trim() === '') {
      return
    }
    
    try {
      setJoiningSessionId(sessionId)
      setError(null)
      
      const response = await fetch(`/api/irl-sessions/${sessionId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantName: participantName.trim()
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to join session')
      }
      
      setJoinedSessions(prev => new Set(prev).add(sessionId))
      await fetchSessions()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setJoiningSessionId(null)
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-6 py-10 animate-page-enter">
        {/* Header */}
        <div className="mb-12 relative">
          <div className="absolute top-0 right-0 text-primary/10 text-8xl font-mono">{"{ }"}</div>
          <div className="flex items-center gap-3 mb-4">
            <Handshake className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">IRL_MEETUPS</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight header-glow bg-gradient-to-r from-[oklch(0.55_0.25_240)] via-[oklch(0.65_0.2_200)] to-[oklch(0.75_0.22_150)] bg-clip-text text-transparent mb-4">
            Planifier un 1v1 en présentiel
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Rencontrez d'autres passionnés d'IT dans la vraie vie pour pratiquer ensemble, échanger et progresser
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 glass rounded-xl p-4 border-2 border-red-500/20 bg-red-50/50 flex items-center gap-3">
            <X className="w-5 h-5 text-red-500" />
            <p className="text-red-700 font-medium">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-5 h-5 text-red-500" />
            </button>
          </div>
        )}

        {/* CTA Button */}
        <div className="mb-12">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-4 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-semibold btn-hover glow-subtle pulse-ring flex items-center gap-3 text-lg"
          >
            <Plus className="w-5 h-5" />
            Planifier une session en présentiel
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="glass rounded-2xl p-8 mb-12 cyber-frame scanline animate-page-enter">
            <h2 className="text-3xl font-bold mb-8 tracking-tight flex items-center gap-3">
              <Calendar className="w-7 h-7 text-primary" />
              Proposer une session en présentiel
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Votre nom <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organizerName}
                    onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                    placeholder="Ex: Marie Dupont"
                    className="w-full px-4 py-3 glass rounded-xl border border-primary/20 input-focus font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Domaine <span className="text-primary">*</span>
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl border border-primary/20 input-focus font-medium"
                  >
                    {domains.map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Niveau <span className="text-primary">*</span>
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl border border-primary/20 input-focus font-medium"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Lieu <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Médiathèque Centre-Ville"
                    className="w-full px-4 py-3 glass rounded-xl border border-primary/20 input-focus font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Date <span className="text-primary">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl border border-primary/20 input-focus font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Heure <span className="text-primary">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl border border-primary/20 input-focus font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Durée <span className="text-primary">*</span>
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl border border-primary/20 input-focus font-medium"
                  >
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  Objectif de la session <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  placeholder="Ex: Apprendre les bases de React et créer sa première application"
                  className="w-full px-4 py-3 glass rounded-xl border border-primary/20 input-focus font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  Message optionnel
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ajoutez des détails sur la session..."
                  rows={4}
                  className="w-full px-4 py-3 glass rounded-xl border border-primary/20 input-focus font-medium resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-semibold btn-hover glow-subtle disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Création...
                    </>
                  ) : (
                    'Créer la session'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                  className="px-8 py-3 glass rounded-xl font-semibold btn-hover border-2 border-primary/20 disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Suggested Places */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-bold tracking-tight header-glow">Lieux suggérés</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {suggestedPlaces.map((place, index) => {
              const Icon = place.icon
              return (
                <div
                  key={index}
                  className="glass rounded-xl p-6 card-hover cyber-frame text-center group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform glow-subtle">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-base mb-2">{place.name}</h3>
                  <span className="text-xs font-mono text-primary">{place.type}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Sessions Calendar */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-bold tracking-tight header-glow">Sessions à venir</h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Aucune session disponible</h3>
              <p className="text-muted-foreground mb-6">Soyez le premier à créer une session IRL !</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-semibold btn-hover glow-subtle"
              >
                Créer une session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => {
                const isJoined = joinedSessions.has(session.id)
                const isFull = session.participant_count >= session.maxParticipants
                const isJoining = joiningSessionId === session.id
                
                return (
                  <div
                    key={session.id}
                    className="glass rounded-2xl p-6 card-hover cyber-frame scanline group relative overflow-hidden"
                  >
                    {isJoined && (
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[oklch(0.75_0.22_150)] flex items-center justify-center glow-subtle">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{session.location}</h3>
                        <p className="text-sm text-muted-foreground font-mono">Par {session.organizerName}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="font-medium line-clamp-1">{session.objective}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium">{new Date(session.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-medium">{session.time} • {session.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="font-medium">{session.participant_count}/{session.maxParticipants} participants</span>
                      </div>
                    </div>

                    {session.message && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {session.message}
                      </p>
                    )}

                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">
                        {session.domain}
                      </span>
                      <span className="px-3 py-1 bg-[oklch(0.65_0.2_200)]/10 text-[oklch(0.65_0.2_200)] rounded-lg text-xs font-bold">
                        {session.level}
                      </span>
                    </div>

                    <button
                      onClick={() => handleJoinSession(session.id)}
                      disabled={isFull || isJoined || isJoining}
                      className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                        isJoined
                          ? 'bg-[oklch(0.75_0.22_150)]/20 text-[oklch(0.75_0.22_150)] cursor-not-allowed'
                          : isFull
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white btn-hover glow-subtle'
                      }`}
                    >
                      {isJoining ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Inscription...
                        </>
                      ) : isJoined ? (
                        'Confirmé ✓'
                      ) : isFull ? (
                        'Complet'
                      ) : (
                        'Rejoindre'
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Safety Section */}
        <div className="glass rounded-2xl p-8 cyber-frame border-2 border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-primary animate-pulse" />
            <h2 className="text-3xl font-bold tracking-tight header-glow">Règles de sécurité</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] flex items-center justify-center flex-shrink-0 text-white font-bold group-hover:scale-110 transition-transform">
                1
              </div>
              <div>
                <h3 className="font-bold mb-2">Lieux publics uniquement</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Choisissez toujours un lieu public fréquenté et bien éclairé (médiathèque, coworking, campus).
                </p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.65_0.2_200)] to-[oklch(0.75_0.22_150)] flex items-center justify-center flex-shrink-0 text-white font-bold group-hover:scale-110 transition-transform">
                2
              </div>
              <div>
                <h3 className="font-bold mb-2">Informez quelqu'un</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Partagez l'heure et le lieu de votre rendez-vous avec un proche ou un ami.
                </p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] flex items-center justify-center flex-shrink-0 text-white font-bold group-hover:scale-110 transition-transform">
                3
              </div>
              <div>
                <h3 className="font-bold mb-2">Horaires diurnes</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Privilégiez les rendez-vous en journée ou en début de soirée dans des espaces ouverts.
                </p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.6_0.25_290)] to-[oklch(0.55_0.25_240)] flex items-center justify-center flex-shrink-0 text-white font-bold group-hover:scale-110 transition-transform">
                4
              </div>
              <div>
                <h3 className="font-bold mb-2">Respect mutuel</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Soyez respectueux, professionnel et bienveillant lors de vos échanges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}