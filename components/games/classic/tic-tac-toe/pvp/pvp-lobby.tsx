"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  Users, Cpu, Zap, Target, Clock, Trophy,
  Gamepad2, Cross, Shield, Crown, Sparkles
} from "lucide-react"

interface PvpLobbyProps {
  onStartMatch: (matchId: string) => void
  onBack: () => void
}

export function PvpLobby({ onStartMatch, onBack }: PvpLobbyProps) {
  const router = useRouter()
  const [searching, setSearching] = useState(false)
  const [countdown, setCountdown] = useState(5)

  const handleQuickPlay = () => {
    setSearching(true)
    
    // Симуляция поиска AI противника
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Создаем матч с AI
          const matchId = `pvp_match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          
          // Сохраняем настройки матча
          localStorage.setItem('tic_tac_toe_pvp_match', JSON.stringify({
            id: matchId,
            gameType: 'tic-tac-toe',
            mode: '3x3', // будет выбран случайно
            aiOpponent: true,
            timestamp: Date.now()
          }))
          
          // Запускаем матч
          setTimeout(() => onStartMatch(matchId), 500)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const matchModes = [
    {
      mode: "3x3",
      name: "Классический",
      description: "3×3 доска, 5 раундов",
      rounds: 5,
      winsNeeded: 3,
      icon: Gamepad2,
      color: "from-blue-500 to-cyan-500"
    },
    {
      mode: "5x5",
      name: "Тактический",
      description: "5×5 доска, 3 раунда",
      rounds: 3,
      winsNeeded: 2,
      icon: Cross,
      color: "from-purple-500 to-pink-500"
    },
    {
      mode: "7x7",
      name: "Эпический",
      description: "7×7 доска, 1 раунд",
      rounds: 1,
      winsNeeded: 1,
      icon: Crown,
      color: "from-amber-500 to-orange-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 rounded-lg transition-colors"
        >
          ← Назад
        </button>
        
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          PvP Арена
        </h1>
        
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Quick Play Button */}
      <div className="mb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleQuickPlay}
          disabled={searching}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {searching ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin">🌀</div>
              <span>Поиск противника... {countdown}s</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-5 h-5" />
              <span>БЫСТРАЯ ИГРА</span>
            </div>
          )}
        </motion.button>
        <p className="text-center text-gray-400 text-sm mt-2">
          {searching ? "Ищем AI соперника..." : "Начните случайный матч против AI"}
        </p>
      </div>

      {/* Match Modes */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Режимы матча</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {matchModes.map((mode) => {
            const Icon = mode.icon
            return (
              <motion.div
                key={mode.mode}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer"
                onClick={() => {
                  const matchId = `pvp_match_${Date.now()}_${mode.mode}`
                  localStorage.setItem('tic_tac_toe_pvp_match', JSON.stringify({
                    id: matchId,
                    gameType: 'tic-tac-toe',
                    mode: mode.mode,
                    aiOpponent: true,
                    timestamp: Date.now()
                  }))
                  onStartMatch(matchId)
                }}
              >
                <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 hover:border-cyan-500/30 transition-colors">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${mode.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-1">{mode.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">{mode.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300">Побед: {mode.winsNeeded}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">Раундов: {mode.rounds}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50">
        <h3 className="font-bold text-white mb-4">Статистика PvP</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400">0</div>
            <div className="text-xs text-gray-400">Матчей</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400">0</div>
            <div className="text-xs text-gray-400">Побед</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">0%</div>
            <div className="text-xs text-gray-400">Win Rate</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">1</div>
            <div className="text-xs text-gray-400">Ранг</div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {searching && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <motion.div
                  className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="w-12 h-12 text-cyan-400" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Поиск противника</h2>
              <p className="text-gray-400 mb-4">
                Ищем AI соперника для честного матча
              </p>
              
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-2">
                    <div className="text-2xl">🎮</div>
                  </div>
                  <div className="text-sm text-white">Вы</div>
                </div>
                
                <div className="text-3xl font-bold text-gray-400">VS</div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-2">
                    <Cpu className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm text-white">AI Бот</div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-300">Начинаем через: {countdown}s</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setSearching(false)
                  setCountdown(5)
                }}
                className="w-full py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all"
              >
                Отменить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
