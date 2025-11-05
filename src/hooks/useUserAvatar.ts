"use client"

import { useState, useEffect } from "react"

export type AvatarType = "placeholder" | "upload" | "ai" | "tech"

export interface UserAvatar {
  type: AvatarType
  uploadedImage?: string
  aiSeed?: string
  techIconId?: string
}

const DEFAULT_AVATAR: UserAvatar = {
  type: "placeholder",
  techIconId: "code"
}

export function useUserAvatar() {
  const [avatar, setAvatar] = useState<UserAvatar>(DEFAULT_AVATAR)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load avatar from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user_avatar")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setAvatar(parsed)
      } catch (e) {
        console.error("Failed to parse stored avatar", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save avatar to localStorage whenever it changes
  const updateAvatar = (newAvatar: UserAvatar) => {
    setAvatar(newAvatar)
    localStorage.setItem("user_avatar", JSON.stringify(newAvatar))
    
    // Dispatch custom event for cross-component updates
    window.dispatchEvent(new CustomEvent("avatar-updated", { detail: newAvatar }))
  }

  return {
    avatar,
    updateAvatar,
    isLoaded
  }
}
