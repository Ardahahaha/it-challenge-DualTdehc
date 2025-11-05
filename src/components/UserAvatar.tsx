"use client"

import { Code2, Shield, Brain, Network, Server, User } from "lucide-react"
import { UserAvatar as UserAvatarType } from "@/hooks/useUserAvatar"

interface UserAvatarProps {
  avatar: UserAvatarType
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const techIcons = {
  code: { icon: Code2, color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.65_0.2_200)]" },
  shield: { icon: Shield, color: "from-[oklch(0.6_0.25_290)] to-[oklch(0.55_0.25_240)]" },
  brain: { icon: Brain, color: "from-[oklch(0.75_0.22_150)] to-[oklch(0.65_0.2_200)]" },
  network: { icon: Network, color: "from-[oklch(0.65_0.2_200)] to-[oklch(0.55_0.25_240)]" },
  server: { icon: Server, color: "from-[oklch(0.55_0.25_240)] to-[oklch(0.6_0.25_290)]" },
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-24 h-24",
  xl: "w-48 h-48"
}

const iconSizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-12 h-12",
  xl: "w-24 h-24"
}

export default function UserAvatar({ avatar, size = "md", className = "" }: UserAvatarProps) {
  const sizeClass = sizeClasses[size]
  const iconSize = iconSizeClasses[size]

  // Placeholder - silhouette
  if (avatar.type === "placeholder") {
    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center ${className}`}>
        <User className={`${iconSize} text-muted-foreground/60`} />
      </div>
    )
  }

  // Uploaded image
  if (avatar.type === "upload" && avatar.uploadedImage) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden ${className}`}>
        <img 
          src={avatar.uploadedImage} 
          alt="Avatar utilisateur" 
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  // AI-generated avatar
  if (avatar.type === "ai" && avatar.aiSeed) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden ${className}`}>
        <img 
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar.aiSeed}`}
          alt="Avatar IA"
          className="w-full h-full"
        />
      </div>
    )
  }

  // Tech icon
  if (avatar.type === "tech" && avatar.techIconId) {
    const tech = techIcons[avatar.techIconId as keyof typeof techIcons] || techIcons.code
    const IconComponent = tech.icon
    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-br ${tech.color} flex items-center justify-center ${className}`}>
        <IconComponent className={`${iconSize} text-white`} />
      </div>
    )
  }

  // Fallback to placeholder
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center ${className}`}>
      <User className={`${iconSize} text-muted-foreground/60`} />
    </div>
  )
}
