"use client"

import Navigation from "@/components/Navigation"
import { useRouter } from "next/navigation"
import { Code2, Zap, Users, Trophy, Terminal, Cpu, TrendingUp, MessageCircle, Medal } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"

export default function Home() {
  const router = useRouter()
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Parallax effect for hero section
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  // Intersection observers for scroll animations
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" })
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" })

  const commands = [
    "$ npm install @skills/progression",
    "$ git commit -m 'Amélioration des compétences'",
    "$ docker run --name challenge-1v1",
    "$ python train_model.py --mode=cyber",
    "$ ssh user@challenge-server.io",
    "$ kubectl apply -f deployment.yaml",
    "$ cargo build --release",
    "$ nmap -sV 192.168.1.1",
    "$ terraform apply --auto-approve",
    "$ go test ./...",
  ]

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setTerminalLines(prev => {
        const newLines = [...prev, commands[index % commands.length]]
        return newLines.slice(-6)
      })
      index++
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  return (
    <div className="min-h-screen animate-page-enter">
      <Navigation />
      
      {/* Hero Section with Duel Elements */}
      <section ref={heroRef} className="relative border-b border-border/50 py-32 overflow-hidden">
        {/* Decorative cyber elements with parallax */}
        <motion.div 
          className="absolute top-10 right-10 text-primary/20 text-6xl font-mono"
          style={{ y: heroY, opacity: heroOpacity }}
          animate={{ 
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {"<>"}
        </motion.div>
        <motion.div 
          className="absolute bottom-10 left-10 text-primary/20 text-6xl font-mono"
          style={{ y: heroY, opacity: heroOpacity }}
          animate={{ 
            rotate: [0, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          {"</>"}
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="max-w-4xl"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div className="flex items-center gap-3 mb-6" variants={itemVariants}>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Terminal className="w-8 h-8 text-primary animate-pulse" />
              </motion.div>
              <span className="text-sm font-mono text-primary tech-bracket">PLATEFORME_V1.0</span>
            </motion.div>
            
            {/* Enhanced Slogan with better hierarchy */}
            <motion.div className="mb-6" variants={itemVariants}>
              <p className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--duel-accent)' }}>
                Entraîne-toi. Challenge. Progresse.
              </p>
            </motion.div>
            
            <motion.h1 
              className="text-7xl font-black mb-8 tracking-tighter leading-tight"
              variants={itemVariants}
            >
              <span className="header-glow" style={{ color: 'var(--primary)' }}>
                Plateforme de défis IT 1v1
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-2xl text-foreground/80 mb-12 leading-relaxed font-medium max-w-3xl"
              variants={itemVariants}
            >
              Apprenez, affrontez et améliorez vos compétences en code à travers des défis en temps réel
            </motion.p>
            
            <motion.div 
              className="flex gap-5 items-center justify-center sm:justify-start flex-wrap"
              variants={itemVariants}
            >
              <motion.button 
                onClick={() => router.push('/dashboard')}
                className="px-10 py-5 bg-gradient-to-r from-primary to-[var(--duel-primary)] text-primary-foreground rounded-2xl font-bold btn-hover glow-subtle btn-shimmer flex items-center gap-3 text-xl shadow-2xl w-full max-w-xs sm:w-auto sm:max-w-none mx-auto sm:mx-0 border-2 border-primary/20"
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    "0 0 30px rgba(139, 92, 246, 0.4)",
                    "0 0 50px rgba(139, 92, 246, 0.6)",
                    "0 0 30px rgba(139, 92, 246, 0.4)"
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, 0, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-6 h-6" fill="currentColor" />
                </motion.div>
                Commencer
              </motion.button>
              <motion.button 
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-10 py-5 glass rounded-2xl font-semibold btn-hover border-2 border-primary/30 hover:border-primary/50 transition-all flex items-center gap-3 text-lg w-full max-w-xs sm:w-auto sm:max-w-none mx-auto sm:mx-0 backdrop-blur-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Code2 className="w-6 h-6" />
                En savoir plus
              </motion.button>
            </motion.div>
            
            {/* Tech stats with improved hierarchy */}
            <motion.div 
              className="flex gap-8 mt-12 pt-8 border-t border-border/50"
              variants={itemVariants}
            >
              <motion.div 
                className="flex items-center gap-2 opacity-70"
                whileHover={{ x: 5, opacity: 1 }}
              >
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--duel-primary)' }}></div>
                <span className="text-sm font-mono text-muted-foreground">Plateforme en lancement</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 opacity-70"
                whileHover={{ x: 5, opacity: 1 }}
              >
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--duel-accent)' }}></div>
                <span className="text-sm font-mono text-muted-foreground">Rejoignez la communauté</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Mini Terminal Zone with subtle animation */}
        <motion.div 
          className="absolute bottom-8 right-8 w-96 glass rounded-lg p-4 border-2 border-primary/20 hidden lg:block backdrop-blur-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/30">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary">terminal@challenge</span>
            <div className="ml-auto flex gap-1">
              <motion.div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--destructive)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--duel-accent)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
              <motion.div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--duel-secondary)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              />
            </div>
          </div>
          <div className="space-y-1 font-mono text-xs text-muted-foreground h-32 overflow-hidden">
            {terminalLines.map((line, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {line}
              </motion.div>
            ))}
            <div className="flex items-center gap-1">
              <span className="text-primary">$</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </motion.div>
        
        {/* Floating tech shapes with enhanced animation */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-primary/10 rounded-lg rotate-45"
          animate={{ 
            rotate: [45, 225, 45],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/3 w-24 h-24 border-2 border-primary/10 rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </section>

      {/* Features Section with Enhanced Icons */}
      <section id="features" ref={featuresRef} className="py-28 relative">
        <div className="container mx-auto px-6">
          {/* Animated section header with VS divider */}
          <motion.div 
            className="mb-20 text-center relative"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 mb-4"
              animate={featuresInView ? { 
                y: [0, -5, 0]
              } : {}}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Cpu className="w-6 h-6 text-primary animate-pulse" />
              </motion.div>
              <span className="text-sm font-mono text-primary">FEATURES</span>
            </motion.div>
            <h2 className="text-6xl font-black tracking-tighter header-glow mb-6">
              <span className="bg-gradient-to-r from-primary via-[var(--duel-primary)] to-[var(--duel-accent)] bg-clip-text text-transparent">
                Fonctionnalités
              </span>
            </h2>
            <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto">Tout ce dont vous avez besoin pour progresser</p>
            
            {/* VS Divider */}
            <motion.div 
              className="vs-divider mt-8"
              animate={featuresInView ? { opacity: [0.6, 1, 0.6] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              VS
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div 
              onClick={() => router.push('/realtime-1v1')}
              className="glass rounded-3xl p-12 cursor-pointer card-hover cyber-frame group scanline duel-arena border-2 border-primary/10"
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-[var(--duel-primary)] flex items-center justify-center mb-8 shadow-2xl"
                whileHover={{ 
                  scale: 1.15,
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 0.4 }}
              >
                <Zap className="w-10 h-10 text-white" strokeWidth={2.5} />
              </motion.div>
              <h3 className="text-3xl font-black mb-5 tracking-tight">1v1 en temps réel</h3>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                Affrontez d'autres développeurs dans des défis de code en temps réel
              </p>
              <motion.div 
                className="mt-8 flex items-center gap-2 font-mono text-sm font-bold"
                style={{ color: 'var(--duel-primary)' }}
                whileHover={{ x: 8 }}
              >
                <span className="animate-pulse text-lg">→</span>
                <span>Démarrer un défi</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              onClick={() => router.push('/skills-tracking')}
              className="glass rounded-3xl p-12 cursor-pointer card-hover cyber-frame group scanline metallic-frame border-2 border-primary/10"
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-2xl"
                style={{ 
                  background: `linear-gradient(135deg, var(--duel-accent), var(--duel-secondary))`
                }}
                whileHover={{ 
                  scale: 1.15,
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ duration: 0.4 }}
              >
                <TrendingUp className="w-10 h-10 text-white" strokeWidth={2.5} />
              </motion.div>
              <h3 className="text-3xl font-black mb-5 tracking-tight">Suivi des compétences</h3>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                Suivez votre progression et améliorez-vous au fil du temps
              </p>
              <motion.div 
                className="mt-8 flex items-center gap-2 font-mono text-sm font-bold"
                style={{ color: 'var(--duel-accent)' }}
                whileHover={{ x: 8 }}
              >
                <span className="animate-pulse text-lg">→</span>
                <span>Voir les stats</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              onClick={() => router.push('/communautes')}
              className="glass rounded-3xl p-12 cursor-pointer card-hover cyber-frame group scanline energy-sparks border-2 border-primary/10"
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-2xl"
                style={{ 
                  background: `linear-gradient(135deg, var(--duel-secondary), var(--primary))`
                }}
                whileHover={{ 
                  scale: 1.15,
                  rotate: [0, 360]
                }}
                transition={{ duration: 0.6 }}
              >
                <MessageCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
              </motion.div>
              <h3 className="text-3xl font-black mb-5 tracking-tight">Communauté</h3>
              <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                Connectez-vous avec d'autres développeurs et apprenez ensemble
              </p>
              <motion.div 
                className="mt-8 flex items-center gap-2 font-mono text-sm font-bold"
                style={{ color: 'var(--duel-secondary)' }}
                whileHover={{ x: 8 }}
              >
                <span className="animate-pulse text-lg">→</span>
                <span>Rejoindre</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section with Duel Theme */}
      <section ref={ctaRef} className="py-32 relative overflow-hidden diagonal-slash">
        <div className="absolute inset-0 duel-arena"></div>
        
        <motion.div 
          className="container mx-auto px-6 text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 mb-8"
            animate={ctaInView ? { 
              y: [0, -5, 0]
            } : {}}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Medal className="w-8 h-8 animate-pulse" style={{ color: 'var(--duel-accent)' }} />
            </motion.div>
            <span className="text-sm font-mono" style={{ color: 'var(--duel-accent)' }}>READY_TO_CODE</span>
          </motion.div>
          
          <h2 className="text-6xl font-black mb-8 tracking-tighter header-glow">
            <span className="bg-gradient-to-r from-primary via-[var(--duel-primary)] to-[var(--duel-accent)] bg-clip-text text-transparent">
              Prêt à relever le défi ?
            </span>
          </h2>
          
          <p className="text-2xl text-foreground/80 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Rejoignez des milliers de développeurs qui améliorent leurs compétences chaque jour
          </p>
          
          <motion.button 
            onClick={() => router.push('/signup')}
            className="px-14 py-6 rounded-2xl font-black btn-hover glow-subtle pulse-ring text-xl shadow-2xl border-2 border-transparent"
            style={{
              background: `linear-gradient(135deg, var(--duel-primary), var(--duel-accent), var(--duel-secondary))`,
              backgroundSize: '200% 200%'
            }}
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
            animate={ctaInView ? {
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              boxShadow: [
                "0 0 30px rgba(139, 92, 246, 0.4)",
                "0 0 60px rgba(251, 191, 36, 0.5)",
                "0 0 30px rgba(139, 92, 246, 0.4)"
              ]
            } : {}}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-white drop-shadow-lg">S'inscrire gratuitement</span>
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}