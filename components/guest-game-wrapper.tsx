"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/ui/game-button"
import { GameCard } from "@/components/ui/game-card"
import { User, Gamepad2 } from "lucide-react"

interface GuestGameWrapperProps {
  children: ReactNode
  gameName: string
}

export function GuestGameWrapper({ children, gameName }: GuestGameWrapperProps) {
  const [isGuest, setIsGuest] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Всегда устанавливаем гостевой режим
    const guestMode = localStorage.getItem("brain_battle_guest_mode")
    if (!guestMode) {
      const guestProfile = {
        id: "guest_" + Date.now(),
        username: "Гость",
        avatar_url: null,
        isGuest: true,
        created_at: new Date().toISOString()
      }
      localStorage.setItem("brain_battle_guest_profile", JSON.stringify(guestProfile))
      localStorage.setItem("brain_battle_guest_mode", "true")
      localStorage.setItem("brain_battle_guest_name", "Гость")
    }
    setIsGuest(true)
  }, [])

  const handleLogin = () => {
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {isGuest && (
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-green-500/20 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-600">
            <User className="w-4 h-4" />
            <span className="text-sm">Гостевой режим</span>
          </div>
          <button
            onClick={handleLogin}
            className="text-xs text-green-700 hover:text-green-800 underline"
          >
            Войти
          </button>
        </div>
      )}
      
      {children}
    </div>
  )
}
