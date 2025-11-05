"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import { Search, Users, Zap } from "lucide-react"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState("Tous niveaux")
  const [languageFilter, setLanguageFilter] = useState("Tous langages")

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-6 py-10 animate-page-enter">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary tech-bracket">USER_SEARCH</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight header-glow bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
            Trouver des utilisateurs
          </h1>
        </div>
        
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass border-2 border-primary/20 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary input-focus text-lg font-medium"
              placeholder="Rechercher par nom, niveau ou langage..."
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-4 mb-12">
          <select 
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="glass border-2 border-primary/20 rounded-xl px-5 py-3 focus:outline-none focus:border-primary input-focus font-medium cursor-pointer hover:border-primary/40 transition-all"
          >
            <option>Tous niveaux</option>
            <option>Débutant</option>
            <option>Intermédiaire</option>
            <option>Avancé</option>
          </select>
          <select 
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="glass border-2 border-primary/20 rounded-xl px-5 py-3 focus:outline-none focus:border-primary input-focus font-medium cursor-pointer hover:border-primary/40 transition-all"
          >
            <option>Tous langages</option>
            <option>JavaScript</option>
            <option>Python</option>
            <option>Java</option>
          </select>
        </div>
        
        {/* Empty State */}
        <div className="glass rounded-2xl p-16 text-center">
          <Users className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Aucun utilisateur pour le moment</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Soyez parmi les premiers à rejoindre la plateforme
          </p>
          <button 
            onClick={() => window.location.href = '/signup'}
            className="px-8 py-4 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle flex items-center justify-center gap-2 mx-auto"
          >
            <Zap className="w-5 h-5" />
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  )
}