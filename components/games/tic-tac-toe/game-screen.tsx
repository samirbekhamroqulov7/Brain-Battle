"use client"

import { useState, useEffect } from "react"
import { GameMode, AILevel, Player, GameStats } from "./types"
import { TicTacToeBoard } from "./board"
import { makeAIMove } from "./ai"
import { checkWinner, initializeBoard } from "./utils"
import { GameResultModal } from "@/components/games/game-result-modal"
import { useRouter } from "next/navigation"
import { XIcon, Circle, RotateCcw, Settings } from "lucide-react"
import { GameButton } from "@/components/ui/game-button"

interface GameScreenProps {
  mode: GameMode
  aiLevel: AILevel
  stats: GameStats
  onUpdateStats: (newStats: GameStats) => void
  onBackToMenu: () => void
}

export function GameScreen({
  mode,
  aiLevel,
  stats,
  onUpdateStats,
  onBackToMenu,
}: GameScreenProps) {
  const router = useRouter()
  const [board, setBoard] = useState<Player[]>(() => initializeBoard(mode))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<Player | "draw" | null>(null)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [gameStarted, setGameStarted] = useState(true)
  const [isThinking, setIsThinking] = useState(false)

  // Инициализация игры
  useEffect(() => {
    resetGame()
  }, [mode, aiLevel])

  // Обработка хода ИИ
  useEffect(() => {
    if (currentPlayer === "O" && !winner && gameStarted) {
      setIsThinking(true)
      const timer = setTimeout(() => {
        makeAIMoveAsync()
        setIsThinking(false)
      }, aiLevel === "novice" ? 300 : aiLevel === "pro" ? 600 : 900)

      return () => clearTimeout(timer)
    }
  }, [currentPlayer, winner, gameStarted])

  const makeAIMoveAsync = () => {
    const moveIndex = makeAIMove(board, aiLevel, mode, currentPlayer)
    if (moveIndex !== -1) {
      handleMove(moveIndex, false)
    }
  }

  const handleMove = (index: number, isPlayer: boolean = true) => {
    if (board[index] || winner || (isPlayer && currentPlayer !== "X")) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const result = checkWinner(newBoard, mode)
    if (result.winner) {
      setWinner(result.winner)
      setWinningLine(result.line)
      
      // Обновляем статистику
      const newStats = { ...stats }
      if (result.winner === "X") {
        newStats.playerWins += 1
      } else if (result.winner === "O") {
        newStats.aiWins += 1
      } else if (result.winner === "draw") {
        newStats.draws += 1
      }
      onUpdateStats(newStats)
      
      // Сохраняем в localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("tic_tac_toe_stats", JSON.stringify(newStats))
      }
      
      return
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
  }

  const resetGame = () => {
    setBoard(initializeBoard(mode))
    setCurrentPlayer("X")
    setWinner(null)
    setWinningLine(null)
    setGameStarted(true)
  }

  const getResultType = (): "win" | "lose" | "draw" => {
    if (winner === "X") return "win"
    if (winner === "O") return "lose"
    return "draw"
  }

  const handleExit = () => {
    onBackToMenu()
  }

  return (
    <div className="space-y-6">
      {/* Top info blocks */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-black/50 p-3 text-center">
          <p className="text-xs text-gray-400">МАТЧИ</p>
          <p className="font-bold text-sm text-white">
            {stats.playerWins + stats.aiWins + stats.draws}
          </p>
        </div>

        <div className="rounded-xl bg-black/50 p-3 text-center">
          <p className="text-xs text-gray-400">УРОВЕНЬ ИИ</p>
          <div className="flex justify-center gap-1 mt-1">
            <AiButton
              label="🙂"
              active={aiLevel === "novice"}
              onClick={() => {}}
              disabled
            />
            <AiButton
              label="😠"
              active={aiLevel === "pro"}
              onClick={() => {}}
              disabled
            />
            <AiButton
              label="👑"
              active={aiLevel === "grandmaster"}
              onClick={() => {}}
              disabled
            />
          </div>
        </div>

        <div className="rounded-xl bg-black/50 p-3 text-center">
          <p className="text-xs text-gray-400">СЧЁТ</p>
          <p className="font-bold text-sm text-white">
            {stats.playerWins} / {stats.aiWins}
          </p>
        </div>
      </div>

      {/* Turn indicator */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <XIcon className="w-6 h-6 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">ВЫ</span>
          </div>
          {currentPlayer === "X" && !winner && (
            <div className="text-xs text-cyan-400 animate-pulse mt-1">Ваш ход</div>
          )}
        </div>

        <div className="text-2xl font-bold text-gray-400">VS</div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Circle className="w-6 h-6 text-pink-400" />
            <span className="text-sm font-semibold text-pink-400">ИИ</span>
          </div>
          {currentPlayer === "O" && !winner && (
            <div className="text-xs text-pink-400 animate-pulse mt-1">
              {isThinking ? "Думает..." : "Ход ИИ"}
            </div>
          )}
        </div>
      </div>

      {/* Game board */}
      <TicTacToeBoard
        board={board}
        currentPlayer={currentPlayer}
        winner={winner}
        winningLine={winningLine}
        gameMode={mode}
        onCellClick={(index) => handleMove(index, true)}
        isPlayerTurn={currentPlayer === "X" && !winner}
      />

      {/* Bottom controls */}
      <div className="flex justify-between gap-3">
        <GameButton
          variant="secondary"
          size="md"
          className="flex-1"
          onClick={onBackToMenu}
        >
          Назад
        </GameButton>

        <GameButton
          variant="ghost"
          size="md"
          className="flex-1"
          onClick={resetGame}
          disabled={isThinking}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Заново
        </GameButton>

        <GameButton
          variant="primary"
          size="md"
          className="flex-1"
          onClick={() => router.push("/settings")}
        >
          <Settings className="w-4 h-4 mr-2" />
          Настройки
        </GameButton>
      </div>

      {/* Result Modal */}
      {winner && (
        <GameResultModal
          result={getResultType()}
          onPlayAgain={resetGame}
          onExit={handleExit}
        />
      )}
    </div>
  )
}

function AiButton({
  label,
  active,
  onClick,
  disabled = false,
}: {
  label: string
  active: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-8 h-8 rounded-lg flex items-center justify-center transition
        ${active ? "bg-cyan-500" : "bg-white/10 hover:bg-white/20"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {label}
    </button>
  )
}