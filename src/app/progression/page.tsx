"use client"

import { useState, useMemo } from "react"
import Navigation from "@/components/Navigation"
import { TrendingUp, Calendar, Zap, Target, Trophy, Code2, Shield, Brain, Download, FileText } from "lucide-react"
import { generateProgressPDF, downloadPDF } from "@/lib/pdf-export"

export default function ProgressionPage() {
  // Generate mock activity data for the past year (GitHub-style)
  const activityData = useMemo(() => {
    const data: { date: Date; count: number }[] = []
    const today = new Date()
    
    // Generate 365 days of mock data
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Random activity level (0-4 for intensity)
      const count = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0
      data.push({ date, count })
    }
    
    return data
  }, [])

  // Group by weeks for display
  const weeks = useMemo(() => {
    const weekGroups: { date: Date; count: number }[][] = []
    let currentWeek: { date: Date; count: number }[] = []
    
    // Pad to start on Sunday
    const firstDay = activityData[0].date.getDay()
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push({ date: new Date(0), count: -1 })
    }
    
    activityData.forEach((day) => {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        weekGroups.push(currentWeek)
        currentWeek = []
      }
    })
    
    // Pad last week if needed
    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push({ date: new Date(0), count: -1 })
    }
    if (currentWeek.length > 0) {
      weekGroups.push(currentWeek)
    }
    
    return weekGroups
  }, [activityData])

  // Calculate stats
  const stats = useMemo(() => {
    const totalDays = activityData.filter(d => d.count > 0).length
    const currentStreak = activityData.reverse().findIndex(d => d.count === 0)
    const totalActivity = activityData.reduce((sum, d) => sum + d.count, 0)
    
    return {
      totalDays,
      currentStreak: currentStreak === -1 ? activityData.length : currentStreak,
      totalActivity,
      bestDay: Math.max(...activityData.map(d => d.count))
    }
  }, [activityData])

  const getIntensityColor = (count: number) => {
    if (count === -1) return "bg-transparent"
    if (count === 0) return "bg-border/30"
    if (count === 1) return "bg-[oklch(0.55_0.25_240)]/20"
    if (count === 2) return "bg-[oklch(0.55_0.25_240)]/40"
    if (count === 3) return "bg-[oklch(0.55_0.25_240)]/60"
    return "bg-[oklch(0.55_0.25_240)]"
  }

  const monthLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]

  const handleExportPDF = () => {
    const stats = {
      name: "Utilisateur",
      level: "Intermédiaire",
      totalDuels: 42,
      victories: 28,
      defeats: 12,
      draws: 2,
      winRate: 67,
      avgRapidite: 82,
      avgPrecision: 85,
      avgRigueur: 88,
      topSkills: ["JavaScript", "React", "Node.js", "Python", "Algorithmes"],
      badges: [
        { name: "Première victoire", unlocked: true },
        { name: "Série de 5", unlocked: true },
        { name: "Vétéran", unlocked: true },
        { name: "Expert code", unlocked: false },
      ],
      recentDuels: [
        { title: "Tri rapide", result: "Victoire", date: "2025-11-03", score: 285 },
        { title: "Validation formulaire", result: "Défaite", date: "2025-11-02", score: 156 },
        { title: "Cache LRU", result: "Victoire", date: "2025-11-01", score: 310 },
      ]
    }
    
    const pdfUrl = generateProgressPDF(stats)
    downloadPDF(pdfUrl, "progression-defi-it.html")
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-6 py-10 animate-page-enter">
        {/* Header */}
        <div className="mb-12 relative">
          <div className="absolute top-0 right-0 text-primary/10 text-8xl font-mono">{"📊"}</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
                <span className="text-sm font-mono text-primary tech-bracket">PROGRESSION</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight header-glow bg-gradient-to-r from-[oklch(0.55_0.25_240)] via-[oklch(0.65_0.2_200)] to-[oklch(0.75_0.22_150)] bg-clip-text text-transparent mb-4">
                Suivi de progression
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Visualisez votre activité et vos performances avec un heatmap inspiré de GitHub
              </p>
            </div>
            
            <button
              onClick={handleExportPDF}
              className="px-6 py-4 bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle flex items-center gap-3"
            >
              <Download className="w-5 h-5" />
              Exporter en PDF (CV)
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass rounded-xl p-6 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-[oklch(0.55_0.25_240)]" />
              <span className="text-sm font-mono text-muted-foreground">JOURS ACTIFS</span>
            </div>
            <div className="text-3xl font-bold">{stats.totalDays}</div>
            <div className="text-sm text-muted-foreground mt-1">cette année</div>
          </div>

          <div className="glass rounded-xl p-6 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-[oklch(0.65_0.2_40)]" />
              <span className="text-sm font-mono text-muted-foreground">SÉRIE ACTUELLE</span>
            </div>
            <div className="text-3xl font-bold">{stats.currentStreak}</div>
            <div className="text-sm text-muted-foreground mt-1">jours consécutifs</div>
          </div>

          <div className="glass rounded-xl p-6 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <Code2 className="w-5 h-5 text-[oklch(0.75_0.22_150)]" />
              <span className="text-sm font-mono text-muted-foreground">DÉFIS TOTAUX</span>
            </div>
            <div className="text-3xl font-bold">{stats.totalActivity}</div>
            <div className="text-sm text-muted-foreground mt-1">défis complétés</div>
          </div>

          <div className="glass rounded-xl p-6 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-[oklch(0.6_0.25_290)]" />
              <span className="text-sm font-mono text-muted-foreground">MEILLEUR JOUR</span>
            </div>
            <div className="text-3xl font-bold">{stats.bestDay}</div>
            <div className="text-sm text-muted-foreground mt-1">défis en un jour</div>
          </div>
        </div>

        {/* GitHub-Style Heatmap */}
        <div className="glass rounded-2xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Carte d'activité</h2>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Month labels */}
              <div className="flex gap-1 mb-2 ml-8">
                {monthLabels.map((month, i) => (
                  <div key={i} className="text-xs text-muted-foreground" style={{ width: `${(weeks.length / 12) * 14}px` }}>
                    {month}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              <div className="flex gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-1 text-xs text-muted-foreground justify-around py-1">
                  <div>Lun</div>
                  <div>Mer</div>
                  <div>Ven</div>
                </div>

                {/* Activity squares */}
                <div className="flex gap-1">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`w-3 h-3 rounded-sm transition-all hover:ring-2 hover:ring-primary ${getIntensityColor(day.count)}`}
                          title={day.count >= 0 ? `${day.date.toLocaleDateString('fr-FR')} - ${day.count} défis` : ''}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>Moins</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-border/30" />
                  <div className="w-3 h-3 rounded-sm bg-[oklch(0.55_0.25_240)]/20" />
                  <div className="w-3 h-3 rounded-sm bg-[oklch(0.55_0.25_240)]/40" />
                  <div className="w-3 h-3 rounded-sm bg-[oklch(0.55_0.25_240)]/60" />
                  <div className="w-3 h-3 rounded-sm bg-[oklch(0.55_0.25_240)]" />
                </div>
                <span>Plus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[oklch(0.55_0.25_240)]" />
              <h3 className="font-bold">Développement</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">JavaScript</span>
                  <span className="font-mono">78%</span>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <div className="h-full bg-[oklch(0.55_0.25_240)]" style={{ width: '78%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Python</span>
                  <span className="font-mono">65%</span>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <div className="h-full bg-[oklch(0.55_0.25_240)]" style={{ width: '65%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">TypeScript</span>
                  <span className="font-mono">82%</span>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <div className="h-full bg-[oklch(0.55_0.25_240)]" style={{ width: '82%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[oklch(0.65_0.2_40)]" />
              <h3 className="font-bold">Cybersécurité</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Pentesting</span>
                  <span className="font-mono">56%</span>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <div className="h-full bg-[oklch(0.65_0.2_40)]" style={{ width: '56%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Cryptographie</span>
                  <span className="font-mono">48%</span>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <div className="h-full bg-[oklch(0.65_0.2_40)]" style={{ width: '48%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Réseaux</span>
                  <span className="font-mono">71%</span>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <div className="h-full bg-[oklch(0.65_0.2_40)]" style={{ width: '71%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[oklch(0.75_0.22_150)]" />
              <h3 className="font-bold">Intelligence Artificielle</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Machine Learning</span>
                  <span className="font-mono">62%</span>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <div className="h-full bg-[oklch(0.75_0.22_150)]" style={{ width: '62%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Deep Learning</span>
                  <span className="font-mono">44%</span>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <div className="h-full bg-[oklch(0.75_0.22_150)]" style={{ width: '44%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">NLP</span>
                  <span className="font-mono">53%</span>
                </div>
                <div className="h-2 bg-border/30 rounded-full overflow-hidden">
                  <div className="h-full bg-[oklch(0.75_0.22_150)]" style={{ width: '53%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}