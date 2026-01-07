"use client"

import { useState, useEffect } from "react"
import { GameCard } from "@/components/ui/game-card"
import { GameButton } from "@/components/ui/game-button"

export function MathDuelPvP() {
  const [gamePhase, setGamePhase] = useState<"playing" | "result">("playing")
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [currentAnswer, setCurrentAnswer] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [currentPlayer, setCurrentPlayer] = useState("1")

  useEffect(() => {
    generateQuestion()
  }, [])

  const generateQuestion = () => {
    const a = Math.floor(Math.random() * 20) + 1
    const b = Math.floor(Math.random() * 20) + 1
    const op = ["+", "-", "*"][Math.floor(Math.random() * 3)]

    let answer = 0
    let question = ""

    if (op === "+") {
      answer = a + b
      question = `${a} + ${b}`
    } else if (op === "-") {
      answer = a - b
      question = `${a} - ${b}`
    } else {
      answer = a * b
      question = `${a} × ${b}`
    }

    setCurrentQuestion(question)
    setCurrentAnswer(answer)
    setUserAnswer("")
  }

  const handleSubmit = () => {
    if (Number.parseInt(userAnswer) === currentAnswer) {
      if (currentPlayer === "1") {
        const newScore = player1Score + 1
        setPlayer1Score(newScore)
        if (newScore >= 5) {
          setGamePhase("result")
        }
      } else {
        const newScore = player2Score + 1
        setPlayer2Score(newScore)
        if (newScore >= 5) {
          setGamePhase("result")
        }
      }
    }

    generateQuestion()
    setCurrentPlayer(currentPlayer === "1" ? "2" : "1")
  }

  if (gamePhase === "result") {
    return (
      <div className="flex flex-col gap-6 items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-400 mb-2">
            {player1Score > player2Score ? "Player 1" : "Player 2"} Wins!
          </h2>
          <p className="text-gray-400">First to 5 correct answers</p>
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

      <GameCard className="p-8 text-center">
        <p className="text-gray-400 text-sm mb-4">Solve the equation:</p>
        <p className="text-5xl font-bold text-white mb-6">{currentQuestion} = ?</p>

        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your answer"
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white text-center text-2xl mb-4"
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        />

        <GameButton onClick={handleSubmit} className="w-full h-12">
          Submit
        </GameButton>
      </GameCard>
    </div>
  )
}
