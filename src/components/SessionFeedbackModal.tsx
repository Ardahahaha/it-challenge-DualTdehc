"use client"

import { useEffect } from "react"

interface SessionFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  result: "win" | "loss" | "draw"
  score: number
  opponentName: string
}

export const SessionFeedbackModal = ({ isOpen, onClose, result, score, opponentName }: SessionFeedbackModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const resultConfig = {
    win: {
      title: "🎉 Victoire !",
      color: "text-primary",
      bgColor: "bg-primary/10",
      message: "Félicitations ! Vous avez remporté ce défi."
    },
    loss: {
      title: "😔 Défaite",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      message: "Pas de chance cette fois. Continuez à vous entraîner !"
    },
    draw: {
      title: "🤝 Égalité",
      color: "text-muted-foreground",
      bgColor: "bg-muted/20",
      message: "Match nul ! Vous êtes à égalité."
    }
  }

  const config = resultConfig[result]

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border/80 rounded-lg p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`text-center mb-6 p-6 rounded-lg ${config.bgColor}`}>
          <h2 className={`text-3xl font-bold mb-2 tracking-tight ${config.color}`}>
            {config.title}
          </h2>
          <p className="text-muted-foreground">{config.message}</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground">Adversaire</span>
            <span className="font-medium">{opponentName}</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground">Votre score</span>
            <span className="font-bold text-2xl">{score}/100</span>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground">Temps écoulé</span>
            <span className="font-medium">18:45</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 border border-border/80 px-4 py-2.5 rounded-md hover:bg-accent/50 transition-colors font-medium"
          >
            Fermer
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Voir le tableau de bord
          </button>
        </div>
      </div>
    </div>
  )
}
