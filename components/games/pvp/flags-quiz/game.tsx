"use client"

import { useState } from "react"
import { GameCard } from "@/components/ui/game-card"
import { GameButton } from "@/components/ui/game-button"

const FLAGS = [
  { flag: "🇺🇸", answer: "USA" },
  { flag: "🇬🇧", answer: "UK" },
  { flag: "🇫🇷", answer: "FRANCE" },
  { flag: "🇩🇪", answer: "GERMANY" },
  { flag: "🇯🇵", answer: "JAPAN" },
]

export function FlagsQuizPvP() {
  const [gamePhase, setGamePhase] = useState<"playing" | "result">("playing")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [currentPlayer, setCurrentPlayer] = useState("1")

  const handleSubmit = () => {
    if (userAnswer.toUpperCase() === FLAGS[currentIndex].answer) {
      if (currentPlayer === "1") {
        setPlayer1Score((prev) => prev + 1)
      } else {
        setPlayer2Score((prev) => prev + 1)
      }
    }

    if (currentIndex + 1 >= FLAGS.length) {
      setGamePhase("result")
    } else {
      setCurrentIndex((prev) => prev + 1)
      setUserAnswer("")
      setCurrentPlayer(currentPlayer === "1" ? "2" : "1")
    }
  }

  if (gamePhase === "result") {
    return (
      <div className="flex flex-col gap-6 items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-400 mb-2">Quiz Complete!</h2>
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
        <p className="text-gray-400 text-xs mt-1">
          Question {currentIndex + 1}/{FLAGS.length}
        </p>
      </div>

      <GameCard className="p-8 text-center">
        <p className="text-6xl mb-6">{FLAGS[currentIndex].flag}</p>

        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Country name"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white text-center text-lg mb-4"
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        />

        <GameButton onClick={handleSubmit} className="w-full h-12">
          Submit
        </GameButton>
      </GameCard>
    </div>
  )
}
