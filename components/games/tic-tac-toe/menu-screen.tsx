"use client"

import { GameMode } from "./types"
import { GameButton } from "@/components/ui/game-button"

interface MenuScreenProps {
  onStartGame: (mode: GameMode) => void
  stats: {
    playerWins: number
    aiWins: number
    draws: number
  }
}

export function MenuScreen({ onStartGame, stats }: MenuScreenProps) {
  const modes: { mode: GameMode; label: string; description: string; color: string }[] = [
    {
      mode: "3x3",
      label: "3×3",
      description: "Классическая версия",
      color: "from-blue-500 to-cyan-400",
    },
    {
      mode: "5x5",
      label: "5×5",
      description: "Продвинутый уровень",
      color: "from-purple-500 to-pink-400",
    },
    {
      mode: "7x7",
      label: "7×7",
      description: "Экстремальный вызов",
      color: "from-orange-500 to-red-400",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-wide">TicTacToe</h1>
        <p className="text-gray-300">Выберите режим игры</p>
      </div>

      <div className="space-y-4">
        {modes.map(({ mode, label, description, color }) => (
          <button
            key={mode}
            onClick={() => onStartGame(mode)}
            className={`
              w-full h-20 rounded-xl bg-gradient-to-br ${color} 
              shadow-lg hover:scale-[1.02] transition-all duration-200
              flex flex-col items-center justify-center
              font-bold text-white
            `}
          >
            <span className="text-2xl">{label}</span>
            <span className="text-sm opacity-90">{description}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="rounded-xl bg-black/50 p-3 text-center">
          <p className="text-xs text-gray-400">ПОБЕДЫ</p>
          <p className="font-bold text-lg text-emerald-400">{stats.playerWins}</p>
        </div>
        <div className="rounded-xl bg-black/50 p-3 text-center">
          <p className="text-xs text-gray-400">НИЧЬИ</p>
          <p className="font-bold text-lg text-amber-400">{stats.draws}</p>
        </div>
        <div className="rounded-xl bg-black/50 p-3 text-center">
          <p className="text-xs text-gray-400">ПОРАЖЕНИЯ</p>
          <p className="font-bold text-lg text-red-400">{stats.aiWins}</p>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        <p>Статистика сохраняется локально</p>
      </div>
    </div>
  )
}