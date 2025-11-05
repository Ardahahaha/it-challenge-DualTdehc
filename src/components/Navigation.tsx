"use client"

import Link from "next/link"
import XPBar from "./XPBar"
import DarkModeToggle from "./DarkModeToggle"
import UserAvatarButton from "./UserAvatarButton"
import { Terminal, Sparkles, Menu, X, Zap, Home, Users, Target, Code2, Trophy, Brain, Shield, MessageSquare, Calendar, Handshake, Video, Coffee, Star, Network, Lock, Eye, TrendingUp, History, PlayCircle, Settings, FileText, UserCircle, UserCheck, LogOut } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { authClient, useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDarkMode()
    
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    return () => observer.disconnect()
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
      // Focus first element when menu opens
      setTimeout(() => firstFocusableRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  // Close menu on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isMenuOpen])

  // Focus trap inside menu
  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return

    const focusableElements = menuRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener("keydown", handleTab)
    return () => document.removeEventListener("keydown", handleTab)
  }, [isMenuOpen])

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token")

    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
    
    if (error?.code) {
      toast.error("Erreur lors de la déconnexion")
    } else {
      localStorage.removeItem("bearer_token")
      refetch()
      router.push("/")
      toast.success("Déconnexion réussie")
      setIsMenuOpen(false)
    }
  }

  // Top navigation links
  const mainNavLinks = [
    { href: "/dashboard", label: "Tableau de bord", icon: Home },
  ]

  // Organized navigation structure with icons
  const navSections = [
    {
      title: "Essentiel",
      icon: Home,
      links: [
        { href: "/dashboard", label: "Tableau de bord", icon: Home },
        { href: "/profil", label: "Mon profil", icon: UserCircle },
        { href: "/profils", label: "Profils", icon: UserCheck },
        { href: "/users", label: "Utilisateurs", icon: Users },
        { href: "/progression", label: "Progression", icon: TrendingUp },
        { href: "/skills-tracking", label: "Suivi de compétences", icon: Target },
        { href: "/historique", label: "Historique détaillé", icon: History },
      ]
    },
    {
      title: "Défis & Modes",
      icon: Zap,
      links: [
        { href: "/realtime-1v1", label: "1v1 en temps réel", icon: Zap },
        { href: "/mode-solo", label: "Mode Solo", icon: PlayCircle },
        { href: "/preparation", label: "Échauffement", icon: Brain },
        { href: "/modes-challenge", label: "Modes de challenge", icon: Trophy },
        { href: "/challenge/1", label: "Défis classiques", icon: Code2 },
      ]
    },
    {
      title: "Apprentissage",
      icon: Brain,
      links: [
        { href: "/salles", label: "Salles thématiques", icon: MessageSquare },
        { href: "/salles-publiques", label: "Salles publiques", icon: Coffee },
        { href: "/assistant-ia", label: "Assistant IA", icon: Brain },
        { href: "/gamification", label: "Progression & XP", icon: Trophy },
      ]
    },
    {
      title: "Communauté",
      icon: Users,
      links: [
        { href: "/communautes", label: "Communautés", icon: Users },
        { href: "/evenements", label: "Événements", icon: Calendar },
        { href: "/matchmaking", label: "Matchmaking", icon: Target },
      ]
    },
    {
      title: "Sessions",
      icon: Video,
      links: [
        { href: "/1v1-presentiel", label: "1v1 Présentiel", icon: Handshake },
        { href: "/1v1-distanciel", label: "1v1 Distanciel", icon: Video },
      ]
    },
    {
      title: "Plateforme",
      icon: Network,
      links: [
        { href: "/vision", label: "Vision & Certifications", icon: Eye },
        { href: "/securite", label: "Sécurité & Confiance", icon: Lock },
        { href: "/parametres", label: "Paramètres", icon: Settings },
      ]
    }
  ]

  // Quick actions
  const quickActions = [
    { href: "/1v1-distanciel", label: "1v1 Distanciel", icon: Zap },
    { href: "/1v1-presentiel", label: "1v1 Présentiel", icon: Terminal },
  ]

  return (
    <>
      <nav className="glass border-b border-primary/20 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex h-22 md:h-[140px] items-center justify-between gap-4 md:gap-6">
            {/* Logo - Text Version with NEW violet gradient */}
            <Link href="/" className="flex items-center nav-link group flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-[oklch(0.6_0.25_280)] via-[oklch(0.5_0.22_285)] to-[oklch(0.4_0.2_290)] bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                DualTech.1V1
              </h1>
            </Link>

            {/* Desktop: Horizontal Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 flex-shrink-0 ml-auto mr-auto">
              {mainNavLinks.map((link) => {
                const LinkIcon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground nav-link rounded-lg hover:bg-primary/5 transition-all group"
                  >
                    <LinkIcon className="w-4 h-4 text-primary/70 group-hover:text-primary group-hover:scale-110 transition-all" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right side: XPBar + Auth Buttons + Avatar + Dark Mode + Menu Button */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              {/* Desktop: XPBar + Auth Buttons or User Info */}
              <div className="hidden md:flex items-center gap-3">
                <XPBar />
                {!isPending && (
                  <>
                    {session?.user ? (
                      // Authenticated state
                      <div className="flex items-center gap-3">
                        <Link 
                          href="/profil" 
                          className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary nav-link flex items-center gap-2"
                        >
                          <UserCircle className="w-4 h-4" />
                          {session.user.name}
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-destructive nav-link flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Déconnexion
                        </button>
                      </div>
                    ) : (
                      // Not authenticated state with NEW violet gradient
                      <div className="flex gap-2">
                        <Link href="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground nav-link">
                          Connexion
                        </Link>
                        <Link href="/signup" className="px-4 py-2.5 text-sm bg-gradient-to-r from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] text-white rounded-lg font-semibold btn-hover glow-subtle flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          S'inscrire
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* User Avatar Button */}
              <UserAvatarButton />

              {/* Dark Mode Toggle */}
              <DarkModeToggle />

              {/* Menu Button - Always visible */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2.5 rounded-lg hover:bg-primary/10 transition-all text-foreground border border-primary/20 hover:border-primary/40"
                aria-label="Ouvrir le menu"
                aria-expanded={isMenuOpen}
                aria-controls="fullscreen-menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-Screen Overlay Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          id="fullscreen-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation principal"
          className="fixed inset-0 z-[100] flex items-start justify-center animate-menu-fade-in"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/95 backdrop-blur-2xl"
            style={{
              background: "linear-gradient(135deg, var(--background) 0%, oklch(from var(--background) calc(l * 0.98) c h) 100%)"
            }}
          />

          {/* Menu Content */}
          <div className="relative w-full h-full overflow-y-auto">
            <div className="container mx-auto px-6 py-8">
              {/* Top Bar: Close Button */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <Terminal className="w-6 h-6 text-primary animate-pulse" />
                  <span className="text-sm font-mono text-primary tech-bracket">NAVIGATION</span>
                </div>
                <button
                  ref={firstFocusableRef}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2.5 rounded-lg hover:bg-primary/10 transition-all text-foreground border border-primary/20 hover:border-primary/40"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions with NEW violet gradients */}
              <div className="mb-12">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Actions rapides
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="glass rounded-xl p-6 hover:bg-primary/5 transition-all group border border-primary/20 hover:border-primary/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-semibold">{action.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Navigation Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {navSections.map((section, i) => {
                  const SectionIcon = section.icon
                  return (
                    <div 
                      key={i} 
                      className="space-y-4 animate-menu-slide-down"
                      style={{ animationDelay: `${0.15 + i * 0.05}s` }}
                    >
                      <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                        <SectionIcon className="w-4 h-4" />
                        {section.title}
                      </h3>
                      <div className="space-y-1">
                        {section.links.map((link) => {
                          const LinkIcon = link.icon
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg transition-all hover:translate-x-1 border border-transparent hover:border-primary/20 group"
                            >
                              <LinkIcon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                              {link.label}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Mobile: Auth Buttons with NEW violet gradient */}
              <div className="md:hidden border-t border-border/50 pt-8 space-y-3 animate-menu-slide-down" style={{ animationDelay: "0.4s" }}>
                {!isPending && (
                  <>
                    {session?.user ? (
                      // Authenticated state
                      <>
                        <Link
                          href="/profil"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full px-6 py-3 text-base font-medium text-center text-foreground border border-border rounded-lg transition-all hover:bg-primary/5 flex items-center justify-center gap-2"
                        >
                          <UserCircle className="w-4 h-4" />
                          Mon profil
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full px-6 py-3 text-base font-medium text-center text-muted-foreground hover:text-destructive border border-border rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Déconnexion
                        </button>
                      </>
                    ) : (
                      // Not authenticated state with NEW violet gradient
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full px-6 py-3 text-base font-medium text-center text-muted-foreground hover:text-foreground border border-border rounded-lg transition-all"
                        >
                          Connexion
                        </Link>
                        <Link
                          href="/signup"
                          onClick={() => setIsMenuOpen(false)}
                          className="block w-full px-6 py-3 text-base bg-gradient-to-r from-[oklch(0.6_0.25_280)] to-[oklch(0.5_0.22_285)] text-white rounded-lg font-semibold btn-hover glow-subtle flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          S'inscrire
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}