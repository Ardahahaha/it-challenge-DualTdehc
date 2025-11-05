"use client"

import { useState, useRef, useEffect } from "react"
import Navigation from "@/components/Navigation"
import UserAvatar from "@/components/UserAvatar"
import { useUserAvatar } from "@/hooks/useUserAvatar"
import { 
  User, Upload, Sparkles, Code2, Shield, Brain, Network, Server,
  Save, Eye, RotateCcw, Check, X, AlertCircle, Camera, Target, Loader2
} from "lucide-react"
import { toast } from "sonner"
import { authClient, useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

// Tech icons for avatar selection
const techIcons = [
  { id: "code", icon: Code2, label: "Code", color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)]" },
  { id: "shield", icon: Shield, label: "Cyber", color: "from-[oklch(0.6_0.25_290)] to-[oklch(0.55_0.25_240)]" },
  { id: "brain", icon: Brain, label: "IA", color: "from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)]" },
  { id: "network", icon: Network, label: "Réseau", color: "from-[oklch(0.65_0.2_200)] to-[oklch(0.55_0.25_240)]" },
  { id: "server", icon: Server, label: "SysAdmin", color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.6_0.25_290)]" },
]

const domains = ["Développement web/logiciel", "Cybersécurité", "Développement IA/ML", "Réseau", "SysAdmin"]
const levels = ["Débutant", "Intermédiaire", "Avancé", "Expert"]

export default function ProfilPage() {
  const router = useRouter()
  const { data: session, isPending: sessionPending } = useSession()
  const { avatar, updateAvatar } = useUserAvatar()
  
  // Loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Profile exists state
  const [profileExists, setProfileExists] = useState(false)
  
  // Avatar state
  const [localAvatarType, setLocalAvatarType] = useState(avatar.type)
  const [uploadedAvatar, setUploadedAvatar] = useState(avatar.uploadedImage || null)
  const [selectedTechIcon, setSelectedTechIcon] = useState(avatar.techIconId || "code")
  const [aiAvatarSeed, setAiAvatarSeed] = useState(avatar.aiSeed || Math.random().toString())
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile data state
  const [pseudo, setPseudo] = useState("")
  const [pseudoError, setPseudoError] = useState("")
  const [pseudoValid, setPseudoValid] = useState(false)
  
  const [bio, setBio] = useState("")
  const [bioError, setBioError] = useState("")
  
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [level, setLevel] = useState("Débutant")
  const [visibility, setVisibility] = useState<"public" | "private">("public")

  // Preview mode
  const [showPreview, setShowPreview] = useState(false)

  // Initial values for reset
  const [initialValues, setInitialValues] = useState({
    pseudo: "",
    bio: "",
    domains: [] as string[],
    level: "Débutant",
    visibility: "public" as "public" | "private",
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!sessionPending && !session?.user) {
      router.push("/login")
    }
  }, [session, sessionPending, router])

  // Load profile from database
  useEffect(() => {
    if (!session?.user?.id) return

    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("bearer_token")
        const response = await fetch(`/api/profiles/user/${session.user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const profile = await response.json()
          setProfileExists(true)
          
          // Set form values
          setPseudo(profile.username || "")
          setBio(profile.bio || "")
          setSelectedDomains(profile.domaines ? JSON.parse(profile.domaines) : [])
          setLevel(profile.niveau || "Débutant")
          setVisibility(profile.visibility || "public")
          
          // Set avatar if exists
          if (profile.avatarUrl) {
            setUploadedAvatar(profile.avatarUrl)
            setLocalAvatarType("upload")
          }
          
          // Set initial values for reset
          setInitialValues({
            pseudo: profile.username || "",
            bio: profile.bio || "",
            domains: profile.domaines ? JSON.parse(profile.domaines) : [],
            level: profile.niveau || "Débutant",
            visibility: profile.visibility || "public"
          })
        } else if (response.status === 404) {
          // Profile doesn't exist yet
          setProfileExists(false)
        } else {
          toast.error("Erreur lors du chargement du profil")
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        toast.error("Erreur lors du chargement du profil")
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadProfile()
  }, [session?.user?.id])

  // Sync local avatar state
  useEffect(() => {
    setLocalAvatarType(avatar.type)
    setUploadedAvatar(avatar.uploadedImage || null)
    setSelectedTechIcon(avatar.techIconId || "code")
    setAiAvatarSeed(avatar.aiSeed || Math.random().toString())
  }, [avatar])

  // Validate pseudo in real-time
  useEffect(() => {
    if (pseudo.length === 0) {
      setPseudoError("")
      setPseudoValid(false)
      return
    }

    // Length validation
    if (pseudo.length < 3 || pseudo.length > 20) {
      setPseudoError("Le pseudo doit contenir entre 3 et 20 caractères")
      setPseudoValid(false)
      return
    }

    // Format validation
    const validFormat = /^[a-zA-Z0-9._-]+$/.test(pseudo)
    if (!validFormat) {
      setPseudoError("Caractères autorisés : a-z, A-Z, 0-9, . _ -")
      setPseudoValid(false)
      return
    }

    setPseudoError("")
    setPseudoValid(true)
  }, [pseudo])

  // Validate bio
  useEffect(() => {
    if (bio.length === 0) {
      setBioError("")
      return
    }

    if (bio.length > 500) {
      setBioError("Maximum 500 caractères dépassé")
      return
    }

    setBioError("")
  }, [bio])

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
      toast.error("Format non supporté", {
        description: "Veuillez uploader une image PNG ou JPG"
      })
      return
    }

    // Check file size (2 MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Fichier trop volumineux", {
        description: "La taille maximale est de 2 Mo"
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedAvatar(reader.result as string)
      setLocalAvatarType("upload")
      toast.success("Avatar uploadé avec succès")
    }
    reader.readAsDataURL(file)
  }

  const generateNewAIAvatar = () => {
    const newSeed = Math.random().toString()
    setAiAvatarSeed(newSeed)
    setLocalAvatarType("ai")
    toast.success("Nouvel avatar IA généré")
  }

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter(d => d !== domain))
    } else {
      setSelectedDomains([...selectedDomains, domain])
    }
  }

  const handleSave = async () => {
    // Validation
    if (!pseudoValid || pseudo.length === 0) {
      toast.error("Pseudo invalide", {
        description: "Veuillez entrer un pseudo valide"
      })
      return
    }

    if (bio.length > 500) {
      toast.error("Bio trop longue", {
        description: "La bio doit contenir maximum 500 caractères"
      })
      return
    }

    if (selectedDomains.length === 0) {
      toast.error("Aucun domaine sélectionné", {
        description: "Veuillez choisir au moins un domaine d'expertise"
      })
      return
    }

    setIsSaving(true)

    try {
      const token = localStorage.getItem("bearer_token")
      
      // Prepare data
      const profileData = {
        username: pseudo,
        avatarUrl: localAvatarType === "upload" ? uploadedAvatar : null,
        bio: bio || null,
        domaines: selectedDomains,
        niveau: level,
        visibility: visibility
      }

      // Create or update profile
      const method = profileExists ? "PUT" : "POST"
      const response = await fetch("/api/profiles", {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.code === "USERNAME_EXISTS") {
          toast.error("Ce pseudo est déjà pris")
        } else {
          toast.error(error.error || "Erreur lors de la sauvegarde")
        }
        setIsSaving(false)
        return
      }

      const savedProfile = await response.json()
      
      // Update local state
      setProfileExists(true)
      setInitialValues({
        pseudo: savedProfile.username,
        bio: savedProfile.bio || "",
        domains: savedProfile.domaines ? JSON.parse(savedProfile.domaines) : [],
        level: savedProfile.niveau,
        visibility: savedProfile.visibility
      })

      // Save avatar to global state
      updateAvatar({
        type: localAvatarType,
        uploadedImage: localAvatarType === "upload" ? uploadedAvatar || undefined : undefined,
        aiSeed: localAvatarType === "ai" ? aiAvatarSeed : undefined,
        techIconId: localAvatarType === "tech" ? selectedTechIcon : undefined
      })

      toast.success("Profil sauvegardé !", {
        description: "Vos modifications ont été enregistrées avec succès"
      })
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Une erreur est survenue lors de la sauvegarde")
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setPseudo(initialValues.pseudo)
    setBio(initialValues.bio)
    setSelectedDomains(initialValues.domains)
    setLevel(initialValues.level)
    setVisibility(initialValues.visibility)
    
    // Reset avatar
    setLocalAvatarType(avatar.type)
    setUploadedAvatar(avatar.uploadedImage || null)
    setSelectedTechIcon(avatar.techIconId || "code")
    setAiAvatarSeed(avatar.aiSeed || Math.random().toString())
    
    toast.info("Profil réinitialisé")
  }

  const getCurrentAvatar = () => {
    return {
      type: localAvatarType,
      uploadedImage: uploadedAvatar || undefined,
      aiSeed: aiAvatarSeed,
      techIconId: selectedTechIcon
    }
  }

  // Loading state
  if (sessionPending || isLoadingProfile) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-6 py-24 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement du profil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  if (showPreview) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-6 py-10 animate-page-enter">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Aperçu du profil</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-3 glass border-2 border-primary/20 rounded-xl font-semibold btn-hover hover:border-primary/40 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Fermer l'aperçu
              </button>
            </div>

            <div className="glass rounded-2xl p-8 cyber-frame">
              <div className="flex items-start gap-6 mb-6">
                <UserAvatar avatar={getCurrentAvatar()} size="xl" className="flex-shrink-0 border-4 border-primary/30" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-3xl font-bold">{pseudo}</h3>
                    {visibility === "private" && (
                      <div className="px-3 py-1 bg-[oklch(0.6_0.25_290)]/20 border border-[oklch(0.6_0.25_290)]/30 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        PRIVÉ
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg inline-block mb-3">
                    <span className="text-sm font-bold text-primary">{level}</span>
                  </div>
                  {bio && (
                    <p className="text-muted-foreground leading-relaxed">{bio}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-border/50 pt-6">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">
                  Domaines d'expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDomains.map(domain => (
                    <div
                      key={domain}
                      className="px-4 py-2 glass border-2 border-primary/30 rounded-xl font-semibold text-sm"
                    >
                      {domain}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-6 py-10 animate-page-enter">
        {/* Header */}
        <div className="mb-12 relative">
          <div className="absolute top-0 right-0 text-primary/10 text-8xl font-mono">{"👤"}</div>
          <div className="flex items-center gap-3 mb-4">
            <User className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">PROFILE_EDITOR</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight header-glow bg-gradient-to-r from-[oklch(0.55_0.25_240)] via-[oklch(0.65_0.2_200)] to-[oklch(0.75_0.22_150)] bg-clip-text text-transparent mb-4">
            Mon profil
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Personnalisez votre profil et gérez votre présence sur la plateforme
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Avatar Section */}
          <div className="glass rounded-2xl p-8 cyber-frame">
            <div className="flex items-center gap-3 mb-6">
              <Camera className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Photo de profil</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Avatar Preview */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-muted-foreground">Aperçu</label>
                <div className="flex justify-center">
                  <UserAvatar avatar={getCurrentAvatar()} size="xl" className="border-4 border-primary/30" />
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  {localAvatarType === "placeholder" && "Silhouette par défaut"}
                  {localAvatarType === "upload" && "Image personnalisée"}
                  {localAvatarType === "ai" && "Avatar généré par IA"}
                  {localAvatarType === "tech" && "Icône technique"}
                </p>
              </div>

              {/* Avatar Options */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3">Type d'avatar</label>
                  <div className="space-y-3">
                    {/* Placeholder Option */}
                    <button
                      onClick={() => setLocalAvatarType("placeholder")}
                      className={`w-full px-6 py-4 rounded-xl font-semibold transition-all text-left flex items-center gap-3 ${
                        localAvatarType === "placeholder"
                          ? "bg-gradient-to-r from-muted to-muted-foreground/20 text-foreground border-2 border-primary/40"
                          : "glass border-2 border-primary/20 hover:border-primary/40"
                      }`}
                    >
                      <User className="w-5 h-5" />
                      <div>
                        <div className="font-bold">Silhouette par défaut</div>
                        <div className="text-xs opacity-80">Avatar anonyme</div>
                      </div>
                    </button>

                    {/* Upload Option */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full px-6 py-4 rounded-xl font-semibold transition-all text-left flex items-center gap-3 ${
                        localAvatarType === "upload"
                          ? "bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white"
                          : "glass border-2 border-primary/20 hover:border-primary/40"
                      }`}
                    >
                      <Upload className="w-5 h-5" />
                      <div>
                        <div className="font-bold">Upload personnalisé</div>
                        <div className="text-xs opacity-80">PNG/JPG, max 2 Mo</div>
                      </div>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />

                    {/* AI Avatar Option */}
                    <button
                      onClick={generateNewAIAvatar}
                      className={`w-full px-6 py-4 rounded-xl font-semibold transition-all text-left flex items-center gap-3 ${
                        localAvatarType === "ai"
                          ? "bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] text-white"
                          : "glass border-2 border-primary/20 hover:border-primary/40"
                      }`}
                    >
                      <Sparkles className="w-5 h-5" />
                      <div>
                        <div className="font-bold">Avatar IA</div>
                        <div className="text-xs opacity-80">Généré automatiquement</div>
                      </div>
                    </button>

                    {/* Tech Icon Option */}
                    <div
                      className={`w-full px-6 py-4 rounded-xl transition-all ${
                        localAvatarType === "tech"
                          ? "bg-gradient-to-r from-[oklch(0.6_0.25_290)] to-[oklch(0.55_0.25_240)] text-white"
                          : "glass border-2 border-primary/20"
                      }`}
                    >
                      <div className="font-bold mb-3 flex items-center gap-2">
                        <Code2 className="w-5 h-5" />
                        Icône tech
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {techIcons.map(({ id, icon: Icon, label, color }) => (
                          <button
                            key={id}
                            onClick={() => {
                              setSelectedTechIcon(id)
                              setLocalAvatarType("tech")
                            }}
                            className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                              selectedTechIcon === id && localAvatarType === "tech"
                                ? `bg-gradient-to-br ${color}`
                                : "glass hover:scale-110"
                            }`}
                            title={label}
                          >
                            <Icon className={`w-6 h-6 ${selectedTechIcon === id && localAvatarType === "tech" ? "text-white" : "text-primary"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pseudo Section */}
          <div className="glass rounded-2xl p-8 cyber-frame">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Pseudo</h2>
            </div>

            <div className="max-w-2xl space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Votre pseudo</label>
                <div className="relative">
                  <input
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    className={`w-full px-4 py-3 glass rounded-xl border-2 input-focus font-medium pr-12 ${
                      pseudo.length > 0
                        ? pseudoValid
                          ? "border-[oklch(0.75_0.22_150)]"
                          : "border-red-500"
                        : "border-primary/20"
                    }`}
                    placeholder="Ex: CodeMaster92"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {pseudo.length > 0 && (
                      pseudoValid ? (
                        <Check className="w-5 h-5 text-[oklch(0.75_0.22_150)]" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )
                    )}
                  </div>
                </div>
                {pseudoError && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <span>{pseudoError}</span>
                  </div>
                )}
                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${pseudo.length >= 3 && pseudo.length <= 20 ? "bg-[oklch(0.75_0.22_150)]" : "bg-muted"}`}></div>
                    <span>3 à 20 caractères</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${/^[a-zA-Z0-9._-]*$/.test(pseudo) ? "bg-[oklch(0.75_0.22_150)]" : "bg-muted"}`}></div>
                    <span>Lettres, chiffres, . _ - uniquement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${pseudo.length > 0 && pseudoValid ? "bg-[oklch(0.75_0.22_150)]" : "bg-muted"}`}></div>
                    <span>Pseudo disponible et conforme</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="glass rounded-2xl p-8 cyber-frame">
            <div className="flex items-center gap-3 mb-6">
              <Code2 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Biographie</h2>
            </div>

            <div className="max-w-2xl space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold">Parlez de vous (optionnel)</label>
                  <span className={`text-sm font-mono ${
                    bio.length <= 500
                      ? "text-muted-foreground"
                      : "text-red-500"
                  }`}>
                    {bio.length}/500
                  </span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`w-full px-4 py-3 glass rounded-xl border-2 input-focus font-medium resize-none ${
                    bio.length > 500
                      ? "border-red-500"
                      : "border-primary/20"
                  }`}
                  rows={4}
                  placeholder="Décrivez votre parcours, vos passions tech, vos objectifs..."
                />
                {bioError && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <span>{bioError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Domains Section */}
          <div className="glass rounded-2xl p-8 cyber-frame">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Domaines d'expertise</h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Sélectionnez vos domaines de compétences (un ou plusieurs)
              </p>
              <div className="flex flex-wrap gap-3">
                {domains.map(domain => (
                  <button
                    key={domain}
                    onClick={() => toggleDomain(domain)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      selectedDomains.includes(domain)
                        ? "bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white"
                        : "glass border-2 border-primary/20 hover:border-primary/40"
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
              {selectedDomains.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>Veuillez sélectionner au moins un domaine</span>
                </div>
              )}
            </div>
          </div>

          {/* Level Section */}
          <div className="glass rounded-2xl p-8 cyber-frame">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Niveau</h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Indiquez votre niveau général en IT
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {levels.map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setLevel(lvl)}
                    className={`px-6 py-4 rounded-xl font-semibold transition-all ${
                      level === lvl
                        ? "bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] text-white"
                        : "glass border-2 border-primary/20 hover:border-primary/40"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visibility Section */}
          <div className="glass rounded-2xl p-8 cyber-frame">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Visibilité du profil</h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Contrôlez qui peut voir votre profil
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setVisibility("public")}
                  className={`px-6 py-4 rounded-xl font-semibold transition-all text-left ${
                    visibility === "public"
                      ? "bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white"
                      : "glass border-2 border-primary/20 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="w-5 h-5" />
                    <span className="font-bold">Public</span>
                  </div>
                  <p className="text-sm opacity-80">
                    Visible par tous les utilisateurs de la plateforme
                  </p>
                </button>

                <button
                  onClick={() => setVisibility("private")}
                  className={`px-6 py-4 rounded-xl font-semibold transition-all text-left ${
                    visibility === "private"
                      ? "bg-gradient-to-r from-[oklch(0.6_0.25_290)] to-[oklch(0.55_0.25_240)] text-white"
                      : "glass border-2 border-primary/20 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-bold">Privé</span>
                  </div>
                  <p className="text-sm opacity-80">
                    Masqué en dehors des duels actifs
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-8 py-5 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle flex items-center justify-center gap-3 text-lg disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  Enregistrer
                </>
              )}
            </button>
            
            <button
              onClick={() => setShowPreview(true)}
              disabled={isSaving}
              className="flex-1 px-8 py-5 glass border-2 border-primary/20 rounded-xl font-bold btn-hover hover:border-primary/40 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
            >
              <Eye className="w-6 h-6" />
              Aperçu
            </button>
            
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="px-8 py-5 glass border-2 border-border rounded-xl font-bold btn-hover hover:border-red-500/40 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
            >
              <RotateCcw className="w-6 h-6" />
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}