"use client"

import { useState } from "react"
import { GameCard } from "@/components/ui/game-card"
import { GameButton } from "@/components/ui/game-button"

export function DotsPvP() {
  const [gamePhase, setGamePhase] = useState<"playing" | "result">("playing")
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [currentPlayer, setCurrentPlayer] = useState("1")
  const [gameResult, setGameResult] = useState<"1" | "2" | "draw" | null>(null)

  const handleDotClick = () => {
    if (currentPlayer === "1") {
      setPlayer1Score((prev) => prev + 10)
    } else {
      setPlayer2Score((prev) => prev + 10)
    }

    if (player1Score >= 50 || player2Score >= 50) {
      setGamePhase("result")
      setGameResult(player1Score > player2Score ? "1" : "2")
    } else {
      setCurrentPlayer(currentPlayer === "1" ? "2" : "1")
    }
  }

  if (gamePhase === "result") {
    return (
      <div className="flex flex-col gap-6 items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-400 mb-2">
            Player {gameResult === "draw" ? "Draw" : gameResult} Wins!
          </h2>
          <p className="text-gray-400">Score: {Math.max(player1Score, player2Score)} points</p>
        </div>
        <GameButton onClick={() => (window.location.href = "/pvp")} className="w-full h-12" variant="secondary">
          Back to Games
        </GameButton>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <GameCard className="p-4 text-center">
          <p className="text-gray-400 text-sm mb-2">Player 1</p>
          <p className="text-3xl font-bold text-blue-400">{player1Score}</p>
        </GameCard>
        <GameCard className="p-4 text-center">
          <p className="text-gray-400 text-sm mb-2">Player 2</p>
          <p className="text-3xl font-bold text-purple-400">{player2Score}</p>
        </GameCard>
      </div>

      <div className="text-center">
        <p className="text-gray-400 text-sm mb-1">Current Player</p>
        <p className={`text-2xl font-bold ${currentPlayer === "1" ? "text-blue-400" : "text-purple-400"}`}>
          Player {currentPlayer}
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 25 }).map((_, i) => (
          <button
            key={i}
            onClick={handleDotClick}
            className="aspect-square bg-gradient-to-br from-purple-500/50 to-pink-500/50 hover:from-purple-400 hover:to-pink-400 rounded-full transition-all transform hover:scale-110 shadow-lg"
          />
        ))}
      </div>
    </div>
  )
}
