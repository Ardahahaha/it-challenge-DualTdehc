"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import UserAvatar from "./UserAvatar"
import { useUserAvatar } from "@/hooks/useUserAvatar"

export default function UserAvatarButton() {
  const router = useRouter()
  const { avatar, isLoaded } = useUserAvatar()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Listen for avatar updates from other components
  useEffect(() => {
    const handleAvatarUpdate = () => {
      // Force re-render by updating state
      setMounted(false)
      setTimeout(() => setMounted(true), 0)
    }

    window.addEventListener("avatar-updated", handleAvatarUpdate)
    return () => window.removeEventListener("avatar-updated", handleAvatarUpdate)
  }, [])

  if (!mounted || !isLoaded) {
    return null
  }

  return (
    <button
      onClick={() => router.push("/profil")}
      className="relative group flex-shrink-0"
      aria-label="Aller à mon profil"
      title="Mon profil"
    >
      <UserAvatar 
        avatar={avatar} 
        size="sm" 
        className="border-2 border-primary/30 hover:border-primary transition-all cursor-pointer group-hover:scale-110 shadow-lg hover:shadow-primary/20"
      />
      
      {/* Pulse effect on hover */}
      <div className="absolute inset-0 rounded-full border-2 border-primary opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 pointer-events-none"></div>
    </button>
  )
}
