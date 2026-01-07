"use client"

import { useRouter } from "next/navigation"
import { GameCard } from "@/components/ui/game-card"
import { GameButton } from "@/components/ui/game-button"
import { User, Gamepad2, Home } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()

  const handleGuestPlay = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <GameCard className="max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Регистрация</h1>
          <p className="text-gray-400 mb-6">
            Регистрация временно отключена. Используйте гостевой режим.
          </p>

          <div className="space-y-3">
            <GameButton 
              variant="primary" 
              size="md" 
              className="w-full"
              onClick={handleGuestPlay}
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              Играть как гость
            </GameButton>

            <GameButton 
              variant="outline" 
              size="md" 
              className="w-full"
              onClick={() => router.push("/")}
            >
              <Home className="w-5 h-5 mr-2" />
              На главную
            </GameButton>
          </div>

          <div className="mt-6 p-4 bg-green-500/10 rounded border border-green-500/20">
            <p className="text-sm text-green-300 text-center">
              Функции регистрации будут добавлены в следующем обновлении
            </p>
          </div>
        </div>
      </GameCard>
    </div>
  )
}
