"use client"

import Navigation from "@/components/Navigation"
import { useState } from "react"
import { TrendingUp, Award, Save, CheckCircle } from "lucide-react"
import { toast } from "sonner"

type SkillLevel = "Débutant" | "Intermédiaire" | "Avancé" | null

type Skill = {
  id: string
  name: string
  domain: string
  level: SkillLevel
  xp: number
  maxXp: number
}

const initialSkills: Skill[] = [
  { id: "1", name: "JavaScript", domain: "Développement", level: "Intermédiaire", xp: 450, maxXp: 1000 },
  { id: "2", name: "Python", domain: "Développement", level: "Débutant", xp: 200, maxXp: 1000 },
  { id: "3", name: "React", domain: "Développement", level: "Avancé", xp: 850, maxXp: 1000 },
  { id: "4", name: "Docker", domain: "SysAdmin", level: null, xp: 0, maxXp: 1000 },
  { id: "5", name: "Linux", domain: "SysAdmin", level: "Intermédiaire", xp: 600, maxXp: 1000 },
  { id: "6", name: "Kubernetes", domain: "SysAdmin", level: null, xp: 0, maxXp: 1000 },
  { id: "7", name: "TCP/IP", domain: "Réseau", level: "Débutant", xp: 300, maxXp: 1000 },
  { id: "8", name: "DNS", domain: "Réseau", level: "Intermédiaire", xp: 500, maxXp: 1000 },
  { id: "9", name: "VPN", domain: "Réseau", level: null, xp: 0, maxXp: 1000 },
  { id: "10", name: "Pentest", domain: "Cybersécurité", level: null, xp: 0, maxXp: 1000 },
  { id: "11", name: "OWASP", domain: "Cybersécurité", level: "Débutant", xp: 250, maxXp: 1000 },
  { id: "12", name: "Cryptographie", domain: "Cybersécurité", level: null, xp: 0, maxXp: 1000 },
  { id: "13", name: "TensorFlow", domain: "IA/ML", level: null, xp: 0, maxXp: 1000 },
  { id: "14", name: "PyTorch", domain: "IA/ML", level: null, xp: 0, maxXp: 1000 },
  { id: "15", name: "NLP", domain: "IA/ML", level: "Débutant", xp: 150, maxXp: 1000 },
]

const levels: SkillLevel[] = ["Débutant", "Intermédiaire", "Avancé"]
const domains = ["Développement", "SysAdmin", "Réseau", "Cybersécurité", "IA/ML"]

export default function SkillsTrackingPage() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [filter, setFilter] = useState<string>("Tous")
  const [saving, setSaving] = useState(false)

  const handleLevelChange = (skillId: string, level: SkillLevel) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === skillId ? { ...skill, level } : skill
      )
    )
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate save to backend
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    toast.success("Compétences enregistrées avec succès !", {
      description: "Vos modifications ont été sauvegardées.",
      duration: 3000,
    })
  }

  const getLevelColor = (level: SkillLevel) => {
    switch (level) {
      case "Débutant":
        return "bg-[oklch(0.65_0.2_200)]/20 text-[oklch(0.65_0.2_200)] border-[oklch(0.65_0.2_200)]/30"
      case "Intermédiaire":
        return "bg-primary/20 text-primary border-primary/30"
      case "Avancé":
        return "bg-[oklch(0.75_0.22_150)]/20 text-[oklch(0.75_0.22_150)] border-[oklch(0.75_0.22_150)]/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const filteredSkills = filter === "Tous" ? skills : skills.filter(s => s.domain === filter)

  const totalXP = skills.reduce((sum, skill) => sum + skill.xp, 0)
  const maxTotalXP = skills.length * 1000
  const overallProgress = Math.round((totalXP / maxTotalXP) * 100)

  const badges = [
    { name: "Premier pas", unlocked: true, icon: "🎯" },
    { name: "Apprenant", unlocked: true, icon: "📚" },
    { name: "Polyvalent", unlocked: overallProgress >= 50, icon: "🌟" },
    { name: "Expert", unlocked: overallProgress >= 75, icon: "🏆" },
    { name: "Maître", unlocked: overallProgress >= 90, icon: "👑" },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-6 py-10 animate-page-enter">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">SKILLS_TRACKING</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight header-glow bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent mb-4">
            Suivi de compétences
          </h1>
          <p className="text-lg text-muted-foreground">
            Gérez et suivez votre progression dans différents domaines
          </p>
        </div>

        {/* Overall Progress */}
        <div className="glass rounded-2xl p-8 mb-8 cyber-frame">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Progression globale</h2>
              <p className="text-muted-foreground">
                {totalXP.toLocaleString()} / {maxTotalXP.toLocaleString()} XP
              </p>
            </div>
            <div className="text-5xl font-bold bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
              {overallProgress}%
            </div>
          </div>
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[oklch(0.55_0.25_240)] via-[oklch(0.65_0.2_200)] to-[oklch(0.75_0.22_150)] transition-all duration-1000 glow-subtle"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Badges */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-2xl font-bold">Badges</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className={`glass rounded-xl p-6 text-center card-hover ${
                  badge.unlocked ? "border-2 border-primary/30" : "opacity-50"
                }`}
              >
                <div className="text-4xl mb-3">{badge.icon}</div>
                <div className="text-sm font-bold">{badge.name}</div>
                {badge.unlocked && (
                  <CheckCircle className="w-4 h-4 text-[oklch(0.75_0.22_150)] mx-auto mt-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Domain Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["Tous", ...domains].map((domain) => (
            <button
              key={domain}
              onClick={() => setFilter(domain)}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
                filter === domain
                  ? "bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white glow-subtle"
                  : "glass border border-border hover:border-primary/30"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Skills Matrix */}
        <div className="glass rounded-2xl p-8 mb-8 cyber-frame">
          <h2 className="text-2xl font-bold mb-6">Matrice de compétences</h2>
          <div className="space-y-6">
            {filteredSkills.map((skill) => (
              <div key={skill.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{skill.name}</h3>
                    <p className="text-sm text-muted-foreground">{skill.domain}</p>
                  </div>
                  <div className="flex gap-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => handleLevelChange(skill.id, level)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                          skill.level === level
                            ? getLevelColor(level)
                            : "bg-muted/50 text-muted-foreground border-transparent hover:border-border"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                    {skill.level && (
                      <button
                        onClick={() => handleLevelChange(skill.id, null)}
                        className="px-4 py-2 rounded-lg text-sm font-semibold border border-transparent bg-muted/50 text-muted-foreground hover:border-destructive/30 hover:text-destructive transition-all"
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>
                </div>
                
                {/* XP Progress Bar */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          skill.level === "Avancé"
                            ? "bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)]"
                            : skill.level === "Intermédiaire"
                            ? "bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)]"
                            : "bg-[oklch(0.65_0.2_200)]"
                        }`}
                        style={{ width: `${(skill.xp / skill.maxXp) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm font-mono text-muted-foreground min-w-[100px] text-right">
                    {skill.xp} / {skill.maxXp} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-12 py-4 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle flex items-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
