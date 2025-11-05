"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogIn, Mail, Lock, Sparkles, AlertCircle } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        callbackURL: "/tableau-de-bord"
      })

      if (error?.code) {
        toast.error("E-mail ou mot de passe invalide. Veuillez vérifier vos identifiants et réessayer.")
        setIsLoading(false)
        return
      }

      toast.success("Connexion réussie !")
      router.push("/tableau-de-bord")
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Une erreur est survenue lors de la connexion")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <Navigation />
      
      {/* Decorative cyber elements */}
      <div className="absolute top-20 right-20 text-primary/10 text-8xl font-mono pointer-events-none">{"{"}</div>
      <div className="absolute bottom-20 left-20 text-primary/10 text-8xl font-mono pointer-events-none">{"}"}</div>
      
      <div className="container mx-auto px-6 py-24 animate-page-enter">
        <div className="max-w-md mx-auto">
          <div className="glass rounded-2xl p-10 card-hover cyber-frame relative overflow-hidden">
            {/* Decorative corner number */}
            <div className="absolute top-4 right-4 text-primary/10 text-3xl font-mono">01</div>
            
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight header-glow mb-2">Connexion</h1>
              <p className="text-muted-foreground">Accédez à votre espace développeur</p>
            </div>

            {/* Warning message */}
            <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Pas encore de compte ? Veuillez d'abord{" "}
                <Link href="/signup" className="text-primary font-semibold hover:underline">
                  créer un compte
                </Link>
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  autoComplete="current-password"
                  className="w-full glass border-2 border-primary/20 rounded-xl px-5 py-3.5 focus:outline-none focus:border-primary input-focus font-medium"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary focus:ring-offset-0"
                />
                <label htmlFor="rememberMe" className="text-sm font-medium text-muted-foreground cursor-pointer">
                  Se souvenir de moi
                </label>
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] text-white py-4 rounded-xl font-bold disabled:opacity-50 btn-hover glow-subtle pulse-ring flex items-center justify-center gap-2 text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connexion...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Se connecter
                  </>
                )}
              </button>
              
              <div className="text-center text-base text-muted-foreground pt-4">
                Pas encore de compte ?{" "}
                <Link href="/signup" className="text-primary font-semibold hover:underline transition-colors">
                  S'inscrire
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}