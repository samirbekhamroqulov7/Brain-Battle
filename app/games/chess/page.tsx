// Chess Hyper game page with mode selection

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ChessHyper } from "@/lib/games/chess-hyper/game-logic"

type ChessMode = "classic" | "chaos" | "double-kings" | "rotation"

export default function ChessHyperPage() {
  const [selectedMode, setSelectedMode] = useState<ChessMode | null>(null)
  const [game, setGame] = useState<ChessHyper | null>(null)

  const modes: Record<ChessMode, { title: string; description: string }> = {
    classic: { title: "Classic", description: "Standard chess rules" },
    chaos: { title: "Chaos Mode", description: "Random piece spawning" },
    "double-kings": { title: "Double Kings", description: "Two kings per player" },
    rotation: { title: "Rotation", description: "Board rotates each turn" },
  }

  if (!selectedMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Chess Hyper
        </h1>

        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
          {(Object.entries(modes) as [ChessMode, { title: string; description: string }][]).map(
            ([mode, { title, description }]) => (
              <Card
                key={mode}
                className="p-6 cursor-pointer hover:bg-purple-500/20 transition-all"
                onClick={() => setSelectedMode(mode)}
              >
                <h3 className="font-bold mb-1">{title}</h3>
                <p className="text-sm text-gray-400">{description}</p>
              </Card>
            ),
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <Button onClick={() => setSelectedMode(null)} className="mb-6">
        Back
      </Button>
      <h1 className="text-3xl font-bold mb-6 text-center">{modes[selectedMode].title}</h1>
      {/* Game board would go here */}
    </div>
  )
}
