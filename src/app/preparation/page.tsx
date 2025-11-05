"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/Navigation"
import { useRouter } from "next/navigation"
import { Brain, Zap, CheckCircle2, XCircle, Clock, Target, ArrowRight } from "lucide-react"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const warmupQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Quelle est la complexité temporelle de la recherche binaire ?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    explanation: "La recherche binaire divise l'espace de recherche en deux à chaque itération, d'où O(log n)"
  },
  {
    id: 2,
    question: "Qu'est-ce qu'une closure en JavaScript ?",
    options: [
      "Une fonction qui retourne une autre fonction",
      "Une fonction qui a accès aux variables de son scope parent",
      "Une fonction anonyme",
      "Une fonction asynchrone"
    ],
    correctAnswer: 1,
    explanation: "Une closure permet à une fonction d'accéder aux variables de son environnement lexical externe"
  },
  {
    id: 3,
    question: "Quel protocole garantit la livraison des paquets ?",
    options: ["UDP", "TCP", "HTTP", "FTP"],
    correctAnswer: 1,
    explanation: "TCP (Transmission Control Protocol) garantit la livraison ordonnée et fiable des données"
  }
]

export default function PreparationPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [isComplete, setIsComplete] = useState(false)

  const currentQuestion = warmupQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === warmupQuestions.length - 1

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !showExplanation && !isComplete) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && !showExplanation) {
      handleSubmitAnswer()
    }
  }, [timeRemaining, showExplanation, isComplete])

  const handleSelectAnswer = (index: number) => {
    if (!showExplanation) {
      setSelectedAnswer(index)
    }
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null && timeRemaining > 0) return
    
    setShowExplanation(true)
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setIsComplete(true)
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setTimeRemaining(30)
    }
  }

  const handleStartDuel = () => {
    router.push('/room/1')
  }

  const getAnswerStyle = (index: number) => {
    if (!showExplanation) {
      return selectedAnswer === index
        ? "bg-primary/20 border-primary"
        : "border-primary/20 hover:border-primary/40"
    }
    
    if (index === currentQuestion.correctAnswer) {
      return "bg-[oklch(0.75_0.22_150)]/20 border-[oklch(0.75_0.22_150)] text-[oklch(0.75_0.22_150)]"
    }
    
    if (selectedAnswer === index && index !== currentQuestion.correctAnswer) {
      return "bg-destructive/20 border-destructive text-destructive"
    }
    
    return "border-border/30 opacity-50"
  }

  if (isComplete) {
    const percentage = Math.round((score / warmupQuestions.length) * 100)
    const isGoodScore = percentage >= 66

    return (
      <div className="min-h-screen">
        <Navigation />
        
        <div className="container mx-auto px-6 py-10 animate-page-enter">
          <div className="max-w-3xl mx-auto">
            <div className="glass rounded-2xl p-12 text-center cyber-frame">
              <div className={`w-32 h-32 rounded-full mx-auto mb-8 flex items-center justify-center ${
                isGoodScore 
                  ? "bg-gradient-to-br from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)]" 
                  : "bg-gradient-to-br from-primary to-[oklch(0.65_0.2_200)]"
              } glow-subtle`}>
                {isGoodScore ? (
                  <CheckCircle2 className="w-16 h-16 text-white" />
                ) : (
                  <Brain className="w-16 h-16 text-white" />
                )}
              </div>

              <h1 className="text-5xl font-bold mb-4 tracking-tight header-glow">
                Échauffement terminé !
              </h1>
              
              <div className="text-7xl font-bold mb-6 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] bg-clip-text text-transparent">
                {score}/{warmupQuestions.length}
              </div>
              
              <p className="text-2xl text-muted-foreground mb-10">
                {isGoodScore 
                  ? "Excellent ! Vous êtes prêt pour le défi !" 
                  : "Bon échauffement ! Continuez à vous entraîner !"}
              </p>

              <div className="glass rounded-xl p-6 mb-10 border border-primary/20">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Score</div>
                    <div className="text-3xl font-bold">{percentage}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Bonnes réponses</div>
                    <div className="text-3xl font-bold text-[oklch(0.75_0.22_150)]">{score}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Questions</div>
                    <div className="text-3xl font-bold">{warmupQuestions.length}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleStartDuel}
                  className="px-10 py-5 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle pulse-ring flex items-center gap-3 text-lg"
                >
                  <Zap className="w-6 h-6" />
                  Commencer le duel
                  <ArrowRight className="w-6 h-6" />
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-10 py-5 glass border-2 border-primary/20 rounded-xl font-bold btn-hover text-lg"
                >
                  Retour au tableau de bord
                </button>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 relative">
            <div className="absolute top-0 right-0 text-primary/10 text-8xl font-mono">{"<>"}</div>
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-primary animate-pulse" />
              <span className="text-sm font-mono text-primary tech-bracket">WARM_UP</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight header-glow bg-gradient-to-r from-[oklch(0.55_0.25_240)] via-[oklch(0.65_0.2_200)] to-[oklch(0.75_0.22_150)] bg-clip-text text-transparent mb-4">
              Échauffement avant le duel
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Répondez à ces questions rapides pour vous préparer mentalement au défi
            </p>
          </div>

          {/* Progress Bar */}
          <div className="glass rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold">Question {currentQuestionIndex + 1} sur {warmupQuestions.length}</span>
              <span className="text-sm text-muted-foreground">Score: {score}/{currentQuestionIndex}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / warmupQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="glass rounded-2xl p-10 mb-8 cyber-frame scanline relative">
            {/* Timer */}
            <div className="absolute top-6 right-6">
              <div className={`flex items-center gap-2 glass rounded-lg px-4 py-2 border-2 ${
                timeRemaining <= 10 ? "border-destructive text-destructive animate-pulse" : "border-primary"
              }`}>
                <Clock className="w-5 h-5" />
                <span className="text-2xl font-bold">{timeRemaining}s</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-primary" />
              <span className="text-sm font-mono text-primary">QUESTION #{currentQuestion.id}</span>
            </div>

            <h2 className="text-3xl font-bold mb-10 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all text-lg font-medium ${getAnswerStyle(index)} ${
                    !showExplanation ? "btn-hover cursor-pointer" : "cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                      showExplanation && index === currentQuestion.correctAnswer
                        ? "bg-[oklch(0.75_0.22_150)] text-white"
                        : showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer
                        ? "bg-destructive text-white"
                        : "bg-primary/10 text-primary"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                    {showExplanation && index === currentQuestion.correctAnswer && (
                      <CheckCircle2 className="w-6 h-6 ml-auto text-[oklch(0.75_0.22_150)]" />
                    )}
                    {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                      <XCircle className="w-6 h-6 ml-auto text-destructive" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="glass rounded-xl p-6 border-2 border-primary/30 bg-primary/5 mb-6 animate-page-enter">
                <div className="flex items-start gap-3">
                  <Brain className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Explication</h3>
                    <p className="text-muted-foreground leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!showExplanation ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  Valider ma réponse
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)] text-white rounded-xl font-bold btn-hover glow-subtle flex items-center justify-center gap-2 text-lg"
                >
                  {isLastQuestion ? "Voir les résultats" : "Question suivante"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
