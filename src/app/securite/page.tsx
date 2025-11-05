"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import { Shield, CheckCircle, FileText, AlertTriangle, UserCheck, Flag } from "lucide-react"

export default function Securite() {
  const [identityVerified, setIdentityVerified] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportDetails, setReportDetails] = useState("")
  const [showReportForm, setShowReportForm] = useState(false)

  const handleVerification = () => {
    setIdentityVerified(true)
    alert("Demande de vérification envoyée. Vous recevrez une confirmation sous 24h.")
  }

  const handleReport = () => {
    if (reportReason && reportDetails) {
      alert("Signalement envoyé. Notre équipe l'examinera dans les plus brefs délais.")
      setShowReportForm(false)
      setReportReason("")
      setReportDetails("")
    }
  }

  return (
    <div className="min-h-screen animate-page-enter">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">SECURITE_CONFIANCE</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight header-glow">
            <span className="bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
              Sécurité & Confiance
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Un environnement sûr et respectueux pour tous
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Identity Verification */}
          <div className="glass rounded-2xl p-8 cyber-frame">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Vérification d'identité</h2>
                <p className="text-sm text-muted-foreground">Optionnelle</p>
              </div>
            </div>

            {!identityVerified ? (
              <>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold mb-1">Badge de confiance</div>
                      <div className="text-sm text-muted-foreground">
                        Obtenez un badge vérifié visible sur votre profil
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold mb-1">Augmentez votre crédibilité</div>
                      <div className="text-sm text-muted-foreground">
                        Les utilisateurs vérifiés inspirent plus de confiance
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold mb-1">Processus simple</div>
                      <div className="text-sm text-muted-foreground">
                        Carte d'identité ou passeport, traitement sous 24h
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[oklch(0.65_0.2_40)]/10 border border-[oklch(0.65_0.2_40)]/30 rounded-lg mb-6">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-[oklch(0.65_0.2_40)] mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-semibold text-[oklch(0.65_0.2_40)] mb-1">Protection de la vie privée</div>
                      <div className="text-muted-foreground">
                        Vos documents sont cryptés et ne sont jamais partagés. 
                        Seul un badge de vérification apparaîtra sur votre profil.
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleVerification}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-semibold btn-hover glow-subtle"
                >
                  Commencer la vérification
                </button>
              </>
            ) : (
              <div className="p-6 bg-[oklch(0.75_0.22_150)]/10 border border-[oklch(0.75_0.22_150)]/30 rounded-lg text-center">
                <CheckCircle className="w-16 h-16 text-[oklch(0.75_0.22_150)] mx-auto mb-4" />
                <div className="text-lg font-semibold mb-2">Demande envoyée</div>
                <div className="text-sm text-muted-foreground">
                  Vous recevrez une confirmation par email sous 24h
                </div>
              </div>
            )}
          </div>

          {/* Code of Conduct */}
          <div className="glass rounded-2xl p-8 cyber-frame">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.6_0.25_290)] to-[oklch(0.75_0.22_150)] flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Code de conduite mentorat</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">1.</span>
                  Respect mutuel
                </div>
                <div className="text-sm text-muted-foreground">
                  Traitez tous les participants avec courtoisie et professionnalisme
                </div>
              </div>

              <div className="p-4 bg-background rounded-lg">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">2.</span>
                  Patience et bienveillance
                </div>
                <div className="text-sm text-muted-foreground">
                  Encouragez l'apprentissage, célébrez les progrès, soyez patient avec les erreurs
                </div>
              </div>

              <div className="p-4 bg-background rounded-lg">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">3.</span>
                  Pas de harcèlement
                </div>
                <div className="text-sm text-muted-foreground">
                  Tout comportement discriminatoire, offensant ou inapproprié est interdit
                </div>
              </div>

              <div className="p-4 bg-background rounded-lg">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">4.</span>
                  Partage constructif
                </div>
                <div className="text-sm text-muted-foreground">
                  Partagez vos connaissances de manière constructive, acceptez les feedbacks
                </div>
              </div>

              <div className="p-4 bg-background rounded-lg">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">5.</span>
                  Confidentialité
                </div>
                <div className="text-sm text-muted-foreground">
                  Respectez la vie privée des autres, ne partagez pas leurs informations
                </div>
              </div>

              <div className="p-4 bg-background rounded-lg">
                <div className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">6.</span>
                  Signaler les problèmes
                </div>
                <div className="text-sm text-muted-foreground">
                  Si vous observez un comportement inapproprié, signalez-le immédiatement
                </div>
              </div>
            </div>

            <button className="w-full mt-6 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-all">
              Lire le code complet
            </button>
          </div>
        </div>

        {/* Report Button */}
        <div className="mt-8 glass rounded-2xl p-8 cyber-frame">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.58_0.24_20)] to-[oklch(0.55_0.25_240)] flex items-center justify-center">
              <Flag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Signalement simple</h2>
              <p className="text-sm text-muted-foreground">Rapportez tout comportement inapproprié</p>
            </div>
          </div>

          {!showReportForm ? (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-muted-foreground mb-4">
                  Notre équipe de modération examine tous les signalements dans les 24 heures. 
                  Votre signalement est confidentiel et anonyme.
                </p>
              </div>
              <button
                onClick={() => setShowReportForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-[oklch(0.58_0.24_20)] to-[oklch(0.55_0.25_240)] text-white rounded-xl font-semibold btn-hover glow-subtle flex items-center gap-2 ml-6"
              >
                <Flag className="w-5 h-5" />
                Faire un signalement
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Type de problème</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Sélectionner...</option>
                  <option value="harassment">Harcèlement</option>
                  <option value="inappropriate">Contenu inapproprié</option>
                  <option value="spam">Spam</option>
                  <option value="cheating">Triche</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Détails</label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Décrivez le problème en détail..."
                  className="w-full h-32 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <div className="p-3 bg-[oklch(0.65_0.2_40)]/10 border border-[oklch(0.65_0.2_40)]/30 rounded-lg">
                <div className="flex items-start gap-2 text-sm">
                  <Shield className="w-4 h-4 text-[oklch(0.65_0.2_40)] mt-0.5 flex-shrink-0" />
                  <div className="text-muted-foreground">
                    Votre signalement est confidentiel. Nous ne partagerons pas votre identité avec la personne signalée.
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReport}
                  disabled={!reportReason || !reportDetails}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[oklch(0.58_0.24_20)] to-[oklch(0.55_0.25_240)] text-white rounded-lg font-semibold btn-hover glow-subtle disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Envoyer le signalement
                </button>
                <button
                  onClick={() => setShowReportForm(false)}
                  className="px-6 py-3 bg-border text-foreground rounded-lg font-medium btn-hover"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
