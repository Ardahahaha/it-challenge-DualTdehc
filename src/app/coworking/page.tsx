"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/Navigation"
import { Timer, CheckSquare, Monitor, MapPin, Users, Clock, Coffee, Wifi, Play, Pause, RotateCcw } from "lucide-react"

const publicPlaces = [
  { 
    id: 1, 
    name: "Bibliothèque Municipale Part-Dieu", 
    city: "Lyon", 
    type: "Bibliothèque",
    wifi: true,
    power: true,
    quiet: true,
    hours: "9h-19h",
    distance: "1.2 km"
  },
  { 
    id: 2, 
    name: "Café Cowork Station", 
    city: "Lyon", 
    type: "Café",
    wifi: true,
    power: true,
    quiet: false,
    hours: "8h-22h",
    distance: "0.8 km"
  },
  { 
    id: 3, 
    name: "Campus Numérique", 
    city: "Lyon", 
    type: "Espace coworking",
    wifi: true,
    power: true,
    quiet: true,
    hours: "24/7",
    distance: "2.5 km"
  }
]

const buddies = [
  { name: "Marie_Dev", city: "Lyon", domain: "React / TypeScript", available: "Aujourd'hui 14h-18h", avatar: "M" },
  { name: "Thomas_Code", city: "Lyon", domain: "Python / ML", available: "Demain 10h-13h", avatar: "T" },
  { name: "Sophie_JS", city: "Lyon", domain: "Node.js / API", available: "Aujourd'hui 16h-20h", avatar: "S" }
]

export default function Coworking() {
  const [timerActive, setTimerActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Définir l'objectif de la session", checked: false },
    { id: 2, text: "Préparer l'environnement de travail", checked: false },
    { id: 3, text: "Bloquer les distractions", checked: false },
    { id: 4, text: "Réviser le code écrit", checked: false }
  ])

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
    if (timeLeft === 0) {
      setTimerActive(false)
      alert("Session terminée ! Prenez une pause.")
    }
  }, [timerActive, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleCheck = (id: number) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  return (
    <div className="min-h-screen animate-page-enter">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Coffee className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">IRL_DISTANCIEL</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight header-glow">
            <span className="bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
              Coworking Virtuel & IRL
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Travaillez efficacement seul ou avec un buddy local
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Virtual Coworking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pomodoro Timer */}
            <div className="glass rounded-2xl p-8 cyber-frame">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Timer className="w-6 h-6 text-primary" />
                Mode coworking virtuel
              </h2>
              
              {/* Timer Display */}
              <div className="text-center mb-8">
                <div className="text-7xl font-bold font-mono mb-4 text-primary">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-muted-foreground">
                  Session Pomodoro {timerActive ? 'en cours' : 'prête'}
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex gap-3 justify-center mb-8">
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className="px-8 py-4 bg-primary text-white rounded-xl font-semibold btn-hover glow-subtle flex items-center gap-2"
                >
                  {timerActive ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Démarrer
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setTimerActive(false)
                    setTimeLeft(25 * 60)
                  }}
                  className="px-8 py-4 bg-border text-foreground rounded-xl font-semibold btn-hover flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>

              {/* Progress Bar */}
              <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] transition-all"
                  style={{ width: `${((25 * 60 - timeLeft) / (25 * 60)) * 100}%` }}
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="glass rounded-2xl p-6 cyber-frame">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-primary" />
                Checklist de session
              </h3>
              
              <div className="space-y-3">
                {checklist.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="flex items-center gap-3 p-4 bg-background rounded-lg cursor-pointer hover:bg-primary/5 transition-all"
                  >
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                      item.checked 
                        ? 'bg-primary border-primary' 
                        : 'border-border'
                    }`}>
                      {item.checked && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-all">
                + Ajouter une tâche
              </button>
            </div>

            {/* Screen Share Placeholder */}
            <div className="glass rounded-2xl p-6 cyber-frame">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                Partage d'écran (placeholder)
              </h3>
              
              <div className="aspect-video bg-gradient-to-br from-[oklch(0.15_0.02_240)] to-[oklch(0.20_0.05_240)] rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Monitor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Partage d'écran non actif</p>
                </div>
              </div>
              
              <button className="w-full px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-all">
                Démarrer le partage d'écran
              </button>
            </div>
          </div>

          {/* Right Column - IRL Features */}
          <div className="space-y-6">
            {/* Local Buddy Finder */}
            <div className="glass rounded-2xl p-6 cyber-frame">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Buddy local
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Votre ville</label>
                <input
                  type="text"
                  placeholder="Ex: Lyon"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Domaine</label>
                <select className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>Tous les domaines</option>
                  <option>Développement</option>
                  <option>Cybersécurité</option>
                  <option>IA / ML</option>
                  <option>Réseau</option>
                </select>
              </div>

              <button className="w-full px-6 py-3 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-lg font-semibold btn-hover glow-subtle mb-4">
                Rechercher
              </button>

              <div className="space-y-3">
                {buddies.map((buddy, i) => (
                  <div key={i} className="p-4 bg-background rounded-lg hover:bg-primary/5 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] flex items-center justify-center text-white font-bold">
                        {buddy.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{buddy.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {buddy.city}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{buddy.domain}</div>
                    <div className="text-xs text-primary flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {buddy.available}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safe Public Places */}
            <div className="glass rounded-2xl p-6 cyber-frame">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Lieux publics sûrs
              </h3>
              
              <div className="space-y-3">
                {publicPlaces.map((place) => (
                  <div key={place.id} className="p-4 bg-background rounded-lg hover:bg-primary/5 transition-all cursor-pointer">
                    <div className="font-semibold mb-1">{place.name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      {place.city} • {place.distance}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                        {place.type}
                      </span>
                      {place.wifi && <Wifi className="w-4 h-4 text-[oklch(0.75_0.22_150)]" title="WiFi" />}
                      {place.power && <span className="text-[oklch(0.75_0.22_150)]" title="Prises">🔌</span>}
                      {place.quiet && <span className="text-[oklch(0.75_0.22_150)]" title="Calme">🤫</span>}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {place.hours}
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-all">
                Voir la carte complète
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
