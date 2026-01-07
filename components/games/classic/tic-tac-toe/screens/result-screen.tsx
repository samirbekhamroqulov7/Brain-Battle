"use client"

import { OpponentType } from "../types"
import { motion } from "framer-motion"
import { Trophy, Home, RotateCcw } from "lucide-react"

interface ResultScreenProps {
  result: "win" | "lose" | "draw"
  opponent: OpponentType
  matchStats: {
    matches: number
    wins: number
    gamesInMatch: number
    currentMatchWins: number
    currentMatchLosses: number
    draws: number
  }
  onRestart: () => void
  onMenu: () => void
}

export function ResultScreen({ result, opponent, matchStats, onRestart, onMenu }: ResultScreenProps) {
  const getTitle = () => {
    if (result === "win") return "ПОБЕДА!"
    if (result === "lose") return opponent === "ai" ? "ПОРАЖЕНИЕ" : "СОПЕРНИК ПОБЕДИЛ"
    return "НИЧЬЯ!"
  }

  const getEmoji = () => {
    if (result === "win") return "🎉"
    if (result === "lose") return "😢"
    return "🤝"
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Result */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{getEmoji()}</div>
          <h1 className="text-3xl font-bold text-white mb-2">{getTitle()}</h1>
          
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="flex justify-center items-center gap-6 mb-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400">{matchStats.currentMatchWins}</div>
                <div className="text-sm text-gray-400">Вы</div>
              </div>
              <div className="text-2xl text-gray-500">:</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400">{matchStats.currentMatchLosses}</div>
                <div className="text-sm text-gray-400">{opponent === "ai" ? "КОМПЬЮТЕР" : "P2"}</div>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-400">
              Раундов сыграно: {matchStats.gamesInMatch}
            </div>
          </div>
        </div>

        {/* Total Stats */}
        <div className="bg-gray-800/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-white">Общая статистика</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{matchStats.matches}</div>
              <div className="text-xs text-gray-400">Матчей</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{matchStats.wins}</div>
              <div className="text-xs text-gray-400">Побед</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {matchStats.matches > 0 ? Math.round((matchStats.wins / matchStats.matches) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-400">Процент</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Играть снова
          </button>

          <button
            onClick={onMenu}
            className="w-full px-4 py-3 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl text-white font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            В меню
          </button>
        </div>
      </div>
    </div>
  )
}
