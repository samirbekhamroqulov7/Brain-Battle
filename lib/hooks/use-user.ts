"use client"

import { useState, useEffect } from "react"

interface UserProfile {
  id: string
  username: string
  avatar_url: string | null
  isGuest: boolean
}

export function useUser() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = () => {
      setLoading(true)
      try {
        const savedProfile = localStorage.getItem("brain_battle_guest_profile")
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile))
        } else {
          const newProfile: UserProfile = {
            id: "guest_" + Date.now(),
            username: "Гость",
            avatar_url: null,
            isGuest: true
          }
          localStorage.setItem("brain_battle_guest_profile", JSON.stringify(newProfile))
          localStorage.setItem("brain_battle_guest_mode", "true")
          localStorage.setItem("brain_battle_guest_name", "Гость")
          setProfile(newProfile)
        }
      } catch (error) {
        console.error("Failed to load profile:", error)
        const fallbackProfile: UserProfile = {
          id: "guest_" + Date.now(),
          username: "Гость",
          avatar_url: null,
          isGuest: true
        }
        setProfile(fallbackProfile)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      const updatedProfile = { ...profile, ...updates }
      setProfile(updatedProfile)
      localStorage.setItem("brain_battle_guest_profile", JSON.stringify(updatedProfile))
      if (updates.username) {
        localStorage.setItem("brain_battle_guest_name", updates.username)
      }
    }
  }

  const quickGuestPlay = () => {
    const newProfile: UserProfile = {
      id: "guest_" + Date.now(),
      username: "Гость",
      avatar_url: null,
      isGuest: true
    }
    setProfile(newProfile)
    localStorage.setItem("brain_battle_guest_profile", JSON.stringify(newProfile))
    localStorage.setItem("brain_battle_guest_mode", "true")
    localStorage.setItem("brain_battle_guest_name", "Гость")
  }

  return {
    user: profile,
    profile,
    loading,
    isGuest: true, // Всегда гость
    updateProfile,
    quickGuestPlay
  }
}
