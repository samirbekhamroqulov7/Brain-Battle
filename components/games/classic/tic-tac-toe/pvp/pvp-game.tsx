"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GameBoard } from "../game-board"
import { makeAIMove } from "../ai-logic"
import { checkWinner, initializeBoard, makeMove as makeGameMove } from "../game-logic"
import { 
  Trophy, Crown, Target, Zap, Clock, 
  RefreshCw, Home, Users, Cpu, Award
} from "lucide-react"

interface PvpGameProps {
  matchId: string
  onBack: () => void
  onMatchEnd: () => void
}

type GameMode = "3x3" | "5x5" | "7x7"
type GamePhase = "mode_selection" | "symbol_selection" | "playing" | "round_result" | "match_result"

export function PvpGame({ matchId, onBack, onMatchEnd }: PvpGameProps) {
  // Состояние матча
  const [phase, setPhase] = useState<GamePhase>("mode_selection")
  const [selectedMode, setSelectedMode] = useState<GameMode>("3x3")
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O">("X")
  
  // Игровое состояние
  const [board, setBoard] = useState<Array<string | null>>([])
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  
  // Статистика матча
  const [playerWins, setPlayerWins] = useState(0)
  const [aiWins, setAiWins] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [totalRounds, setTotalRounds] = useState(5)
  const [winsNeeded, setWinsNeeded] = useState(3)
  const [roundTime, setRoundTime] = useState(30)
  const [timeLeft, setTimeLeft] = useState(30)
  
  const aiSymbol = playerSymbol === "X" ? "O" : "X"
  const isPlayerTurn = currentPlayer === playerSymbol
  const aiName = "AI Бот"
  const aiLevel = "Средний"

  // Инициализация режима игры
  useEffect(() => {
    if (phase === "mode_selection") {
      // Случайный выбор режима
      const modes: GameMode[] = ["3x3", "5x5", "7x7"]
      const randomMode = modes[Math.floor(Math.random() * modes.length)]
      setSelectedMode(randomMode)
      
      // Настройка параметров матча в зависимости от режима
      if (randomMode === "3x3") {
        setTotalRounds(5)
        setWinsNeeded(3)
        setRoundTime(30)
      } else if (randomMode === "5x5") {
        setTotalRounds(3)
        setWinsNeeded(2)
        setRoundTime(45)
      } else {
        setTotalRounds(1)
        setWinsNeeded(1)
        setRoundTime(60)
      }
      
      setTimeLeft(roundTime)
      
      // Автоматический переход к выбору символа
      const timer = setTimeout(() => {
        setPhase("symbol_selection")
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [phase, roundTime])

  // Выбор символа
  useEffect(() => {
    if (phase === "symbol_selection") {
      // Случайный выбор символа для игрока
      const symbols: Array<"X" | "O"> = ["X", "O"]
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]
      setPlayerSymbol(randomSymbol)
      
      // Автоматический переход к игре
      const timer = setTimeout(() => {
        startNewRound()
        setPhase("playing")
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [phase])

  // Таймер раунда
  useEffect(() => {
    if (phase !== "playing" || winner || !isPlayerTurn) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Время вышло - ход AI
          handleTimeout()
          return roundTime
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [phase, winner, isPlayerTurn, roundTime])

  // Ход AI
  useEffect(() => {
    if (phase === "playing" && currentPlayer === aiSymbol && !winner && !isThinking) {
      setIsThinking(true)
      
      const timer = setTimeout(() => {
        const aiMoveIndex = makeAIMove(board, "normal", selectedMode, aiSymbol)
        
        if (aiMoveIndex !== -1) {
          const newBoard = makeGameMove(board, aiMoveIndex, aiSymbol)
          setBoard(newBoard)
          
          const result = checkWinner(newBoard, selectedMode)
          if (result.winner) {
            handleRoundEnd(result.winner)
          } else {
            setCurrentPlayer(playerSymbol)
            setTimeLeft(roundTime)
          }
        }
        
        setIsThinking(false)
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [phase, currentPlayer, winner, isThinking, board, selectedMode, playerSymbol, aiSymbol, roundTime])

  const startNewRound = () => {
    setBoard(initializeBoard(selectedMode))
    setCurrentPlayer("X") // X всегда ходит первым
    setWinner(null)
    setWinningLine(null)
    setTimeLeft(roundTime)
  }

  const handleCellClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn || isThinking || phase !== "playing") return

    const newBoard = makeGameMove(board, index, playerSymbol)
    setBoard(newBoard)

    const result = checkWinner(newBoard, selectedMode)
    if (result.winner) {
      handleRoundEnd(result.winner)
    } else {
      setCurrentPlayer(aiSymbol)
      setTimeLeft(roundTime)
    }
  }

  const handleRoundEnd = (roundWinner: "X" | "O" | "draw") => {
    setWinner(roundWinner)
    setWinningLine(checkWinner(board, selectedMode).line)
    
    // Обновление статистики
    if (roundWinner === playerSymbol) {
      setPlayerWins(prev => prev + 1)
    } else if (roundWinner === aiSymbol) {
      setAiWins(prev => prev + 1)
    }
    
    // Проверка окончания матча
    const newPlayerWins = roundWinner === playerSymbol ? playerWins + 1 : playerWins
    const newAiWins = roundWinner === aiSymbol ? aiWins + 1 : aiWins
    
    if (newPlayerWins >= winsNeeded || newAiWins >= winsNeeded || currentRound >= totalRounds) {
      // Конец матча
      setTimeout(() => {
        setPhase("match_result")
      }, 1500)
    } else {
      // Следующий раунд
      setTimeout(() => {
        setCurrentRound(prev => prev + 1)
        setPhase("round_result")
      }, 1500)
    }
  }

  const handleTimeout = () => {
    // При таймауте - случайный ход AI
    const emptyCells = board
      .map((cell, index) => cell === null ? index : -1)
      .filter(index => index !== -1)
    
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      const newBoard = makeGameMove(board, randomCell, aiSymbol)
      setBoard(newBoard)
      
      const result = checkWinner(newBoard, selectedMode)
      if (result.winner) {
        handleRoundEnd(result.winner)
      } else {
        setCurrentPlayer(playerSymbol)
        setTimeLeft(roundTime)
      }
    }
  }

  const handleNextRound = () => {
    startNewRound()
    setPhase("playing")
  }

  const getModeName = (mode: GameMode) => {
    switch (mode) {
      case "3x3": return "Классический (3×3)"
      case "5x5": return "Тактический (5×5)"
      case "7x7": return "Эпический (7×7)"
    }
  }

  const getRoundConfig = () => {
    switch (selectedMode) {
      case "3x3": return "5 раундов • 3 победы"
      case "5x5": return "3 раунда • 2 победы"
      case "7x7": return "1 раунд • 1 победа"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <AnimatePresence mode="wait">
        {/* Выбор режима */}
        {phase === "mode_selection" && (
          <motion.div
            key="mode_selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen"
          >
            <div className="text-center max-w-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
              >
                <Trophy className="w-16 h-16 text-white" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Выбран режим:
              </h1>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-cyan-500/30"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {getModeName(selectedMode)}
                </div>
                <p className="text-gray-400 mb-4">{getRoundConfig()}</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-2">
                      <div className="text-xl">🎮</div>
                    </div>
                    <div className="text-sm text-white">Вы</div>
                  </div>
                  <div className="text-2xl text-gray-400">VS</div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-2">
                      <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-white">AI Бот</div>
                  </div>
                </div>
              </motion.div>
              
              <p className="text-gray-500 text-sm mt-6">
                Определяем, кто будет играть крестиками...
              </p>
            </div>
          </motion.div>
        )}

        {/* Выбор символа */}
        {phase === "symbol_selection" && (
          <motion.div
            key="symbol_selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen"
          >
            <div className="text-center max-w-md">
              <h1 className="text-3xl font-bold text-white mb-8">
                Вы играете:
              </h1>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="relative"
              >
                <div className={`text-8xl font-bold mb-4 ${playerSymbol === "X" ? "text-blue-400" : "text-red-400"}`}>
                  {playerSymbol}
                </div>
                <div className="absolute inset-0 text-8xl font-bold text-current opacity-20 animate-ping" />
              </motion.div>
              
              <div className="mt-8 p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-sm text-gray-400">Режим</div>
                    <div className="text-lg font-bold text-white">{getModeName(selectedMode)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Раунд</div>
                    <div className="text-lg font-bold text-white">{currentRound}/{totalRounds}</div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm mt-6">
                Начинаем игру...
              </p>
            </div>
          </motion.div>
        )}

        {/* Игровой экран */}
        {phase === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Статистика матча */}
            <div className="bg-gray-800/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Вы</div>
                  <div className="text-2xl font-bold text-white">{playerWins}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Раунд</div>
                  <div className="text-2xl font-bold text-yellow-400">{currentRound}/{totalRounds}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">AI</div>
                  <div className="text-2xl font-bold text-white">{aiWins}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${playerSymbol === "X" ? "bg-blue-500" : "bg-red-500"}`} />
                  <span className="text-sm text-gray-300">Вы: {playerSymbol}</span>
                </div>
                
                {isPlayerTurn && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-mono text-yellow-400">{timeLeft}s</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${aiSymbol === "X" ? "bg-blue-500" : "bg-red-500"}`} />
                  <span className="text-sm text-gray-300">AI: {aiSymbol}</span>
                </div>
              </div>
            </div>

            {/* Статус игры */}
            <div className={`text-center py-3 rounded-lg ${isPlayerTurn ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>
              {isThinking ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin">🌀</div>
                  <span>AI думает...</span>
                </div>
              ) : isPlayerTurn ? (
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>ВАШ ХОД ({playerSymbol})</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Cpu className="w-4 h-4" />
                  <span>ХОД AI ({aiSymbol})</span>
                </div>
              )}
            </div>

            {/* Игровое поле */}
            <div className="flex justify-center">
              <GameBoard
                board={board}
                mode={selectedMode}
                winningLine={winningLine}
                onCellClick={handleCellClick}
                disabled={!isPlayerTurn || !!winner || isThinking}
              />
            </div>

            {/* Управление */}
            <div className="flex justify-center gap-4">
              <button
                onClick={onBack}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                <Home className="w-4 h-4 inline mr-2" />
                Выйти
              </button>
            </div>
          </motion.div>
        )}

        {/* Результат раунда */}
        {phase === "round_result" && (
          <motion.div
            key="round_result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-4"
          >
            <div className="text-center max-w-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-6xl mb-6"
              >
                {winner === playerSymbol ? "🎉" : winner === aiSymbol ? "😢" : "🤝"}
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                {winner === playerSymbol ? "ВЫ ВЫИГРАЛИ РАУНД!" :
                 winner === aiSymbol ? "AI ВЫИГРАЛ РАУНД" : "НИЧЬЯ В РАУНДЕ"}
              </h1>
              
              <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{playerWins}</div>
                    <div className="text-sm text-gray-400">Ваши победы</div>
                  </div>
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <div className="text-2xl font-bold text-red-400">{aiWins}</div>
                    <div className="text-sm text-gray-400">Победы AI</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-white mb-1">Следующий раунд</div>
                  <div className="text-gray-400">
                    {currentRound + 1 <= totalRounds ? 
                      `Раунд ${currentRound + 1} из ${totalRounds}` : 
                      "Финальный раунд"}
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleNextRound}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg"
              >
                СЛЕДУЮЩИЙ РАУНД
              </button>
              
              <button
                onClick={onBack}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold mt-3"
              >
                ЗАВЕРШИТЬ МАТЧ
              </button>
            </div>
          </motion.div>
        )}

        {/* Результат матча */}
        {phase === "match_result" && (
          <motion.div
            key="match_result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-4"
          >
            <div className="text-center max-w-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-7xl mb-6"
              >
                {playerWins > aiWins ? "🏆" : playerWins < aiWins ? "😢" : "🤝"}
              </motion.div>
              
              <h1 className="text-4xl font-bold mb-2">
                {playerWins > aiWins ? (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    ПОБЕДА В МАТЧЕ!
                  </span>
                ) : playerWins < aiWins ? (
                  <span className="text-red-400">ПОРАЖЕНИЕ В МАТЧЕ</span>
                ) : (
                  <span className="text-yellow-400">НИЧЬЯ В МАТЧЕ</span>
                )}
              </h1>
              
              <p className="text-gray-400 mb-8">
                {getModeName(selectedMode)} • {totalRounds} раундов
              </p>
              
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400">{playerWins}</div>
                    <div className="text-sm text-gray-400">Ваши победы</div>
                  </div>
                  <div className="text-2xl text-gray-500">VS</div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-400">{aiWins}</div>
                    <div className="text-sm text-gray-400">Победы AI</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Режим:</span>
                    <span className="text-white">{getModeName(selectedMode)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Всего раундов:</span>
                    <span className="text-white">{totalRounds}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Нужно побед:</span>
                    <span className="text-white">{winsNeeded}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Ваш символ:</span>
                    <span className={`font-bold ${playerSymbol === "X" ? "text-blue-400" : "text-red-400"}`}>
                      {playerSymbol}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Сброс и новый матч
                    setPlayerWins(0)
                    setAiWins(0)
                    setCurrentRound(1)
                    setPhase("mode_selection")
                  }}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg"
                >
                  <RefreshCw className="w-5 h-5 inline mr-2" />
                  НОВЫЙ МАТЧ
                </button>
                
                <button
                  onClick={onBack}
                  className="w-full py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold"
                >
                  В МЕНЮ PvP
                </button>
                
                <button
                  onClick={onMatchEnd}
                  className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold"
                >
                  В ГЛАВНОЕ МЕНЮ
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
