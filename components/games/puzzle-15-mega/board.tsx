// Puzzle-15 Mega game board component

"use client"

import { useState, useEffect } from "react"
import { Puzzle15Mega } from "@/lib/games/puzzle-15-mega/game-logic"
import type { Puzzle15State } from "@/lib/games/puzzle-15-mega/game-logic"
import { Card } from "@/components/ui/card"

interface Puzzle15BoardProps {
  theme: "numbers" | "picture" | "symbols" | "colors"
}

export function Puzzle15Board({ theme }: Puzzle15BoardProps) {
  const [game] = useState(() => new Puzzle15Mega(theme))
  const [state, setState] = useState<Puzzle15State>(game.getState())
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(game.getElapsedTime())
    }, 1000)
    return () => clearInterval(timer)
  }, [game])

  const handleTileClick = (tileNum: number) => {
    if (game.moveTile(tileNum, 1)) {
      setState(game.getState())
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        <Card className="p-3 text-center">
          <div className="text-xs text-gray-400">Moves</div>
          <div className="text-2xl font-bold">{state.moves}</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xs text-gray-400">Time</div>
          <div className="text-2xl font-bold">{formatTime(elapsed)}</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xs text-gray-400">Theme</div>
          <div className="text-lg font-bold capitalize">{state.theme}</div>
        </Card>
      </div>

      {/* Board */}
      <div className="grid grid-cols-8 gap-1 p-4 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-purple-500/30">
        {state.board.map((num, idx) => (
          <button
            key={idx}
            onClick={() => handleTileClick(num)}
            className={`
              w-14 h-14 rounded-lg font-bold text-lg transition-all
              ${
                num === 0
                  ? "bg-transparent"
                  : "bg-gradient-to-br from-purple-500 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 cursor-pointer"
              }
            `}
          >
            {num !== 0 && num}
          </button>
        ))}
      </div>

      {state.isComplete && (
        <Card className="w-full max-w-md p-4 text-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
          <h2 className="text-xl font-bold mb-2">Puzzle Solved!</h2>
          <p className="text-sm">
            {state.moves} moves in {formatTime(elapsed)}
          </p>
        </Card>
      )}
    </div>
  )
}
