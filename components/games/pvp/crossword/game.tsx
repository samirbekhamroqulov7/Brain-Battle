"use client"

import { useState } from "react"
import { GameCard } from "@/components/ui/game-card"
import { GameButton } from "@/components/ui/game-button"

const WORDS = ["BRAIN", "PUZZLE", "CHESS", "GAME", "STRATEGY"]

export function CrosswordPvP() {
  const [gamePhase, setGamePhase] = useState<"playing" | "result">("playing")
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [currentWord, setCurrentWord] = useState("")
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [currentPlayer, setCurrentPlayer] = useState("1")

  const handleWordSubmit = () => {
    const word = currentWord.toUpperCase()
    if (WORDS.includes(word) && !foundWords.includes(word)) {
      setFoundWords([...foundWords, word])

      if (currentPlayer === "1") {
        setPlayer1Score((prev) => prev + 10)
      } else {
        setPlayer2Score((prev) => prev + 10)
      }

      if (foundWords.length + 1 >= WORDS.length) {
        setGamePhase("result")
      }

      setCurrentPlayer(currentPlayer === "1" ? "2" : "1")
    }

    setCurrentWord("")
  }

  if (gamePhase === "result") {
    return (
      <div className="flex flex-col gap-6 items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-400 mb-2">All Words Found!</h2>
          <p className="text-gray-400">Great teamwork!</p>
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
        <p className="text-gray-400 text-xs mt-1">
          Found {foundWords.length}/{WORDS.length}
        </p>
      </div>

      <GameCard className="p-6">
        <p className="text-center text-gray-400 text-sm mb-4">Find these words:</p>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {WORDS.map((word) => (
            <span
              key={word}
              className={`px-3 py-1 rounded text-sm font-semibold ${foundWords.includes(word) ? "bg-green-500/30 text-green-400" : "bg-gray-700 text-gray-400"}`}
            >
              {word}
            </span>
          ))}
        </div>

        <input
          type="text"
          value={currentWord}
          onChange={(e) => setCurrentWord(e.target.value)}
          placeholder="Type a word..."
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white mb-4"
          onKeyPress={(e) => e.key === "Enter" && handleWordSubmit()}
        />

        <GameButton onClick={handleWordSubmit} className="w-full h-12">
          Submit Word
        </GameButton>
      </GameCard>
    </div>
  )
}
