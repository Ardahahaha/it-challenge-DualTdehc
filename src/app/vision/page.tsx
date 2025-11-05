"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import { Award, GraduationCap, Building2, Briefcase, Star, CheckCircle, Trophy, Target } from "lucide-react"

const certifications = [
  {
    id: "dev-fundamentals",
    name: "Développeur Fundamentals",
    domain: "Développement",
    level: "Débutant",
    requirements: ["10 défis complétés", "3 sessions de mentorat", "Score moyen > 75%"],
    progress: 80,
    icon: "🎯"
  },
  {
    id: "cyber-essentials",
    name: "Cybersécurité Essentials",
    domain: "Cybersécurité",
    level: "Intermédiaire",
    requirements: ["5 CTF complétés", "15 défis sécurité", "Projet final validé"],
    progress: 45,
    icon: "🛡️"
  },
  {
    id: "ai-practitioner",
    name: "AI Practitioner",
    domain: "IA / ML",
    level: "Intermédiaire",
    requirements: ["8 projets ML", "2 modèles déployés", "Peer review validé"],
    progress: 60,
    icon: "🤖"
  }
]

const partnerships = [
  {
    name: "École 42",
    type: "École d'ingénieurs",
    status: "Partenariat actif",
    benefits: ["Reconnaissance de crédits", "Accès prioritaire"],
    logo: "42"
  },
  {
    name: "Le Wagon",
    type: "Bootcamp",
    status: "En discussion",
    benefits: ["Modules complémentaires", "Mentorat croisé"],
    logo: "LW"
  },
  {
    name: "Wild Code School",
    type: "Bootcamp",
    status: "Partenariat actif",
    benefits: ["Projets conjoints", "Stages facilitéś"],
    logo: "WCS"
  }
]

export default function Vision() {
  const [selectedCert, setSelectedCert] = useState<typeof certifications[0] | null>(null)

  return (
    <div className="min-h-screen animate-page-enter">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">VISION_BUSINESS</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight header-glow">
            <span className="bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
              Vision & Partenariats
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Construire l'avenir de l'apprentissage technique
          </p>
        </div>

        {/* Internal Certification Program */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Programme de certification interne</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className="glass rounded-2xl p-6 cyber-frame card-hover cursor-pointer"
              >
                <div className="text-4xl mb-4">{cert.icon}</div>
                <h3 className="text-xl font-bold mb-2">{cert.name}</h3>
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    {cert.domain}
                  </span>
                  <span className="px-2 py-1 bg-[oklch(0.6_0.25_290)]/10 text-[oklch(0.6_0.25_290)] text-xs rounded">
                    {cert.level}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {cert.requirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-semibold">{cert.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] transition-all"
                      style={{ width: `${cert.progress}%` }}
                    />
                  </div>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-all">
                  Voir les détails
                </button>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Trophy className="w-12 h-12 text-[oklch(0.75_0.22_150)]" />
              <div>
                <h3 className="text-xl font-bold mb-2">Badges validés par l'industrie</h3>
                <p className="text-muted-foreground mb-4">
                  Nos certifications sont reconnues par les employeurs tech et peuvent être partagées sur LinkedIn et votre CV. 
                  Chaque badge est vérifié et comporte un identifiant unique pour authentification.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-[oklch(0.75_0.22_150)]/10 text-[oklch(0.75_0.22_150)] text-sm rounded border border-[oklch(0.75_0.22_150)]/30">
                    Vérifiable
                  </span>
                  <span className="px-3 py-1 bg-[oklch(0.75_0.22_150)]/10 text-[oklch(0.75_0.22_150)] text-sm rounded border border-[oklch(0.75_0.22_150)]/30">
                    Partageable
                  </span>
                  <span className="px-3 py-1 bg-[oklch(0.75_0.22_150)]/10 text-[oklch(0.75_0.22_150)] text-sm rounded border border-[oklch(0.75_0.22_150)]/30">
                    Reconnu
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* School Partnerships */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Partenariats écoles & bootcamps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerships.map((partner, i) => (
              <div key={i} className="glass rounded-2xl p-6 cyber-frame">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] flex items-center justify-center text-white font-bold text-lg">
                    {partner.logo}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    partner.status === "Partenariat actif"
                      ? "bg-[oklch(0.75_0.22_150)]/20 text-[oklch(0.75_0.22_150)]"
                      : "bg-[oklch(0.65_0.2_40)]/20 text-[oklch(0.65_0.2_40)]"
                  }`}>
                    {partner.status}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{partner.type}</p>

                <div className="space-y-2">
                  <div className="text-sm font-semibold mb-2">Avantages :</div>
                  {partner.benefits.map((benefit, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Devenez partenaire</h3>
                <p className="text-muted-foreground">
                  Écoles, bootcamps et universités : rejoignez notre réseau de partenaires officiels
                </p>
              </div>
              <button className="px-8 py-4 bg-primary text-white rounded-xl font-semibold btn-hover glow-subtle whitespace-nowrap ml-6">
                Nous contacter
              </button>
            </div>
          </div>
        </div>

        {/* Enterprise Version */}
        <div className="glass rounded-2xl p-8 cyber-frame">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[oklch(0.6_0.25_290)] to-[oklch(0.75_0.22_150)] flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Future version entreprise</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Une plateforme dédiée pour former vos équipes techniques et suivre leur progression
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-background rounded-lg">
                  <Building2 className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-bold mb-2">Formations personnalisées</h3>
                  <p className="text-sm text-muted-foreground">
                    Créez des parcours adaptés aux besoins spécifiques de votre entreprise
                  </p>
                </div>

                <div className="p-4 bg-background rounded-lg">
                  <Target className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-bold mb-2">Suivi analytique</h3>
                  <p className="text-sm text-muted-foreground">
                    Dashboards détaillés de la progression de vos équipes
                  </p>
                </div>

                <div className="p-4 bg-background rounded-lg">
                  <GraduationCap className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-bold mb-2">Mentors internes</h3>
                  <p className="text-sm text-muted-foreground">
                    Système de mentorat entre collaborateurs
                  </p>
                </div>

                <div className="p-4 bg-background rounded-lg">
                  <Award className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-bold mb-2">Certifications privées</h3>
                  <p className="text-sm text-muted-foreground">
                    Créez vos propres badges et certifications internes
                  </p>
                </div>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <Trophy className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-primary mb-1">Bêta ouverte Q2 2025</div>
                    <div className="text-sm">
                      Inscrivez-vous dès maintenant pour tester la version entreprise en avant-première 
                      et bénéficier de tarifs préférentiels
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-semibold btn-hover glow-subtle">
                  Rejoindre la liste d'attente
                </button>
                <button className="px-8 py-4 bg-border text-foreground rounded-xl font-semibold btn-hover">
                  En savoir plus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
