"use client"

import { useState } from "react"
import { GameButton } from "@/components/ui/game-button"

export function ChessPvP() {
  const [gamePhase, setGamePhase] = useState<"piece-select" | "playing" | "result">("piece-select")
  const [playerColor, setPlayerColor] = useState<"white" | "black" | null>(null)
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null)
  const [moves, setMoves] = useState<number>(0)
  const [gameResult, setGameResult] = useState<"win" | "loss" | "draw" | null>(null)

  const handleColorSelect = (color: "white" | "black") => {
    setPlayerColor(color)
    setGamePhase("playing")
  }

  const handleSquareClick = (index: number) => {
    if (selectedSquare === null) {
      setSelectedSquare(index)
    } else {
      setMoves((prev) => prev + 1)
      setSelectedSquare(null)

      if (moves >= 5) {
        setGamePhase("result")
        setGameResult("draw")
      }
    }
  }

  const handleGameEnd = () => {
    setGamePhase("result")
    setGameResult("win")
  }

  if (gamePhase === "piece-select") {
    return (
      <div className="flex flex-col gap-6 items-center justify-center">
        <h2 className="text-2xl font-bold text-white text-center">Choose Your Color</h2>
        <div className="flex gap-4">
          <GameButton onClick={() => handleColorSelect("white")} className="w-32 h-32">
            <div className="text-4xl">♔</div>
            <p className="text-sm mt-2">White</p>
          </GameButton>
          <GameButton variant="secondary" onClick={() => handleColorSelect("black")} className="w-32 h-32">
            <div className="text-4xl">♚</div>
            <p className="text-sm mt-2">Black</p>
          </GameButton>
        </div>
      </div>
    )
  }

  if (gamePhase === "result") {
    return (
      <div className="flex flex-col gap-6 items-center justify-center">
        <div className="text-center">
          <h2
            className={`text-3xl font-bold mb-2 ${gameResult === "win" ? "text-green-400" : gameResult === "loss" ? "text-red-400" : "text-yellow-400"}`}
          >
            {gameResult === "win" ? "Victory!" : gameResult === "loss" ? "Defeated!" : "Draw!"}
          </h2>
          <p className="text-gray-400">After {moves} moves</p>
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
        <p className="text-gray-400 text-sm mb-1">Playing as {playerColor?.toUpperCase()}</p>
        <p className="text-lg font-semibold text-white">Moves: {moves}</p>
      </div>

      <div className="grid grid-cols-8 gap-1 bg-gray-700 p-2 rounded-lg">
        {Array.from({ length: 64 }).map((_, index) => (
          <div
            key={index}
            onClick={() => handleSquareClick(index)}
            className={`aspect-square rounded cursor-pointer transition-all ${
              (Math.floor(index / 8) + (index % 8)) % 2 === 0 ? "bg-amber-100" : "bg-amber-700"
            } ${selectedSquare === index ? "ring-2 ring-yellow-400" : ""}`}
          />
        ))}
      </div>

      <GameButton onClick={handleGameEnd} className="w-full h-12">
        Resign
      </GameButton>
    </div>
  )
}
