"use client"

import { useState } from "react"
import { GameCard } from "@/components/ui/game-card"
import { GameButton } from "@/components/ui/game-button"

export function CheckersPvP() {
  const [gamePhase, setGamePhase] = useState<"piece-select" | "playing" | "result">("piece-select")
  const [playerColor, setPlayerColor] = useState<"red" | "black" | null>(null)
  const [pieces, setPieces] = useState<{ red: number; black: number }>({ red: 12, black: 12 })
  const [gameResult, setGameResult] = useState<"win" | "loss" | "draw" | null>(null)

  const handleColorSelect = (color: "red" | "black") => {
    setPlayerColor(color)
    setGamePhase("playing")
  }

  const handleCapturePiece = () => {
    setPieces((prev) => ({
      ...prev,
      [playerColor === "red" ? "black" : "red"]: prev[playerColor === "red" ? "black" : "red"] - 1,
    }))

    if (pieces.black === 1 || pieces.red === 1) {
      setGamePhase("result")
      setGameResult("win")
    }
  }

  if (gamePhase === "piece-select") {
    return (
      <div className="flex flex-col gap-6 items-center justify-center">
        <h2 className="text-2xl font-bold text-white text-center">Choose Your Color</h2>
        <div className="flex gap-4">
          <GameButton onClick={() => handleColorSelect("red")} className="w-32 h-32 bg-red-600/70">
            <div className="text-4xl">●</div>
            <p className="text-sm mt-2">Red</p>
          </GameButton>
          <GameButton
            variant="secondary"
            onClick={() => handleColorSelect("black")}
            className="w-32 h-32 bg-gray-700/70"
          >
            <div className="text-4xl text-yellow-200">●</div>
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
          <h2 className="text-3xl font-bold text-green-400 mb-2">Victory!</h2>
          <p className="text-gray-400">You eliminated all opponent pieces</p>
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
          <p className="text-gray-400 text-sm mb-2">Your Pieces</p>
          <p className="text-3xl font-bold text-red-400">{playerColor === "red" ? pieces.red : pieces.black}</p>
        </GameCard>
        <GameCard className="p-4 text-center">
          <p className="text-gray-400 text-sm mb-2">Enemy Pieces</p>
          <p className="text-3xl font-bold text-blue-400">{playerColor === "red" ? pieces.black : pieces.red}</p>
        </GameCard>
      </div>

      <div className="grid grid-cols-8 gap-1 bg-gray-700 p-2 rounded-lg">
        {Array.from({ length: 64 }).map((_, index) => (
          <div
            key={index}
            onClick={() => (Math.floor(index / 8) + (index % 8)) % 2 === 0 && handleCapturePiece()}
            className={`aspect-square rounded cursor-pointer transition-all ${
              (Math.floor(index / 8) + (index % 8)) % 2 === 0 ? "bg-amber-100 hover:bg-amber-200" : "bg-amber-700"
            }`}
          />
        ))}
      </div>

      <GameButton onClick={() => setGamePhase("result")} variant="secondary" className="w-full h-12">
        Give Up
      </GameButton>
    </div>
  )
}
