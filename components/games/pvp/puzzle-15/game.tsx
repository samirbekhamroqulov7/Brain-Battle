"use client"

import { useState } from "react"
import { GameButton } from "@/components/ui/game-button"

export function Puzzle15PvP() {
  const [gamePhase, setGamePhase] = useState<"playing" | "result">("playing")
  const [moves, setMoves] = useState(0)
  const [player1Moves, setPlayer1Moves] = useState<number | null>(null)
  const [player2Moves, setPlayer2Moves] = useState<number | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState("1")
  const [gameStarted, setGameStarted] = useState(false)

  const handleMove = () => {
    setMoves((prev) => prev + 1)
  }

  const handleSolvePuzzle = () => {
    if (currentPlayer === "1" && player1Moves === null) {
      setPlayer1Moves(moves)
      setCurrentPlayer("2")
      setMoves(0)
    } else if (currentPlayer === "2" && player2Moves === null) {
      setPlayer2Moves(moves)
      setGamePhase("result")
    }
  }

  if (gamePhase === "result") {
    const winner = player1Moves! < player2Moves! ? "Player 1" : "Player 2"
    return (
      <div className="flex flex-col gap-6 items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-400 mb-2">{winner} Wins!</h2>
          <p className="text-gray-400">
            P1: {player1Moves} moves | P2: {player2Moves} moves
          </p>
        </div>
        <GameButton onClick={() => (window.location.href = "/pvp")} className="w-full h-12" variant="secondary">
          Back to Games
        </GameButton>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className={`text-sm ${currentPlayer === "1" ? "text-blue-400" : "text-purple-400"}`}>
          Player {currentPlayer}'s Turn
        </p>
        <p className="text-gray-400 text-xs mt-1">Moves: {moves}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <button
            key={i}
            onClick={handleMove}
            className="aspect-square bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 rounded-lg font-bold text-white text-xl transition-transform hover:scale-105"
          >
            {i + 1}
          </button>
        ))}
      </div>

      <GameButton onClick={handleSolvePuzzle} className="w-full h-12">
        Puzzle Solved!
      </GameButton>
    </div>
  )
}
