"use client"

import Navigation from "@/components/Navigation"
import { useState } from "react"
import { Users, Plus, Calendar, MapPin, Filter, X, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

type Community = {
  id: string
  name: string
  domain: string
  members: number
  maxMembers: number
  nextMeeting: string
  description: string
  joined: boolean
}

const initialCommunities: Community[] = [
  {
    id: "1",
    name: "Développeurs Web",
    domain: "Développement",
    members: 234,
    maxMembers: 500,
    nextMeeting: "2025-11-10 18:00",
    description: "Communauté pour les passionnés de développement web moderne",
    joined: true,
  },
  {
    id: "2",
    name: "Experts Cybersécurité",
    domain: "Cybersécurité",
    members: 156,
    maxMembers: 300,
    nextMeeting: "2025-11-08 19:00",
    description: "Apprenez et partagez les meilleures pratiques en sécurité",
    joined: false,
  },
  {
    id: "3",
    name: "SysAdmins Pro",
    domain: "SysAdmin",
    members: 189,
    maxMembers: 400,
    nextMeeting: "2025-11-12 17:30",
    description: "Pour les administrateurs système de tous niveaux",
    joined: true,
  },
  {
    id: "4",
    name: "IA & Machine Learning",
    domain: "IA/ML",
    members: 312,
    maxMembers: 600,
    nextMeeting: "2025-11-09 20:00",
    description: "Explorez le monde fascinant de l'intelligence artificielle",
    joined: false,
  },
  {
    id: "5",
    name: "Réseau & Infrastructure",
    domain: "Réseau",
    members: 145,
    maxMembers: 350,
    nextMeeting: "2025-11-11 18:30",
    description: "Maîtrisez les réseaux et l'infrastructure IT",
    joined: false,
  },
  {
    id: "6",
    name: "DevOps France",
    domain: "SysAdmin",
    members: 278,
    maxMembers: 500,
    nextMeeting: "2025-11-13 19:00",
    description: "CI/CD, containers, orchestration et automatisation",
    joined: false,
  },
]

const domains = ["Tous", "Développement", "Cybersécurité", "SysAdmin", "Réseau", "IA/ML"]

export default function CommunautesPage() {
  const [communities, setCommunities] = useState<Community[]>(initialCommunities)
  const [filter, setFilter] = useState("Tous")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    domain: "Développement",
    description: "",
    maxMembers: 100,
  })

  const handleJoinLeave = async (communityId: string) => {
    const community = communities.find(c => c.id === communityId)
    if (!community) return

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? {
              ...c,
              joined: !c.joined,
              members: c.joined ? c.members - 1 : c.members + 1,
            }
          : c
      )
    )
    
    setLoading(false)
    
    if (community.joined) {
      toast.success("Vous avez quitté la communauté", {
        description: community.name,
      })
    } else {
      toast.success("Vous avez rejoint la communauté !", {
        description: community.name,
      })
    }
  }

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("Erreur", {
        description: "Veuillez remplir tous les champs requis",
      })
      return
    }

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newCommunity: Community = {
      id: Date.now().toString(),
      name: formData.name,
      domain: formData.domain,
      members: 1,
      maxMembers: formData.maxMembers,
      nextMeeting: "À définir",
      description: formData.description,
      joined: true,
    }

    setCommunities((prev) => [newCommunity, ...prev])
    setFormData({ name: "", domain: "Développement", description: "", maxMembers: 100 })
    setShowCreateForm(false)
    setLoading(false)

    toast.success("Communauté créée avec succès !", {
      description: "Vous êtes maintenant le créateur de cette communauté",
    })
  }

  const filteredCommunities = filter === "Tous" 
    ? communities 
    : communities.filter(c => c.domain === filter)

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case "Développement":
        return "bg-[oklch(0.55_0.25_240)]/10 text-[oklch(0.55_0.25_240)] border-[oklch(0.55_0.25_240)]/30"
      case "Cybersécurité":
        return "bg-destructive/10 text-destructive border-destructive/30"
      case "SysAdmin":
        return "bg-[oklch(0.65_0.2_200)]/10 text-[oklch(0.65_0.2_200)] border-[oklch(0.65_0.2_200)]/30"
      case "Réseau":
        return "bg-[oklch(0.6_0.25_290)]/10 text-[oklch(0.6_0.25_290)] border-[oklch(0.6_0.25_290)]/30"
      case "IA/ML":
        return "bg-[oklch(0.75_0.22_150)]/10 text-[oklch(0.75_0.22_150)] border-[oklch(0.75_0.22_150)]/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-6 py-10 animate-page-enter">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">COMMUNITIES</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-5xl font-bold tracking-tight header-glow bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent mb-4">
                Communautés
              </h1>
              <p className="text-lg text-muted-foreground">
                Rejoignez des communautés et apprenez ensemble
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle flex items-center gap-2"
            >
              {showCreateForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showCreateForm ? "Annuler" : "Créer une communauté"}
            </button>
          </div>
        </div>

        {/* Create Community Form */}
        {showCreateForm && (
          <div className="glass rounded-2xl p-8 mb-8 cyber-frame animate-page-enter">
            <h2 className="text-2xl font-bold mb-6">Créer une nouvelle communauté</h2>
            <form onSubmit={handleCreateCommunity} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Nom de la communauté *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Développeurs JavaScript"
                  className="w-full px-4 py-3 glass rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Domaine *</label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-4 py-3 glass rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {domains.filter(d => d !== "Tous").map((domain) => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez votre communauté..."
                  className="w-full px-4 py-3 glass rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Nombre maximum de membres</label>
                <input
                  type="number"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) || 100 })}
                  min="10"
                  max="1000"
                  className="w-full px-4 py-3 glass rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Créer la communauté
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Domain Filter */}
        <div className="flex items-center gap-4 mb-8">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <div className="flex flex-wrap gap-3">
            {domains.map((domain) => (
              <button
                key={domain}
                onClick={() => setFilter(domain)}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                  filter === domain
                    ? "bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white glow-subtle"
                    : "glass border border-border hover:border-primary/30"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Communities Grid */}
        {filteredCommunities.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center cyber-frame">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Aucune communauté trouvée</h3>
            <p className="text-muted-foreground mb-6">
              Essayez de changer les filtres ou créez une nouvelle communauté
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <div
                key={community.id}
                className="glass rounded-2xl p-6 card-hover cyber-frame group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{community.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getDomainColor(community.domain)}`}>
                      {community.domain}
                    </span>
                  </div>
                  {community.joined && (
                    <CheckCircle className="w-6 h-6 text-[oklch(0.75_0.22_150)] flex-shrink-0" />
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {community.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-muted-foreground">
                          {community.members} / {community.maxMembers} membres
                        </span>
                        <span className="text-xs font-mono">
                          {Math.round((community.members / community.maxMembers) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] transition-all duration-500"
                          style={{ width: `${(community.members / community.maxMembers) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>Prochain RDV: {community.nextMeeting}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleJoinLeave(community.id)}
                  disabled={loading || (!community.joined && community.members >= community.maxMembers)}
                  className={`w-full px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    community.joined
                      ? "bg-muted text-foreground border-2 border-border hover:border-destructive/30 hover:text-destructive"
                      : "bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white btn-hover glow-subtle"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : community.joined ? (
                    <>
                      <X className="w-5 h-5" />
                      Quitter
                    </>
                  ) : community.members >= community.maxMembers ? (
                    "Complet"
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Rejoindre
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
