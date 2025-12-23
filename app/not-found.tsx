"use client"

import { useRouter } from "next/navigation"
import { GameCard } from "@/components/ui/game-card"
import { GameButton } from "@/components/ui/game-button"
import { Home, AlertCircle } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <GameCard className="max-w-md w-full p-8 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>

        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-3">Страница не найдена</h2>

        <p className="text-muted-foreground mb-6">
          Извините, страница, которую вы ищете, не существует. Возможно, она была удалена или перемещена.
        </p>

        <GameButton variant="primary" size="md" onClick={() => router.push("/")} className="w-full">
          <Home className="w-5 h-5 mr-2" />
          Вернуться на главную
        </GameButton>
      </GameCard>
    </div>
  )
}
