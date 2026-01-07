"use client"

import { GameMode } from "../types"
import { motion } from "framer-motion"

interface GameBoard3DProps {
  board: Array<string | null>
  mode: GameMode
  winningLine: number[] | null
  onCellClick: (index: number) => void
  disabled: boolean
}

export function GameBoard3D({ board, mode, winningLine, onCellClick, disabled }: GameBoard3DProps) {
  const size = mode === "3x3" ? 3 : mode === "5x5" ? 5 : 7

  // Увеличиваем размеры ячеек для лучшей видимости
  const getCellSize = () => {
    if (size === 3) {
      return "w-24 h-24 sm:w-28 sm:h-28"
    }
    if (size === 5) {
      return "w-14 h-14 sm:w-16 sm:h-16"
    }
    return "w-10 h-10 sm:w-12 sm:h-12"
  }

  const getTextSize = () => {
    if (size === 3) {
      return "text-5xl sm:text-6xl"
    }
    if (size === 5) {
      return "text-3xl sm:text-4xl"
    }
    return "text-2xl sm:text-3xl"
  }

  const getGridCols = () => {
    return size === 3 ? "grid-cols-3" : size === 5 ? "grid-cols-5" : "grid-cols-7"
  }

  const getGap = () => {
    if (size === 3) {
      return "gap-3 sm:gap-4"
    }
    if (size === 5) {
      return "gap-2 sm:gap-2.5"
    }
    return "gap-1.5 sm:gap-2"
  }

  const cellSize = getCellSize()
  const textSize = getTextSize()
  const gridCols = getGridCols()
  const gap = getGap()

  return (
    <div className="flex justify-center items-center w-full p-1">
      <div 
        className={`grid ${gridCols} ${gap} bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-lg p-4 rounded-xl sm:rounded-2xl border border-gray-700/50 shadow-lg`}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {board.map((cell, index) => {
          const row = Math.floor(index / size)
          const col = index % size
          const isWinningCell = winningLine?.includes(index)

          return (
            <motion.button
              key={index}
              onClick={() => onCellClick(index)}
              disabled={disabled || !!cell}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                rotateX: isWinningCell ? [0, 360, 0] : 0,
                rotateY: isWinningCell ? [0, 360, 0] : 0
              }}
              transition={{ 
                delay: (row * size + col) * 0.02,
                rotateX: isWinningCell ? { duration: 2, repeat: Infinity } : {},
                rotateY: isWinningCell ? { duration: 2, repeat: Infinity } : {}
              }}
              whileHover={!disabled && !cell ? { 
                scale: 1.05, 
                y: -3, 
                rotateX: 3,
                rotateY: 3,
                transition: { type: "spring", stiffness: 300 }
              } : {}}
              whileTap={!disabled && !cell ? { scale: 0.95 } : {}}
              className={`relative ${cellSize} rounded-xl flex items-center justify-center transition-all duration-300 ${
                !cell && !disabled ? 'cursor-pointer' : 'cursor-default'
              }`}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* 3D Cell Base */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl"
                style={{
                  transform: 'translateZ(-8px)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                }}
              ></div>

              {/* 3D Cell Face */}
              <div 
                className={`absolute inset-0 rounded-xl flex items-center justify-center ${
                  isWinningCell 
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' 
                    : 'bg-gradient-to-br from-gray-700/50 to-gray-800/50'
                }`}
                style={{
                  transform: 'translateZ(0px)',
                  boxShadow: isWinningCell
                    ? '0 0 20px rgba(251, 191, 36, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    : '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                }}
              >
                {/* Cell Content */}
                {cell === "X" && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`${textSize} font-bold`}
                  >
                    <span className="text-transparent bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text">
                      X
                    </span>
                  </motion.div>
                )}

                {cell === "O" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`${textSize} font-bold`}
                  >
                    <span className="text-transparent bg-gradient-to-br from-pink-400 via-purple-400 to-pink-400 bg-clip-text">
                      O
                    </span>
                  </motion.div>
                )}

                {/* Winning Cell Effect */}
                {isWinningCell && (
                  <>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity 
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-xl"
                    ></motion.div>
                    <div className="absolute inset-0 border-2 border-gradient-to-r from-yellow-400 to-orange-500 rounded-xl"></div>
                  </>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
