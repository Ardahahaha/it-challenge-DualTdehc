"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/Navigation"
import { useRouter, useParams } from "next/navigation"
import { 
  User, Zap, Trophy, Activity, Sparkles, Code2, Shield, Brain, 
  Network, Server, TrendingUp, Clock, Target, Award, Flag, 
  UserPlus, Eye, EyeOff, Loader2, AlertCircle
} from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import UserAvatar from "@/components/UserAvatar"

// Domain icons mapping
const domainIcons: Record<string, { icon: any; color: string }> = {
  "Développement web/logiciel": { icon: Code2, color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)]" },
  "Cybersécurité": { icon: Shield, color: "from-[oklch(0.6_0.25_290)] to-[oklch(0.55_0.25_240)]" },
  "Développement IA/ML": { icon: Brain, color: "from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)]" },
  "Réseau": { icon: Network, color: "from-[oklch(0.65_0.2_200)] to-[oklch(0.55_0.25_240)]" },
  "SysAdmin": { icon: Server, color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.6_0.25_290)]" }
}

interface Profile {
  username: string
  avatarUrl: string | null
  bio: string | null
  niveau: string
  visibility: string
  domaines: string | null
  xp: number
  level: number
}

export default function PublicProfilePage() {
  const router = useRouter()
  const params = useParams()
  const username = params?.username as string
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  // Load profile from database
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/username/${username}`)

        if (response.status === 404) {
          setError("not_found")
          setIsLoading(false)
          return
        }

        if (response.status === 403) {
          setError("private")
          setIsLoading(false)
          return
        }

        if (!response.ok) {
          setError("error")
          setIsLoading(false)
          return
        }

        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error("Error loading profile:", error)
        setError("error")
      } finally {
        setIsLoading(false)
      }
    }

    if (username) {
      loadProfile()
    }
  }, [username])

  const handleInvite = () => {
    toast.success(`Invitation envoyée à ${username} !`, {
      description: "Vous serez notifié lorsqu'il acceptera.",
      duration: 3000
    })
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast.success(isFollowing ? `Vous ne suivez plus ${username}` : `Vous suivez maintenant ${username}`)
  }

  const handleReport = (reason: string) => {
    toast.success("Signalement envoyé", {
      description: "Notre équipe examinera votre signalement."
    })
    setShowReportModal(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <Toaster />
        <div className="container mx-auto px-6 py-32 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement du profil...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error: Profile not found
  if (error === "not_found") {
    return (
      <div className="min-h-screen">
        <Navigation />
        <Toaster />
        <div className="container mx-auto px-6 py-32 animate-page-enter">
          <div className="max-w-2xl mx-auto text-center glass rounded-2xl p-16 cyber-frame">
            <AlertCircle className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-4xl font-bold mb-4">Profil introuvable</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Le profil @{username} n'existe pas
            </p>
            <button 
              onClick={() => router.push('/profils')}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold btn-hover"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Error: Private profile
  if (error === "private") {
    return (
      <div className="min-h-screen">
        <Navigation />
        <Toaster />
        <div className="container mx-auto px-6 py-32 animate-page-enter">
          <div className="max-w-2xl mx-auto text-center glass rounded-2xl p-16 cyber-frame">
            <EyeOff className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-4xl font-bold mb-4">Profil privé</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Ce profil est visible uniquement en duel
            </p>
            <button 
              onClick={() => router.push('/profils')}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold btn-hover"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Error: Generic error
  if (error === "error" || !profile) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <Toaster />
        <div className="container mx-auto px-6 py-32 animate-page-enter">
          <div className="max-w-2xl mx-auto text-center glass rounded-2xl p-16 cyber-frame">
            <AlertCircle className="w-20 h-20 mx-auto mb-6 text-destructive" />
            <h1 className="text-4xl font-bold mb-4">Erreur</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Une erreur est survenue lors du chargement du profil
            </p>
            <button 
              onClick={() => router.push('/profils')}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold btn-hover"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Parse domains
  const domains = profile.domaines ? JSON.parse(profile.domaines) : []

  return (
    <div className="min-h-screen">
      <Navigation />
      <Toaster />
      
      <div className="container mx-auto px-6 py-10 animate-page-enter">
        {/* Profile Header */}
        <div className="glass rounded-2xl p-10 mb-8 card-hover cyber-frame relative overflow-hidden">
          <div className="absolute top-4 right-4 text-primary/10 text-3xl font-mono">@</div>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl glow-subtle flex-shrink-0">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] flex items-center justify-center text-white text-5xl font-bold">
                  {profile.username[0].toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-sm font-mono text-primary tech-bracket">PROFIL_PUBLIC</span>
              </div>
              <h1 className="text-5xl font-bold mb-4 tracking-tight header-glow">{profile.username}</h1>
              
              {/* Domains and Level */}
              <div className="flex flex-wrap gap-3 mb-4">
                {domains.map((domainName: string, i: number) => {
                  const domainInfo = domainIcons[domainName] || { 
                    icon: Code2, 
                    color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)]" 
                  }
                  const Icon = domainInfo.icon
                  return (
                    <div 
                      key={i}
                      className={`px-4 py-2 rounded-lg bg-gradient-to-r ${domainInfo.color} text-white font-semibold flex items-center gap-2`}
                    >
                      <Icon className="w-4 h-4" />
                      {domainName}
                    </div>
                  )
                })}
                <div className="px-4 py-2 rounded-lg bg-muted text-muted-foreground font-semibold">
                  Niveau: {profile.niveau}
                </div>
              </div>
              
              {profile.bio && (
                <p className="mb-6 leading-relaxed text-lg text-muted-foreground">{profile.bio}</p>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={handleInvite}
                  className="bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white px-6 py-3 rounded-xl font-bold btn-hover glow-subtle pulse-ring flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Inviter en 1v1
                </button>
                <button 
                  onClick={handleFollow}
                  className={`px-6 py-3 rounded-xl font-bold btn-hover flex items-center gap-2 ${
                    isFollowing 
                      ? "bg-muted text-foreground" 
                      : "glass border-2 border-primary/30"
                  }`}
                >
                  <UserPlus className="w-5 h-5" />
                  {isFollowing ? "Abonné" : "Suivre"}
                </button>
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="px-6 py-3 rounded-xl font-semibold btn-hover glass border border-destructive/30 text-destructive flex items-center gap-2"
                >
                  <Flag className="w-5 h-5" />
                  Signaler
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* XP and Level */}
          <div className="glass rounded-2xl p-8 cyber-frame">
            <h2 className="text-3xl font-bold mb-6 tracking-tight flex items-center gap-3">
              <Activity className="w-7 h-7 text-primary animate-pulse" />
              Progression
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Level */}
              <div className="glass rounded-xl p-6 relative overflow-hidden">
                <Trophy className="w-6 h-6 text-primary mb-2" />
                <div className="text-sm text-muted-foreground mb-1 font-mono">Niveau</div>
                <div className="text-4xl font-bold tracking-tight">{profile.level}</div>
              </div>
              
              {/* XP Total */}
              <div className="glass rounded-xl p-6 relative overflow-hidden">
                <Sparkles className="w-6 h-6 text-[oklch(0.6_0.25_290)] mb-2" />
                <div className="text-sm text-muted-foreground mb-1 font-mono">XP Total</div>
                <div className="text-4xl font-bold tracking-tight bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">{profile.xp.toLocaleString()}</div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-6 glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono text-muted-foreground">Progression vers niveau {profile.level + 1}</span>
                <span className="text-sm font-bold">{profile.xp % 1000} / 1000 XP</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] transition-all duration-500"
                  style={{ width: `${(profile.xp % 1000) / 10}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Info Message */}
          <div className="glass rounded-2xl p-8 cyber-frame flex items-center justify-center">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-primary/50 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Profil public</h3>
              <p className="text-muted-foreground">
                Les statistiques détaillées et l'historique des défis seront bientôt disponibles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-8 max-w-md w-full cyber-frame animate-page-enter">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Flag className="w-6 h-6 text-destructive" />
              Signaler ce profil
            </h2>
            <p className="text-muted-foreground mb-6">
              Pourquoi signalez-vous ce profil ?
            </p>
            <div className="space-y-3 mb-6">
              {[
                "Contenu inapproprié",
                "Comportement abusif",
                "Spam ou publicité",
                "Usurpation d'identité",
                "Autre raison"
              ].map(reason => (
                <button 
                  key={reason}
                  onClick={() => handleReport(reason)}
                  className="w-full glass rounded-xl p-4 text-left btn-hover border border-border/50 hover:border-destructive/50"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowReportModal(false)}
              className="w-full glass rounded-xl p-3 font-semibold btn-hover"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}