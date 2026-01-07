"use client"

import { useState } from "react"
import { GameButton } from "@/components/ui/game-button"

export function SudokuPvP() {
  const [gamePhase, setGamePhase] = useState<"difficulty-select" | "playing" | "result">("difficulty-select")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | null>(null)
  const [fillCount, setFillCount] = useState(0)
  const [timer, setTimer] = useState(300)
  const [gameResult, setGameResult] = useState<"win" | "loss" | null>(null)

  const handleDifficultySelect = (diff: "easy" | "medium" | "hard") => {
    setDifficulty(diff)
    setGamePhase("playing")
    setTimer(diff === "easy" ? 600 : diff === "medium" ? 300 : 120)
  }

  const handleCellFill = () => {
    const newCount = fillCount + 1
    setFillCount(newCount)

    if (newCount >= 5) {
      setGamePhase("result")
      setGameResult("win")
    }
  }

  if (gamePhase === "difficulty-select") {
    return (
      <div className="flex flex-col gap-6 items-center justify-center">
        <h2 className="text-2xl font-bold text-white text-center">Select Difficulty</h2>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <GameButton onClick={() => handleDifficultySelect("easy")} className="h-14">
            Easy - 10 min
          </GameButton>
          <GameButton onClick={() => handleDifficultySelect("medium")} className="h-14">
            Medium - 5 min
          </GameButton>
          <GameButton onClick={() => handleDifficultySelect("hard")} className="h-14">
            Hard - 2 min
          </GameButton>
        </div>
      </div>
    )
  }

  if (gamePhase === "result") {
    return (
      <div className="flex flex-col gap-6 items-center justify-center">
        <div className="text-center">
          <h2 className={`text-3xl font-bold mb-2 ${gameResult === "win" ? "text-green-400" : "text-red-400"}`}>
            {gameResult === "win" ? "Puzzle Solved!" : "Time's Up!"}
          </h2>
          <p className="text-gray-400">Filled {fillCount} cells correctly</p>
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
        <p className="text-gray-400 text-sm mb-1">
          {difficulty?.toUpperCase()} - {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
        </p>
        <p className="text-lg font-semibold text-white">Cells Filled: {fillCount}/5</p>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-gray-800 p-4 rounded-lg">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="grid grid-cols-3 gap-1 border border-gray-600 p-1">
            {Array.from({ length: 9 }).map((_, j) => (
              <button
                key={`${i}-${j}`}
                onClick={handleCellFill}
                className="aspect-square bg-gray-700 hover:bg-gray-600 rounded text-sm font-bold text-white transition-colors"
              />
            ))}
          </div>
        ))}
      </div>

      <GameButton onClick={() => setGamePhase("result")} variant="secondary" className="w-full h-12">
        Give Up
      </GameButton>
    </div>
  )
}
