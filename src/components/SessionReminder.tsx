"use client"

import { useState, useEffect } from "react"
import { Bell, X, Calendar, Clock, Video, Handshake } from "lucide-react"

interface Session {
  id: number
  type: "presentiel" | "distanciel"
  title: string
  time: string
  date: string
  location?: string
}

export default function SessionReminder() {
  const [reminders, setReminders] = useState<Session[]>([])
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())

  useEffect(() => {
    // Charger les sessions programmées (mock data)
    const upcomingSessions: Session[] = [
      {
        id: 1,
        type: "distanciel",
        title: "1v1 Développement Web",
        time: "14:30",
        date: "2025-11-04",
        location: undefined
      },
      {
        id: 2,
        type: "presentiel",
        title: "Session Cybersécurité",
        time: "16:00",
        date: "2025-11-04",
        location: "Médiathèque Centre-Ville"
      }
    ]

    // Vérifier les sessions dans les prochaines heures
    const now = new Date()
    const upcoming = upcomingSessions.filter(session => {
      const sessionDate = new Date(`${session.date} ${session.time}`)
      const timeDiff = sessionDate.getTime() - now.getTime()
      const hoursDiff = timeDiff / (1000 * 60 * 60)
      
      // Notifier si la session est dans moins de 2 heures
      return hoursDiff > 0 && hoursDiff <= 2 && !dismissed.has(session.id)
    })

    setReminders(upcoming)
  }, [dismissed])

  const handleDismiss = (id: number) => {
    setDismissed(prev => new Set(prev).add(id))
  }

  if (reminders.length === 0) return null

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 max-w-sm animate-page-enter">
      {reminders.map((session) => (
        <div
          key={session.id}
          className="glass rounded-xl p-5 border-2 border-primary/30 shadow-2xl backdrop-blur-xl cyber-frame animate-[fadeInSlide_0.3s_ease-out]"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] flex items-center justify-center flex-shrink-0 glow-subtle">
              {session.type === "distanciel" ? (
                <Video className="w-6 h-6 text-white" />
              ) : (
                <Handshake className="w-6 h-6 text-white" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-xs font-bold text-primary uppercase">Rappel de session</span>
              </div>
              
              <h3 className="font-bold text-base mb-2">{session.title}</h3>
              
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(session.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{session.time}</span>
                </div>
                {session.location && (
                  <div className="flex items-center gap-2">
                    <Handshake className="w-4 h-4" />
                    <span>{session.location}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-lg text-sm font-semibold btn-hover">
                  Voir les détails
                </button>
                <button
                  onClick={() => handleDismiss(session.id)}
                  className="px-3 py-2 glass border border-border rounded-lg hover:bg-destructive/10 transition-all"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
