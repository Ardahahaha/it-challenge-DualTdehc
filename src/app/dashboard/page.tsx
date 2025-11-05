"use client"

import Navigation from "@/components/Navigation"
import { TrendingUp, Award, Target, Activity, Sparkles, Handshake, Video, Calendar, Clock, MapPin, Globe, Users, Zap, Brain, Code2, Shield, Trophy, Coffee } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"

interface Session {
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
  status: string
  organizerName: string
  participant_count: number
}

interface DashboardStats {
  total_matches: number
  matches_won: number
  matches_lost: number
  total_xp: number
  level: number
  win_rate: number
}

type SkillTheme = 'all' | 'dev' | 'cyber' | 'ia'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [activeTheme, setActiveTheme] = useState<SkillTheme>('all')

  useEffect(() => {
    fetchSessions()
    if (session?.user) {
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      setLoadingStats(true)
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/supabase/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true)
      const response = await fetch('/api/irl-sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data.slice(0, 6))
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
    } finally {
      setLoadingSessions(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">À venir</span>
      case 'completed':
        return <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">Terminé</span>
      case 'cancelled':
        return <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-lg text-xs font-bold">Annulé</span>
      default:
        return null
    }
  }

  const themes = [
    { id: 'all' as SkillTheme, label: 'Tout', icon: Target, color: 'from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)]' },
    { id: 'dev' as SkillTheme, label: 'Développement', icon: Code2, color: 'from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)]' },
    { id: 'cyber' as SkillTheme, label: 'Cybersécurité', icon: Shield, color: 'from-[oklch(0.5_0.22_285)] to-[oklch(0.4_0.2_290)]' },
    { id: 'ia' as SkillTheme, label: 'Intelligence Artificielle', icon: Brain, color: 'from-[oklch(0.4_0.2_290)] to-[oklch(0.3_0.15_285)]' },
  ]

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [session, isPending, router])

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-6 py-10 animate-page-enter">
        {/* Header with cyber elements */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">DASHBOARD</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight header-glow bg-gradient-to-r from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] bg-clip-text text-transparent">
            Tableau de bord
          </h1>
          <p className="text-xl text-muted-foreground mt-2">Bienvenue, {session.user.name}</p>
        </div>

        {/* Theme Filters */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-sm font-mono text-muted-foreground">FILTRER PAR THÈME</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {themes.map((theme) => {
              const Icon = theme.icon
              const isActive = activeTheme === theme.id
              return (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme.id)}
                  className={`
                    px-5 py-3 rounded-xl font-semibold transition-all
                    ${isActive 
                      ? `bg-gradient-to-r ${theme.color} text-white shadow-lg scale-105` 
                      : 'glass hover:scale-105'
                    }
                    btn-hover flex items-center gap-2
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {theme.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">Accès rapide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div onClick={() => router.push('/salles')} className="glass rounded-xl p-5 card-hover cyber-frame cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold mb-1">Salles thématiques</h3>
              <p className="text-xs text-muted-foreground">Dev, Cyber, IA, Réseau</p>
            </div>

            <div onClick={() => router.push('/modes-challenge')} className="glass rounded-xl p-5 card-hover cyber-frame cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.5_0.22_285)] to-[oklch(0.4_0.2_290)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold mb-1">Modes de challenge</h3>
              <p className="text-xs text-muted-foreground">Speed • Pair Debugging</p>
            </div>

            <div onClick={() => router.push('/gamification')} className="glass rounded-xl p-5 card-hover cyber-frame cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.4_0.2_290)] to-[oklch(0.3_0.15_285)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold mb-1">Progression</h3>
              <p className="text-xs text-muted-foreground">XP • Classements</p>
            </div>

            <div onClick={() => router.push('/assistant-ia')} className="glass rounded-xl p-5 card-hover cyber-frame cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.5_0.22_285)] to-[oklch(0.6_0.25_280)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold mb-1">Assistant IA</h3>
              <p className="text-xs text-muted-foreground">Tuteur • Feedback</p>
            </div>

            <div onClick={() => router.push('/evenements')} className="glass rounded-xl p-5 card-hover cyber-frame cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold mb-1">Événements</h3>
              <p className="text-xs text-muted-foreground">CTF • Bug Monday</p>
            </div>

            <div onClick={() => router.push('/matchmaking')} className="glass rounded-xl p-5 card-hover cyber-frame cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.5_0.22_285)] to-[oklch(0.4_0.2_290)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold mb-1">Matchmaking</h3>
              <p className="text-xs text-muted-foreground">Partenaires • Contrats</p>
            </div>

            <div onClick={() => router.push('/skills-tracking')} className="glass rounded-xl p-5 card-hover cyber-frame cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.4_0.2_290)] to-[oklch(0.3_0.15_285)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold mb-1">Compétences</h3>
              <p className="text-xs text-muted-foreground">Suivi • Progression</p>
            </div>

            <div onClick={() => router.push('/communautes')} className="glass rounded-xl p-5 card-hover cyber-frame cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold mb-1">Communautés</h3>
              <p className="text-xs text-muted-foreground">Chat • Groupes</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons for 1v1 Sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-2xl p-6 cyber-frame border-2 border-primary/30 relative overflow-hidden group cursor-pointer" onClick={() => router.push('/1v1-presentiel')}>
            <div className="absolute top-4 right-4 text-primary/10 text-6xl font-mono group-hover:text-primary/20 transition-colors">IRL</div>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform glow-subtle">
                <Handshake className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold tracking-tight mb-2">1v1 Présentiel</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Organisez des rencontres en personne pour pratiquer ensemble
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Planifier une session</span>
                  <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 cyber-frame border-2 border-[oklch(0.5_0.22_285)]/30 relative overflow-hidden group cursor-pointer" onClick={() => router.push('/1v1-distanciel')}>
            <div className="absolute top-4 right-4 text-[oklch(0.5_0.22_285)]/10 text-6xl font-mono group-hover:text-[oklch(0.5_0.22_285)]/20 transition-colors">{"<>"}</div>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[oklch(0.5_0.22_285)] to-[oklch(0.4_0.2_290)] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform glow-subtle">
                <Video className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold tracking-tight mb-2">1v1 Distanciel</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Connectez-vous en ligne avec des développeurs du monde entier
                </p>
                <div className="flex items-center gap-2 text-[oklch(0.5_0.22_285)] font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Planifier une session</span>
                  <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards with REAL DATA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {loadingStats ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass rounded-2xl p-8 card-hover cyber-frame relative overflow-hidden">
                  <Activity className="w-8 h-8 text-primary/50 animate-spin" />
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="glass rounded-2xl p-8 card-hover cyber-frame relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-primary/10 text-3xl font-mono group-hover:text-primary/20 transition-colors">01</div>
                <div className="text-sm text-muted-foreground mb-3 font-mono flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Total des défis
                </div>
                <div className="text-5xl font-bold tracking-tight bg-gradient-to-r from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] bg-clip-text text-transparent">
                  {stats?.total_matches || 0}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {stats?.total_matches === 0 ? 'Commencez votre premier défi' : 'Matchs joués'}
                </div>
              </div>
              
              <div className="glass rounded-2xl p-8 card-hover cyber-frame relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-primary/10 text-3xl font-mono group-hover:text-primary/20 transition-colors">02</div>
                <div className="text-sm text-muted-foreground mb-3 font-mono flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Victoires
                </div>
                <div className="text-5xl font-bold tracking-tight text-primary">{stats?.matches_won || 0}</div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50"></div>
              </div>
              
              <div className="glass rounded-2xl p-8 card-hover cyber-frame relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-primary/10 text-3xl font-mono group-hover:text-primary/20 transition-colors">03</div>
                <div className="text-sm text-muted-foreground mb-3 font-mono flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Défaites
                </div>
                <div className="text-5xl font-bold tracking-tight text-muted-foreground">{stats?.matches_lost || 0}</div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-muted-foreground to-transparent opacity-50"></div>
              </div>
              
              <div className="glass rounded-2xl p-8 card-hover cyber-frame relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-primary/10 text-3xl font-mono group-hover:text-primary/20 transition-colors">04</div>
                <div className="text-sm text-muted-foreground mb-3 font-mono flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Taux de victoire
                </div>
                <div className="text-5xl font-bold tracking-tight bg-gradient-to-r from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] bg-clip-text text-transparent">
                  {stats?.win_rate ? `${stats.win_rate}%` : '-%'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* XP & Level Display */}
        <div className="glass rounded-2xl p-6 mb-8 cyber-frame">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold">Niveau {stats?.level || 0}</div>
                <div className="text-sm text-muted-foreground">{stats?.total_xp || 0} XP total</div>
              </div>
            </div>
            <div className="text-right">
              <button
                onClick={() => router.push('/progression')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold btn-hover"
              >
                Voir la progression
              </button>
            </div>
          </div>
        </div>

        {/* Sessions planifiées */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl font-bold tracking-tight header-glow">Sessions planifiées</h2>
          </div>
          
          {loadingSessions ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Activity className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement des sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Aucune session planifiée</h3>
              <p className="text-muted-foreground mb-6">Commencez par créer votre première session 1v1</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="glass rounded-xl p-6 card-hover cyber-frame group cursor-pointer"
                  onClick={() => router.push(session.type === 'presentiel' ? '/1v1-presentiel' : '/1v1-distanciel')}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg ${session.type === 'presentiel' ? 'bg-gradient-to-br from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)]' : 'bg-gradient-to-br from-[oklch(0.5_0.22_285)] to-[oklch(0.4_0.2_290)]'} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      {session.type === 'presentiel' ? (
                        <MapPin className="w-5 h-5 text-white" />
                      ) : (
                        <Video className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base mb-1 truncate">{session.domain}</h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        {session.type === 'presentiel' ? 'Présentiel' : 'Distanciel'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-bold">
                        {session.level}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium truncate">
                        {new Date(session.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">{session.time} • {session.duration}</span>
                    </div>

                    {session.type === 'distanciel' && session.timezone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium truncate">{session.timezone}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border">
                    {getStatusBadge(session.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Stats Summary */}
          <div className="glass rounded-2xl p-8 scanline">
            <h2 className="text-3xl font-bold mb-8 tracking-tight flex items-center gap-3">
              <Trophy className="w-7 h-7 text-primary animate-pulse" />
              Vue d'ensemble
            </h2>
            {loadingStats ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Chargement des statistiques...</p>
              </div>
            ) : !stats || stats.total_matches === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Commencez à jouer</h3>
                <p className="text-muted-foreground">Vos statistiques apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 glass rounded-lg">
                  <span className="text-muted-foreground">Matchs total</span>
                  <span className="text-2xl font-bold">{stats.total_matches}</span>
                </div>
                <div className="flex justify-between items-center p-4 glass rounded-lg">
                  <span className="text-muted-foreground">Victoires</span>
                  <span className="text-2xl font-bold text-primary">{stats.matches_won}</span>
                </div>
                <div className="flex justify-between items-center p-4 glass rounded-lg">
                  <span className="text-muted-foreground">XP total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] bg-clip-text text-transparent">{stats.total_xp}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="glass rounded-2xl p-8 scanline">
            <h2 className="text-3xl font-bold mb-8 tracking-tight flex items-center gap-3">
              <Zap className="w-7 h-7 text-primary" />
              Actions rapides
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/realtime-1v1')}
                className="w-full p-4 glass rounded-lg hover:bg-primary/5 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <div className="font-bold">Démarrer un match</div>
                    <div className="text-xs text-muted-foreground">1v1 en temps réel</div>
                  </div>
                  <span className="text-primary">→</span>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/users')}
                className="w-full p-4 glass rounded-lg hover:bg-primary/5 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <div className="font-bold">Trouver des adversaires</div>
                    <div className="text-xs text-muted-foreground">Parcourir les utilisateurs</div>
                  </div>
                  <span className="text-primary">→</span>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/skills-tracking')}
                className="w-full p-4 glass rounded-lg hover:bg-primary/5 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <div className="font-bold">Gérer mes compétences</div>
                    <div className="text-xs text-muted-foreground">Suivre votre progression</div>
                  </div>
                  <span className="text-primary">→</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}