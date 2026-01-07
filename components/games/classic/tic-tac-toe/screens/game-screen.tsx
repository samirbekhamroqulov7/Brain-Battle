"use client"

import { useState, useEffect, useCallback } from "react"
import { GameMode, OpponentType } from "../types"
import { GameBoard3D } from "../components/game-board-3d"
import { makeAIMove } from "../utils/ai-logic"
import { checkWinner, initializeBoard, makeMove as makeGameMove } from "../utils/game-logic"
import { getRoundConfig } from "../utils/game-config"
import { RotateCcw, Home, Undo2 } from "lucide-react"

interface GameScreenProps {
  mode: GameMode
  opponent: OpponentType
  playerSymbol: "X" | "O"
  onScreenChange: (screen: string) => void
  onGameEnd: (result: "win" | "lose" | "draw") => void
  onMatchEnd: (winner: "player1" | "player2" | "draw") => void
  matchStats: any
}

export function GameScreen({ 
  mode, 
  opponent, 
  playerSymbol, 
  onScreenChange, 
  onGameEnd,
  onMatchEnd,
  matchStats 
}: GameScreenProps) {
  const [board, setBoard] = useState<Array<string | null>>(() => initializeBoard(mode))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X") // X всегда ходит первым
  const [winner, setWinner] = useState<string | "draw" | null>(null)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [moveHistory, setMoveHistory] = useState<number[]>([])

  const aiSymbol = "O" // ИИ всегда играет O
  const isPlayerTurn = currentPlayer === playerSymbol
  const roundConfig = getRoundConfig(mode)

  // Handle AI move
  useEffect(() => {
    if (opponent === "ai" && currentPlayer === aiSymbol && !winner && !isThinking && board.some(cell => cell === null)) {
      setIsThinking(true)
      
      const timer = setTimeout(() => {
        const aiMoveIndex = makeAIMove(board, mode, aiSymbol)
        
        if (aiMoveIndex !== -1) {
          const newBoard = makeGameMove(board, aiMoveIndex, aiSymbol)
          setBoard(newBoard)
          setMoveHistory(prev => [...prev, aiMoveIndex])
          
          const result = checkWinner(newBoard, mode)
          if (result.winner) {
            setWinner(result.winner)
            setWinningLine(result.line)
            setShowResult(true)
            
            if (result.winner === aiSymbol) {
              onGameEnd("lose")
            } else if (result.winner === "draw") {
              onGameEnd("draw")
            }
          } else {
            setCurrentPlayer("X") // После хода ИИ снова ходит X
          }
        }
        
        setIsThinking(false)
      }, 600)

      return () => clearTimeout(timer)
    }
  }, [currentPlayer, winner, isThinking, board, mode, aiSymbol, onGameEnd, opponent])

  // Handle player move
  const handleCellClick = useCallback((index: number) => {
    if (board[index] || winner || !isPlayerTurn || isThinking) return

    const newBoard = makeGameMove(board, index, playerSymbol)
    setBoard(newBoard)
    setMoveHistory(prev => [...prev, index])

    const result = checkWinner(newBoard, mode)
    if (result.winner) {
      setWinner(result.winner)
      setWinningLine(result.line)
      setShowResult(true)
      
      if (result.winner === playerSymbol) {
        onGameEnd("win")
      } else if (result.winner === "draw") {
        onGameEnd("draw")
      }
    } else {
      // После хода игрока, если игра против ИИ, то ходит ИИ (O)
      // Если игра против другого игрока, то ходит другой игрок
      setCurrentPlayer(opponent === "ai" ? aiSymbol : playerSymbol === "X" ? "O" : "X")
    }
  }, [board, winner, isPlayerTurn, isThinking, mode, onGameEnd, playerSymbol, aiSymbol, opponent])

  // Handle player 2 move (для PvP)
  const handlePlayer2Move = useCallback((index: number) => {
    if (board[index] || winner || isPlayerTurn || isThinking || opponent !== "player2") return

    const newBoard = makeGameMove(board, index, playerSymbol === "X" ? "O" : "X")
    setBoard(newBoard)
    setMoveHistory(prev => [...prev, index])

    const result = checkWinner(newBoard, mode)
    if (result.winner) {
      setWinner(result.winner)
      setWinningLine(result.line)
      setShowResult(true)
      
      if (result.winner === (playerSymbol === "X" ? "O" : "X")) {
        onGameEnd("lose")
      } else if (result.winner === "draw") {
        onGameEnd("draw")
      }
    } else {
      setCurrentPlayer(playerSymbol)
    }
  }, [board, winner, isPlayerTurn, isThinking, mode, onGameEnd, playerSymbol, opponent])

  // Restart game
  const handleRestart = () => {
    setBoard(initializeBoard(mode))
    setCurrentPlayer("X") // X всегда ходит первым
    setWinner(null)
    setWinningLine(null)
    setShowResult(false)
    setMoveHistory([])
    setIsThinking(false)
  }

  // Undo last move
  const handleUndo = () => {
    if (moveHistory.length === 0 || isThinking || opponent === "ai") return
    
    const lastMove = moveHistory[moveHistory.length - 1]
    const newBoard = [...board]
    newBoard[lastMove] = null
    setBoard(newBoard)
    setMoveHistory(prev => prev.slice(0, -1))
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
  }

  // Continue to next round
  const handleContinue = () => {
    if (matchStats.gamesInMatch >= roundConfig.totalRounds) {
      const matchWinner = matchStats.currentMatchWins > matchStats.currentMatchLosses 
        ? "player1" 
        : matchStats.currentMatchLosses > matchStats.currentMatchWins 
          ? "player2" 
          : "draw"
      onMatchEnd(matchWinner)
    } else {
      handleRestart()
    }
  }

  // Calculate round info
  const currentRound = matchStats.gamesInMatch + 1
  const totalRounds = roundConfig.totalRounds
  const roundsLeft = totalRounds - currentRound + 1

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-2 flex flex-col">
      {/* Round Info Block */}
      <div className="bg-gray-800/40 rounded-xl p-3 mb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-bold text-white">
            Раунд {currentRound} из {totalRounds}
          </div>
          <div className="text-xs text-gray-400">
            Осталось: {roundsLeft}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(currentRound / totalRounds) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Score Block */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-gray-300">Вы ({playerSymbol})</div>
            <div className="text-lg font-bold text-white">{matchStats.currentMatchWins}</div>
          </div>
          <div className="text-xs text-gray-400">Побед в матче</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-gray-300">
              {opponent === "ai" ? "КОМПЬЮТЕР" : "ИГРОК 2"} ({playerSymbol === "X" ? "O" : "X"})
            </div>
            <div className="text-lg font-bold text-white">{matchStats.currentMatchLosses}</div>
          </div>
          <div className="text-xs text-gray-400">Побед в матче</div>
        </div>
      </div>

      {/* Turn Status */}
      <div className={`text-center py-2 rounded-lg mb-2 ${
        isThinking ? 'bg-yellow-500/20 text-yellow-400' :
        isPlayerTurn ? 'bg-green-500/20 text-green-400' : 
        'bg-blue-500/20 text-blue-400'
      }`}>
        {isThinking ? (
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="animate-spin">🌀</div>
            <span>ИИ думает...</span>
          </div>
        ) : isPlayerTurn ? (
          <div className="text-sm">ВАШ ХОД ({playerSymbol})</div>
        ) : opponent === "ai" ? (
          <div className="text-sm">ХОД КОМПЬЮТЕРА ({playerSymbol === "X" ? "O" : "X"})</div>
        ) : (
          <div className="text-sm">ХОД ИГРОКА 2 ({playerSymbol === "X" ? "O" : "X"})</div>
        )}
      </div>

      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <GameBoard3D
          board={board}
          mode={mode}
          winningLine={winningLine}
          onCellClick={opponent === "ai" ? handleCellClick : isPlayerTurn ? handleCellClick : handlePlayer2Move}
          disabled={!!winner || isThinking || (opponent === "player2" && !isPlayerTurn)}
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <button
          onClick={handleRestart}
          className="px-2 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white font-bold hover:scale-105 transition-transform flex items-center justify-center gap-1 text-xs"
        >
          <RotateCcw className="w-3 h-3" />
          Новая
        </button>
        
        {opponent === "player2" && (
          <button
            onClick={handleUndo}
            disabled={moveHistory.length === 0 || isThinking}
            className="px-2 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-xs"
          >
            <Undo2 className="w-3 h-3" />
            Отмена
          </button>
        )}
        
        <button
          onClick={() => onScreenChange("mode")}
          className="px-2 py-2 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg text-white font-bold hover:scale-105 transition-transform flex items-center justify-center gap-1 text-xs"
        >
          <Home className="w-3 h-3" />
          Выход
        </button>
      </div>

      {/* Result Modal */}
      {showResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 max-w-md w-full border border-gray-700">
            <div className="text-center">
              <div className="text-4xl mb-3">
                {winner === playerSymbol ? "🎉" :
                 winner === (playerSymbol === "X" ? "O" : "X") ? "😢" : "🤝"}
              </div>
              <h2 className="text-xl font-bold mb-2 text-white">
                {winner === playerSymbol ? "ПОБЕДА!" :
                 winner === (playerSymbol === "X" ? "O" : "X") ? "ПОРАЖЕНИЕ" : "НИЧЬЯ!"}
              </h2>
              
              <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                <div className="flex justify-center items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{matchStats.currentMatchWins}</div>
                    <div className="text-xs text-gray-400">Вы</div>
                  </div>
                  <div className="text-gray-500">:</div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-400">{matchStats.currentMatchLosses}</div>
                    <div className="text-xs text-gray-400">{opponent === "ai" ? "ИИ" : "P2"}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center gap-2">
                <button
                  onClick={handleContinue}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold text-sm flex-1"
                >
                  {matchStats.gamesInMatch >= roundConfig.totalRounds - 1 ? "Завершить" : "Далее"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
