"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import { Settings, User, Shield, Eye, EyeOff, Sparkles, Save, RefreshCw } from "lucide-react"

export default function ParametresPage() {
  const [usePseudonym, setUsePseudonym] = useState(false)
  const [pseudonym, setPseudonym] = useState("")
  const [realName] = useState("Jean Dupont")
  const [privateMode, setPrivateMode] = useState(false)
  const [useAIAvatar, setUseAIAvatar] = useState(false)
  const [aiAvatarStyle, setAiAvatarStyle] = useState<"abstrait" | "geometrique" | "cyberpunk" | "minimaliste">("abstrait")
  const [avatarSeed, setAvatarSeed] = useState(Math.random().toString())
  const [saved, setSaved] = useState(false)

  const avatarStyles = [
    { id: "abstrait", label: "Abstrait", color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)]" },
    { id: "geometrique", label: "Géométrique", color: "from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)]" },
    { id: "cyberpunk", label: "Cyberpunk", color: "from-[oklch(0.6_0.25_290)] to-[oklch(0.55_0.25_240)]" },
    { id: "minimaliste", label: "Minimaliste", color: "from-[oklch(0.65_0.2_200)] to-[oklch(0.75_0.22_150)]" }
  ]

  const generateNewAvatar = () => {
    setAvatarSeed(Math.random().toString())
  }

  const handleSave = () => {
    // Simuler la sauvegarde
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // Génération d'avatar basique (mock)
  const getAvatarUrl = () => {
    if (useAIAvatar) {
      return `https://api.dicebear.com/7.x/${aiAvatarStyle}/svg?seed=${avatarSeed}`
    }
    return null
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-6 py-10 animate-page-enter">
        {/* Header */}
        <div className="mb-12 relative">
          <div className="absolute top-0 right-0 text-primary/10 text-8xl font-mono">{"⚙"}</div>
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">SETTINGS</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight header-glow bg-gradient-to-r from-[oklch(0.55_0.25_240)] via-[oklch(0.65_0.2_200)] to-[oklch(0.75_0.22_150)] bg-clip-text text-transparent mb-4">
            Paramètres de confidentialité
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Gérez votre identité, votre avatar et la visibilité de votre profil
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Pseudonym Settings */}
          <div className="glass rounded-2xl p-8 cyber-frame">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Identité publique</h2>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-xl p-6 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Utiliser un pseudonyme</h3>
                    <p className="text-sm text-muted-foreground">
                      Cachez votre nom réel et utilisez un pseudonyme dans les défis
                    </p>
                  </div>
                  <button
                    onClick={() => setUsePseudonym(!usePseudonym)}
                    className={`relative w-16 h-8 rounded-full transition-all ${
                      usePseudonym ? "bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)]" : "bg-muted"
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      usePseudonym ? "translate-x-9" : "translate-x-1"
                    }`} />
                  </button>
                </div>

                {usePseudonym && (
                  <div className="animate-page-enter">
                    <label className="block text-sm font-semibold mb-2">Votre pseudonyme</label>
                    <input
                      type="text"
                      value={pseudonym}
                      onChange={(e) => setPseudonym(e.target.value)}
                      placeholder="Ex: CodeNinja92"
                      className="w-full px-4 py-3 glass rounded-xl border-2 border-primary/20 input-focus font-medium"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Nom actuel : <span className="font-semibold">{realName}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="glass rounded-xl p-6 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong>Affichage :</strong> {usePseudonym && pseudonym ? pseudonym : realName}
                </p>
              </div>
            </div>
          </div>

          {/* AI Avatar Settings */}
          <div className="glass rounded-2xl p-8 cyber-frame">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold">Avatar généré par IA</h2>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-xl p-6 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Utiliser un avatar IA</h3>
                    <p className="text-sm text-muted-foreground">
                      Générez un avatar unique et anonyme automatiquement
                    </p>
                  </div>
                  <button
                    onClick={() => setUseAIAvatar(!useAIAvatar)}
                    className={`relative w-16 h-8 rounded-full transition-all ${
                      useAIAvatar ? "bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)]" : "bg-muted"
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      useAIAvatar ? "translate-x-9" : "translate-x-1"
                    }`} />
                  </button>
                </div>

                {useAIAvatar && (
                  <div className="animate-page-enter space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-3">Style d'avatar</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {avatarStyles.map(style => (
                          <button
                            key={style.id}
                            onClick={() => setAiAvatarStyle(style.id as any)}
                            className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                              aiAvatarStyle === style.id
                                ? `bg-gradient-to-r ${style.color} text-white`
                                : "glass border-2 border-primary/20 hover:border-primary/40"
                            }`}
                          >
                            {style.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="glass rounded-xl p-6 border-2 border-primary/30 flex-shrink-0">
                        <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-[oklch(0.65_0.2_200)]/10 flex items-center justify-center">
                          {getAvatarUrl() ? (
                            <img src={getAvatarUrl()!} alt="Avatar IA" className="w-full h-full" />
                          ) : (
                            <Sparkles className="w-12 h-12 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h4 className="font-bold mb-2">Aperçu de votre avatar</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Cet avatar unique est généré automatiquement et ne révèle aucune information personnelle
                        </p>
                        <button
                          onClick={generateNewAvatar}
                          className="px-6 py-3 glass border-2 border-primary/20 rounded-xl font-semibold btn-hover hover:border-primary/40 flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Générer un nouveau
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Private Mode Settings */}
          <div className="glass rounded-2xl p-8 cyber-frame">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Mode privé</h2>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-xl p-6 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">Masquer le profil hors des duels</h3>
                      {privateMode ? (
                        <EyeOff className="w-5 h-5 text-primary" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Votre profil ne sera visible que pendant les défis actifs
                    </p>
                  </div>
                  <button
                    onClick={() => setPrivateMode(!privateMode)}
                    className={`relative w-16 h-8 rounded-full transition-all ${
                      privateMode ? "bg-gradient-to-r from-[oklch(0.6_0.25_290)] to-[oklch(0.55_0.25_240)]" : "bg-muted"
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      privateMode ? "translate-x-9" : "translate-x-1"
                    }`} />
                  </button>
                </div>

                {privateMode && (
                  <div className="bg-[oklch(0.6_0.25_290)]/10 border border-[oklch(0.6_0.25_290)]/30 rounded-lg p-4 animate-page-enter">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Mode privé activé
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.6_0.25_290)] mt-1.5 flex-shrink-0"></div>
                        <span>Profil invisible dans la recherche utilisateurs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.6_0.25_290)] mt-1.5 flex-shrink-0"></div>
                        <span>Statistiques cachées aux autres utilisateurs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.6_0.25_290)] mt-1.5 flex-shrink-0"></div>
                        <span>Visible uniquement pendant les duels en cours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.6_0.25_290)] mt-1.5 flex-shrink-0"></div>
                        <span>Historique des défis privé</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Privacy Summary */}
          <div className="glass rounded-2xl p-8 border-2 border-primary/30 bg-primary/5">
            <h3 className="font-bold text-lg mb-4">Résumé de votre configuration</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${usePseudonym ? "bg-[oklch(0.75_0.22_150)]" : "bg-muted"}`}></div>
                <span>
                  <strong>Identité :</strong> {usePseudonym && pseudonym ? `Pseudonyme "${pseudonym}"` : `Nom réel "${realName}"`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${useAIAvatar ? "bg-[oklch(0.75_0.22_150)]" : "bg-muted"}`}></div>
                <span>
                  <strong>Avatar :</strong> {useAIAvatar ? `Avatar IA généré (${aiAvatarStyle})` : "Avatar par défaut"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${privateMode ? "bg-[oklch(0.75_0.22_150)]" : "bg-muted"}`}></div>
                <span>
                  <strong>Visibilité :</strong> {privateMode ? "Profil privé" : "Profil public"}
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 px-8 py-5 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle flex items-center justify-center gap-3 text-lg"
            >
              <Save className="w-6 h-6" />
              {saved ? "Paramètres sauvegardés !" : "Sauvegarder les paramètres"}
            </button>
          </div>

          {saved && (
            <div className="glass rounded-xl p-4 border-2 border-[oklch(0.75_0.22_150)]/30 bg-[oklch(0.75_0.22_150)]/10 animate-page-enter flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[oklch(0.75_0.22_150)] flex items-center justify-center">
                <Save className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[oklch(0.75_0.22_150)]">Paramètres sauvegardés avec succès !</h4>
                <p className="text-sm text-muted-foreground">Vos préférences de confidentialité ont été mises à jour.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
