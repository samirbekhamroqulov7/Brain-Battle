"use client"

import { useState } from "react"
import { GameCard } from "@/components/ui/game-card"
import { GameButton } from "@/components/ui/game-button"

const MEMORY_PAIRS = ["🌟", "🎯", "🎨", "🎭", "🎪", "🎸"]

export function MemoryMatchPvP() {
  const [gamePhase, setGamePhase] = useState<"playing" | "result">("playing")
  const [cards, setCards] = useState(
    MEMORY_PAIRS.flatMap((item) => [item, item])
      .sort(() => Math.random() - 0.5)
      .map((item, i) => ({ id: i, item, revealed: false, matched: false })),
  )
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [currentPlayer, setCurrentPlayer] = useState("1")

  const handleCardClick = (index: number) => {
    if (selectedCards.includes(index) || cards[index].matched || selectedCards.length === 2) return

    const newSelectedCards = [...selectedCards, index]
    setSelectedCards(newSelectedCards)

    if (newSelectedCards.length === 2) {
      const [first, second] = newSelectedCards
      if (cards[first].item === cards[second].item) {
        setTimeout(() => {
          setCards((prev) => prev.map((card, i) => (i === first || i === second ? { ...card, matched: true } : card)))

          if (currentPlayer === "1") {
            setPlayer1Score((prev) => prev + 1)
          } else {
            setPlayer2Score((prev) => prev + 1)
          }

          if (cards.filter((c) => c.matched || c.id === first || c.id === second).length === cards.length) {
            setGamePhase("result")
          }

          setSelectedCards([])
        }, 500)
      } else {
        setTimeout(() => {
          setCurrentPlayer(currentPlayer === "1" ? "2" : "1")
          setSelectedCards([])
        }, 500)
      }
    }
  }

  if (gamePhase === "result") {
    return (
      <div className="flex flex-col gap-6 items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-400 mb-2">Game Over!</h2>
          <p className="text-gray-400">
            Final Score - P1: {player1Score}, P2: {player2Score}
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
        <p className={`text-sm ${currentPlayer === "1" ? "text-blue-400" : "text-purple-400"}`}>
          Player {currentPlayer}'s Turn
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => handleCardClick(i)}
            className={`aspect-square rounded-lg font-bold text-2xl transition-all transform ${
              card.matched
                ? "bg-green-500/30 text-green-400"
                : card.revealed || selectedCards.includes(i)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-400"
            } ${selectedCards.includes(i) ? "scale-110" : ""}`}
          >
            {card.matched || selectedCards.includes(i) ? card.item : "?"}
          </button>
        ))}
      </div>
    </div>
  )
}
