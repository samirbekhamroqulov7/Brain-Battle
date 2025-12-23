"use client"

import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/ui/game-button"
import { ArrowLeft } from "lucide-react"

interface GameLayoutProps {
  children: ReactNode
  gameName: string
}

export function GameLayout({ children, gameName }: GameLayoutProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between">
          <GameButton variant="ghost" size="sm" onClick={() => router.push("/classic")}>
            <ArrowLeft className="w-5 h-5" />
          </GameButton>
          <h1 className="text-xl font-bold text-primary uppercase tracking-wider">{gameName}</h1>
          <div className="w-10"></div>
        </div>
      </div>
      
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
