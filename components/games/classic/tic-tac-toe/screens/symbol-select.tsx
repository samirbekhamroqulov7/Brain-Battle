"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Circle, ChevronRight } from "lucide-react"

interface SymbolSelectProps {
  onSelect: (symbol: "X" | "O") => void
  onBack: () => void
  opponent: "ai" | "player2"
  mode: "3x3" | "5x5" | "7x7"
}

export function SymbolSelect({ onSelect, onBack, opponent, mode }: SymbolSelectProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<"X" | "O">("X")

  const modeNames = {
    "3x3": "3×3 Классический",
    "5x5": "5×5 Тактический", 
    "7x7": "7×7 Эпический"
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Выберите сторону
          </h1>
          <p className="text-gray-400 text-sm">Крестики (X) всегда ходят первыми!</p>
        </div>

        {/* Game Info */}
        <div className="bg-gray-800/30 rounded-xl p-3 mb-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-400 mb-1">Против</div>
              <div className="text-sm font-semibold text-white">
                {opponent === "ai" ? "КОМПЬЮТЕР" : "ИГРОК 2"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Режим</div>
              <div className="text-sm font-semibold text-white">{modeNames[mode]}</div>
            </div>
          </div>
        </div>

        {/* Symbol Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* X Symbol */}
          <button
            onClick={() => setSelectedSymbol("X")}
            className={`min-h-[140px] bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border-2 p-3 flex flex-col items-center justify-center relative ${
              selectedSymbol === "X" 
                ? "border-cyan-500 shadow-lg shadow-cyan-500/30" 
                : "border-gray-700/50"
            }`}
          >
            <div className="relative mb-3">
              <div className={`w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center ${
                selectedSymbol === "X" ? "scale-110" : ""
              }`}>
                <X className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-sm font-bold text-white mb-1">КРЕСТИКИ</h2>
              <div className="text-xs text-cyan-300">Первый ход</div>
              <div className="text-xs text-gray-400 mt-1">Вы начинаете игру</div>
            </div>
          </button>

          {/* O Symbol */}
          <button
            onClick={() => setSelectedSymbol("O")}
            className={`min-h-[140px] bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl border-2 p-3 flex flex-col items-center justify-center relative ${
              selectedSymbol === "O" 
                ? "border-pink-500 shadow-lg shadow-pink-500/30" 
                : "border-gray-700/50"
            }`}
          >
            <div className="relative mb-3">
              <div className={`w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center ${
                selectedSymbol === "O" ? "scale-110" : ""
              }`}>
                <Circle className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-sm font-bold text-white mb-1">НОЛИКИ</h2>
              <div className="text-xs text-pink-300">Второй ход</div>
              <div className="text-xs text-gray-400 mt-1">Отвечаете на ход соперника</div>
            </div>
          </button>
        </div>

        {/* Important Note */}
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 mb-4">
          <p className="text-xs text-cyan-300 text-center">
            ⚠️ Важно: Крестики (X) всегда ходят первыми. 
            Если вы выбираете нолики, первым ходит соперник.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onSelect(selectedSymbol)}
            className={`px-4 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm ${
              selectedSymbol === "X"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            }`}
          >
            <span>Играть за {selectedSymbol === "X" ? "крестики" : "нолики"}</span>
            <ChevronRight className="w-4 h-4" />
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
