"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/ui/game-button"
import { Gamepad2, Settings, User } from "lucide-react"

export function MainMenu() {
  const router = useRouter()
  const [username, setUsername] = useState("Гость")

  useEffect(() => {
    const name = localStorage.getItem("brain_battle_guest_name") || "Гость"
    setUsername(name)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        {/* Аватар */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">{username}</h1>
          <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full">
            <span className="text-sm text-green-300">Гостевой режим</span>
          </div>
        </div>

        {/* Кнопки */}
        <div className="w-full flex flex-col gap-4">
          <GameButton 
            size="lg" 
            className="w-full h-14" 
            onClick={() => router.push("/classic")}
          >
            <Gamepad2 className="w-5 h-5 mr-2" />
            Классические игры
          </GameButton>

          <GameButton 
            size="lg" 
            className="w-full h-14" 
            onClick={() => router.push("/settings")}
          >
            <Settings className="w-5 h-5 mr-2" />
            Настройки
          </GameButton>
        </div>
      </div>
    </div>
  )
}
