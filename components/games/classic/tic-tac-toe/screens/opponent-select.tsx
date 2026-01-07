"use client"

import { useState } from "react"
import { OpponentType } from "../types"
import { motion } from "framer-motion"
import { Cpu, Users } from "lucide-react"

interface OpponentSelectProps {
  onSelect: (opponent: OpponentType) => void
  onBack: () => void
}

export function OpponentSelect({ onSelect, onBack }: OpponentSelectProps) {
  const [hovered, setHovered] = useState<OpponentType | null>(null)

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              TIC-TAC-TOE
            </span>
          </h1>
          <p className="text-gray-400 text-sm">Выберите своего соперника</p>
        </motion.div>

        {/* Opponent Selection */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Player 2 Option */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.03 }}
            onMouseEnter={() => setHovered("player2")}
            onMouseLeave={() => setHovered(null)}
            className="relative"
          >
            <button
              onClick={() => onSelect("player2")}
              className="w-full min-h-[180px] bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 flex flex-col items-center justify-center relative overflow-hidden group"
            >
              {/* 3D Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl transition-opacity duration-300 ${
                hovered === "player2" ? "opacity-100" : "opacity-0"
              }`}></div>

              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center transform rotate-45 group-hover:rotate-90 transition-transform duration-500">
                  <Users className="w-10 h-10 text-white -rotate-45" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">ИГРОК 2</h2>
                <p className="text-gray-300 mb-4 text-sm">На одном устройстве</p>
                <p className="text-gray-400 text-xs max-w-xs">
                  Крестики (X) ходят первыми
                </p>
              </div>
            </button>
          </motion.div>

          {/* AI Option */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            onMouseEnter={() => setHovered("ai")}
            onMouseLeave={() => setHovered(null)}
            className="relative"
          >
            <button
              onClick={() => onSelect("ai")}
              className="w-full min-h-[180px] bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 flex flex-col items-center justify-center relative overflow-hidden group"
            >
              {/* 3D Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl transition-opacity duration-300 ${
                hovered === "ai" ? "opacity-100" : "opacity-0"
              }`}></div>

              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center transform rotate-45 group-hover:rotate-90 transition-transform duration-500">
                  <Cpu className="w-10 h-10 text-white -rotate-45" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">КОМПЬЮТЕР</h2>
                <p className="text-gray-300 mb-4 text-sm">Искусственный интеллект</p>
                <p className="text-gray-400 text-xs max-w-xs">
                  Крестики (X) ходят первыми
                </p>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm text-white rounded-xl font-semibold transition-all hover:scale-105 border border-gray-700/50 text-sm"
          >
            ← Назад в меню
          </button>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-gray-500 text-xs"
        >
          <p>Крестики (X) всегда ходят первыми</p>
        </motion.div>
      </div>
    </div>
  )
}
