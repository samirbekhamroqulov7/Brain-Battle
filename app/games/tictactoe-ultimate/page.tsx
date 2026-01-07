// Tic-Tac-Toe Ultimate game page

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TicTacToeUltimateBoard } from "@/components/games/tictactoe-ultimate/game-board"
import { ArrowLeft } from "lucide-react"

type GameMode = "classic" | "blitz" | "team" | "royale"

export default function TicTacToeUltimatePage() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const router = useRouter()

  const handleGameEnd = (winner: string, scores: { X: number; O: number }) => {
    // Save result to database
    console.log(`Game ended: ${winner} wins! Scores: X=${scores.X}, O=${scores.O}`)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <Button onClick={() => router.back()} variant="ghost" className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Tic-Tac-Toe Ultimate
            </h1>
            <p className="text-gray-400">7x7 Grid with Special Cells & Power-ups</p>
          </div>

          {/* Game Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[
              {
                mode: "classic" as GameMode,
                title: "Classic",
                description: "Standard 7x7 gameplay",
                icon: "♟️",
              },
              {
                mode: "blitz" as GameMode,
                title: "Blitz",
                description: "3 seconds per move",
                icon: "⚡",
              },
              {
                mode: "team" as GameMode,
                title: "Team Battle",
                description: "2v2 multiplayer",
                icon: "👥",
              },
              {
                mode: "royale" as GameMode,
                title: "Royale",
                description: "4-player free for all",
                icon: "👑",
              },
            ].map(({ mode, title, description, icon }) => (
              <Card
                key={mode}
                className="p-6 cursor-pointer hover:bg-purple-500/20 transition-all border-purple-500/30 hover:border-purple-500/60"
                onClick={() => {
                  setGameMode(mode)
                  setGameStarted(true)
                }}
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold mb-1">{title}</h3>
                <p className="text-sm text-gray-400">{description}</p>
              </Card>
            ))}
          </div>

          {/* Game Info */}
          <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <h2 className="font-bold mb-3">Special Cells:</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>🔥 Fire: Destroy adjacent pieces</div>
              <div>🛡️ Shield: Protect from destruction</div>
              <div>⚡ Lightning: Skip opponent's turn</div>
              <div>🔄 Teleport: Swap positions</div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <Button onClick={() => setGameStarted(false)} variant="ghost" className="mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Game Select
      </Button>

      {gameMode && (
        <div className="max-w-3xl mx-auto">
          <TicTacToeUltimateBoard gameType={gameMode} onGameEnd={handleGameEnd} />
        </div>
      )}
    </div>
  )
}
