"use client"

import { type ReactNode, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GameButton } from "@/components/ui/game-button"
import { ArrowLeft, Home } from "lucide-react"

interface PvPGameWrapperProps {
  gameTitle: string
  gameType: string
  onGameComplete?: (result: "win" | "loss" | "draw") => void
  children: ReactNode
}

export function PvPGameWrapper({ gameTitle, gameType, onGameComplete, children }: PvPGameWrapperProps) {
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    // Request fullscreen on mobile devices
    if (window.innerHeight > window.innerWidth) {
      setIsFullscreen(true)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <GameButton variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </GameButton>
            <h1 className="text-xl font-bold text-white">{gameTitle}</h1>
          </div>
          <GameButton variant="ghost" size="sm" onClick={() => router.push("/")}>
            <Home className="w-5 h-5" />
          </GameButton>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div className="w-full max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
