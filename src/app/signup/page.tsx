"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserPlus, Mail, Lock, User, Sparkles } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation du mot de passe
    if (formData.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }
    
    setIsLoading(true)
    
    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name
      })

      if (error?.code) {
        const errorMessages: Record<string, string> = {
          USER_ALREADY_EXISTS: "Un compte avec cet e-mail existe déjà",
          WEAK_PASSWORD: "Le mot de passe est trop faible",
          INVALID_EMAIL: "L'adresse e-mail n'est pas valide"
        }
        
        toast.error(errorMessages[error.code] || "Erreur lors de l'inscription")
        setIsLoading(false)
        return
      }

      toast.success("Compte créé avec succès ! Vous êtes maintenant connecté.")
      
      // Auto-login après inscription
      const { error: loginError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: true
      })

      if (loginError) {
        // Si auto-login échoue, rediriger vers login
        router.push("/login?registered=true")
      } else {
        // Success - rediriger vers tableau de bord
        router.push("/tableau-de-bord")
      }
    } catch (error) {
      console.error("Signup error:", error)
      toast.error("Une erreur est survenue lors de l'inscription")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <Navigation />
      
      {/* Decorative cyber elements */}
      <div className="absolute top-20 left-20 text-primary/10 text-8xl font-mono pointer-events-none">{"["}</div>
      <div className="absolute bottom-20 right-20 text-primary/10 text-8xl font-mono pointer-events-none">{"]"}</div>
      
      <div className="container mx-auto px-6 py-24 animate-page-enter">
        <div className="max-w-md mx-auto">
          <div className="glass rounded-2xl p-10 card-hover cyber-frame relative overflow-hidden">
            {/* Decorative corner number */}
            <div className="absolute top-4 right-4 text-primary/10 text-3xl font-mono">02</div>
            
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight header-glow mb-2">Inscription</h1>
              <p className="text-muted-foreground">Rejoignez la communauté des développeurs</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Nom complet
                </label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  autoComplete="name"
                  className="w-full glass border-2 border-primary/20 rounded-xl px-5 py-3.5 focus:outline-none focus:border-primary input-focus font-medium"
                  placeholder="Jean Dupont"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  E-mail
                </label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                  className="w-full glass border-2 border-primary/20 rounded-xl px-5 py-3.5 focus:outline-none focus:border-primary input-focus font-medium"
                  placeholder="votre@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Mot de passe
                </label>
                <input 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="new-password"
                  className="w-full glass border-2 border-primary/20 rounded-xl px-5 py-3.5 focus:outline-none focus:border-primary input-focus font-medium"
                  placeholder="••••••••"
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground mt-2">Minimum 8 caractères</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Confirmer le mot de passe
                </label>
                <input 
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  autoComplete="new-password"
                  className="w-full glass border-2 border-primary/20 rounded-xl px-5 py-3.5 focus:outline-none focus:border-primary input-focus font-medium"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] text-white py-4 rounded-xl font-bold disabled:opacity-50 btn-hover glow-subtle pulse-ring flex items-center justify-center gap-2 text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Inscription...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    S'inscrire
                  </>
                )}
              </button>
              
              <div className="text-center text-base text-muted-foreground pt-4">
                Vous avez déjà un compte ?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline transition-colors">
                  Se connecter
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}