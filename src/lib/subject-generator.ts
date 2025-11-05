// Générateur automatique de sujets de duel basé sur le niveau utilisateur

export type UserLevel = "Débutant" | "Intermédiaire" | "Avancé" | "Expert"
export type SubjectCategory = "Développement" | "Cybersécurité" | "IA"

interface ChallengeSubject {
  title: string
  description: string
  difficulty: UserLevel
  category: SubjectCategory
  estimatedTime: string
  points: number
}

const subjectsByLevel: Record<UserLevel, Record<SubjectCategory, ChallengeSubject[]>> = {
  "Débutant": {
    "Développement": [
      {
        title: "Créer une fonction de tri simple",
        description: "Implémentez une fonction qui trie un tableau de nombres par ordre croissant",
        difficulty: "Débutant",
        category: "Développement",
        estimatedTime: "10 min",
        points: 50
      },
      {
        title: "Calculateur de moyenne",
        description: "Créez une fonction qui calcule la moyenne d'un tableau de nombres",
        difficulty: "Débutant",
        category: "Développement",
        estimatedTime: "8 min",
        points: 40
      },
      {
        title: "Validation d'email",
        description: "Écrivez une fonction qui valide si une chaîne est un email valide",
        difficulty: "Débutant",
        category: "Développement",
        estimatedTime: "12 min",
        points: 60
      }
    ],
    "Cybersécurité": [
      {
        title: "Détection de mot de passe faible",
        description: "Créez une fonction qui vérifie si un mot de passe est suffisamment fort",
        difficulty: "Débutant",
        category: "Cybersécurité",
        estimatedTime: "15 min",
        points: 70
      },
      {
        title: "Encodage base64",
        description: "Implémentez un encodeur/décodeur base64 simple",
        difficulty: "Débutant",
        category: "Cybersécurité",
        estimatedTime: "10 min",
        points: 50
      }
    ],
    "IA": [
      {
        title: "Classificateur simple",
        description: "Créez un classificateur de texte basique (positif/négatif)",
        difficulty: "Débutant",
        category: "IA",
        estimatedTime: "20 min",
        points: 80
      }
    ]
  },
  "Intermédiaire": {
    "Développement": [
      {
        title: "Système de cache LRU",
        description: "Implémentez un cache Least Recently Used avec limite de taille",
        difficulty: "Intermédiaire",
        category: "Développement",
        estimatedTime: "25 min",
        points: 120
      },
      {
        title: "Algorithme de recherche binaire",
        description: "Créez une recherche binaire récursive et itérative",
        difficulty: "Intermédiaire",
        category: "Développement",
        estimatedTime: "20 min",
        points: 100
      },
      {
        title: "Parser JSON personnalisé",
        description: "Écrivez un parser JSON simple sans utiliser JSON.parse()",
        difficulty: "Intermédiaire",
        category: "Développement",
        estimatedTime: "30 min",
        points: 150
      }
    ],
    "Cybersécurité": [
      {
        title: "Détecteur d'injection SQL",
        description: "Créez une fonction qui détecte les tentatives d'injection SQL",
        difficulty: "Intermédiaire",
        category: "Cybersécurité",
        estimatedTime: "25 min",
        points: 130
      },
      {
        title: "Chiffrement César amélioré",
        description: "Implémentez un chiffrement César avec clé variable",
        difficulty: "Intermédiaire",
        category: "Cybersécurité",
        estimatedTime: "20 min",
        points: 110
      }
    ],
    "IA": [
      {
        title: "Réseau de neurones simple",
        description: "Créez un perceptron pour classification binaire",
        difficulty: "Intermédiaire",
        category: "IA",
        estimatedTime: "35 min",
        points: 160
      },
      {
        title: "Algorithme K-means",
        description: "Implémentez le clustering K-means de base",
        difficulty: "Intermédiaire",
        category: "IA",
        estimatedTime: "30 min",
        points: 140
      }
    ]
  },
  "Avancé": {
    "Développement": [
      {
        title: "Arbre AVL auto-équilibrant",
        description: "Implémentez un arbre binaire de recherche auto-équilibrant (AVL)",
        difficulty: "Avancé",
        category: "Développement",
        estimatedTime: "45 min",
        points: 250
      },
      {
        title: "Moteur de template",
        description: "Créez un moteur de template simple avec variables et boucles",
        difficulty: "Avancé",
        category: "Développement",
        estimatedTime: "40 min",
        points: 220
      },
      {
        title: "Algorithme de compression",
        description: "Implémentez un algorithme de compression de texte (Huffman)",
        difficulty: "Avancé",
        category: "Développement",
        estimatedTime: "50 min",
        points: 280
      }
    ],
    "Cybersécurité": [
      {
        title: "Analyseur de vulnérabilités",
        description: "Créez un outil d'analyse statique pour détecter les failles XSS",
        difficulty: "Avancé",
        category: "Cybersécurité",
        estimatedTime: "45 min",
        points: 260
      },
      {
        title: "Système d'authentification JWT",
        description: "Implémentez un système complet avec génération et validation JWT",
        difficulty: "Avancé",
        category: "Cybersécurité",
        estimatedTime: "40 min",
        points: 240
      }
    ],
    "IA": [
      {
        title: "Réseau neuronal convolutif",
        description: "Créez un CNN simple pour classification d'images",
        difficulty: "Avancé",
        category: "IA",
        estimatedTime: "60 min",
        points: 300
      },
      {
        title: "Algorithme génétique",
        description: "Implémentez un algorithme génétique pour optimisation",
        difficulty: "Avancé",
        category: "IA",
        estimatedTime: "50 min",
        points: 270
      }
    ]
  },
  "Expert": {
    "Développement": [
      {
        title: "Compilateur de langage",
        description: "Créez un compilateur pour un langage simple avec AST",
        difficulty: "Expert",
        category: "Développement",
        estimatedTime: "90 min",
        points: 500
      },
      {
        title: "Moteur de base de données",
        description: "Implémentez un mini moteur de base de données avec index B-tree",
        difficulty: "Expert",
        category: "Développement",
        estimatedTime: "80 min",
        points: 450
      }
    ],
    "Cybersécurité": [
      {
        title: "Fuzzer automatique",
        description: "Créez un fuzzer pour détecter les bugs de sécurité",
        difficulty: "Expert",
        category: "Cybersécurité",
        estimatedTime: "75 min",
        points: 480
      },
      {
        title: "Système de détection d'intrusion",
        description: "Implémentez un IDS avec analyse de patterns réseau",
        difficulty: "Expert",
        category: "Cybersécurité",
        estimatedTime: "85 min",
        points: 520
      }
    ],
    "IA": [
      {
        title: "Transformer pour NLP",
        description: "Créez un modèle transformer simplifié pour traitement du langage",
        difficulty: "Expert",
        category: "IA",
        estimatedTime: "100 min",
        points: 550
      },
      {
        title: "Système de recommandation",
        description: "Implémentez un système de recommandation avec filtrage collaboratif",
        difficulty: "Expert",
        category: "IA",
        estimatedTime: "70 min",
        points: 460
      }
    ]
  }
}

/**
 * Génère un sujet de duel aléatoire basé sur le niveau de l'utilisateur
 */
export function generateSubject(
  userLevel: UserLevel,
  category?: SubjectCategory
): ChallengeSubject {
  const levelSubjects = subjectsByLevel[userLevel]
  
  if (category && levelSubjects[category]) {
    const categorySubjects = levelSubjects[category]
    return categorySubjects[Math.floor(Math.random() * categorySubjects.length)]
  }
  
  // Si pas de catégorie spécifiée, choisir aléatoirement
  const categories = Object.keys(levelSubjects) as SubjectCategory[]
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  const categorySubjects = levelSubjects[randomCategory]
  
  return categorySubjects[Math.floor(Math.random() * categorySubjects.length)]
}

/**
 * Génère plusieurs sujets pour un utilisateur
 */
export function generateMultipleSubjects(
  userLevel: UserLevel,
  count: number = 3,
  category?: SubjectCategory
): ChallengeSubject[] {
  const subjects: ChallengeSubject[] = []
  const used = new Set<string>()
  
  while (subjects.length < count) {
    const subject = generateSubject(userLevel, category)
    if (!used.has(subject.title)) {
      subjects.push(subject)
      used.add(subject.title)
    }
  }
  
  return subjects
}

/**
 * Obtient des sujets recommandés basés sur les compétences
 */
export function getRecommendedSubjects(
  userLevel: UserLevel,
  weakCategories: SubjectCategory[]
): ChallengeSubject[] {
  const recommendations: ChallengeSubject[] = []
  
  // Prioriser les catégories faibles
  weakCategories.forEach(category => {
    const subject = generateSubject(userLevel, category)
    recommendations.push(subject)
  })
  
  // Compléter avec d'autres sujets si nécessaire
  while (recommendations.length < 3) {
    const subject = generateSubject(userLevel)
    if (!recommendations.some(r => r.title === subject.title)) {
      recommendations.push(subject)
    }
  }
  
  return recommendations
}
