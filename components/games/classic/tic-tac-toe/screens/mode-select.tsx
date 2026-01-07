"use client"

import { useState } from "react"
import { GameMode } from "../types"
import { motion } from "framer-motion"
import { Grid3x3, Grid, LayoutGrid, ChevronRight } from "lucide-react"

interface ModeSelectProps {
  onSelect: (mode: GameMode) => void
  onBack: () => void
  opponent: "ai" | "player2"
}

export function ModeSelect({ onSelect, onBack, opponent }: ModeSelectProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>("3x3")

  const modes = [
    { 
      id: "3x3" as GameMode, 
      name: "3×3 Классика", 
      icon: Grid3x3, 
      desc: "Быстрая игра",
      rounds: 5,
      winsNeeded: 3,
      color: "from-cyan-500 to-blue-600"
    },
    { 
      id: "5x5" as GameMode, 
      name: "5×5 Тактика", 
      icon: Grid, 
      desc: "Средняя игра",
      rounds: 3,
      winsNeeded: 2,
      color: "from-green-500 to-emerald-600"
    },
    { 
      id: "7x7" as GameMode, 
      name: "7×7 Эпик", 
      icon: LayoutGrid, 
      desc: "Долгая игра",
      rounds: 1,
      winsNeeded: 1,
      color: "from-purple-500 to-pink-600"
    },
  ]

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Выберите размер поля
          </h1>
          <p className="text-gray-400 text-sm">Против: {opponent === "ai" ? "КОМПЬЮТЕР" : "ИГРОК 2"}</p>
        </div>

        {/* Mode Selection */}
        <div className="space-y-3 mb-6">
          {modes.map((mode, index) => {
            const Icon = mode.icon
            const isSelected = selectedMode === mode.id
            
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <button
                  onClick={() => setSelectedMode(mode.id)}
                  className={`w-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border-2 p-3 flex items-center justify-between relative overflow-hidden transition-all duration-300 ${
                    isSelected 
                      ? `border-cyan-500 shadow-lg shadow-cyan-500/30` 
                      : 'border-gray-700/50 hover:border-gray-600/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${mode.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white text-sm">{mode.name}</h3>
                      <p className="text-gray-400 text-xs">{mode.desc}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-xs text-gray-300">
                        {mode.rounds} раунд{mode.rounds > 1 ? (mode.rounds > 4 ? 'ов' : 'а') : ''}
                      </div>
                      <div className="text-xs text-gray-400">
                        {mode.winsNeeded} побед{mode.winsNeeded > 1 ? 'ы' : ''}
                      </div>
                    </div>
                    {isSelected && (
                      <ChevronRight className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onSelect(selectedMode)}
            className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all hover:scale-105 text-sm"
          >
            Выбрать режим →
          </button>
          
          <button
            onClick={onBack}
            className="px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm text-white rounded-xl font-semibold transition-all hover:scale-105 text-sm"
          >
            ← Назад
          </button>
        </div>
      </div>
    </div>
  )
}
