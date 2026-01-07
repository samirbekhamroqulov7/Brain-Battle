"use client"

import { useRouter } from "next/navigation"
import { GameCard } from "@/components/ui/game-card"
import { GameButton } from "@/components/ui/game-button"
import { AVAILABLE_PVP_GAMES } from "@/lib/pvp/game-loader"
import { ArrowLeft } from "lucide-react"
import * as Icons from "lucide-react"

export default function PvPPage() {
  const router = useRouter()
  const gameEntries = Object.entries(AVAILABLE_PVP_GAMES)

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = Icons
    return iconMap[iconName] || Icons.Gamepad2
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <GameButton variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="w-5 h-5" />
          </GameButton>
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              PvP Games
            </h1>
            <p className="text-sm text-gray-400">Challenge players in real-time</p>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto pb-8">
          {gameEntries.map(([gameType, gameInfo]) => {
            const Icon = getIcon(gameInfo.icon)
            return (
              <GameCard
                key={gameType}
                variant="interactive"
                className="p-6 flex flex-col gap-4 cursor-pointer hover:border-purple-400/50 transition-colors"
                onClick={() => router.push(`/pvp/${gameType}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{gameInfo.name}</h3>
                    <p className="text-sm text-gray-400">{gameInfo.description}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center ml-4 flex-shrink-0">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-700/50">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-400">Ready to play</span>
                </div>
              </GameCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}
