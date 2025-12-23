"use client"

import { useState, useCallback } from "react"
import { useI18n } from "@/lib/i18n/context"
import { useRouter } from "next/navigation"
import { GameResultModal } from "@/components/games/game-result-modal"
import { GameCard } from "@/components/ui/game-card"
import { cn } from "@/lib/utils"
import { XIcon, Circle } from "lucide-react"

type Player = "X" | "O" | null
type Board = Player[]

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export function TicTacToeGame() {
  const { t } = useI18n()
  const router = useRouter()
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<Player | "draw" | null>(null)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)

  const checkWinner = useCallback((board: Board): { winner: Player | "draw"; line: number[] | null } => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: combination }
      }
    }
    if (board.every((cell) => cell !== null)) {
      return { winner: "draw", line: null }
    }
    return { winner: null, line: null }
  }, [])

  const makeAIMove = useCallback((currentBoard: Board) => {
    const emptyIndices = currentBoard.map((cell, i) => (cell === null ? i : -1)).filter((i) => i !== -1)

    if (emptyIndices.length === 0) return

    // Simple AI: Try to win, block, or random
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination
      const cells = [currentBoard[a], currentBoard[b], currentBoard[c]]
      const oCount = cells.filter((c) => c === "O").length
      const nullCount = cells.filter((c) => c === null).length

      if (oCount === 2 && nullCount === 1) {
        const moveIndex = combination.find((i) => currentBoard[i] === null)!
        return moveIndex
      }
    }

    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination
      const cells = [currentBoard[a], currentBoard[b], currentBoard[c]]
      const xCount = cells.filter((c) => c === "X").length
      const nullCount = cells.filter((c) => c === null).length

      if (xCount === 2 && nullCount === 1) {
        const moveIndex = combination.find((i) => currentBoard[i] === null)!
        return moveIndex
      }
    }

    // Take center if available
    if (currentBoard[4] === null) return 4

    // Take corner
    const corners = [0, 2, 6, 8].filter((i) => currentBoard[i] === null)
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)]
    }

    // Random move
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
  }, [])

  const handleCellClick = useCallback(
    (index: number) => {
      if (board[index] || winner || currentPlayer !== "X") return

      const newBoard = [...board]
      newBoard[index] = "X"
      setBoard(newBoard)

      const result = checkWinner(newBoard)
      if (result.winner) {
        setWinner(result.winner)
        setWinningLine(result.line)
        return
      }

      setCurrentPlayer("O")

      // AI move
      setTimeout(() => {
        const aiMove = makeAIMove(newBoard)
        if (aiMove !== undefined) {
          const aiBoard = [...newBoard]
          aiBoard[aiMove] = "O"
          setBoard(aiBoard)

          const aiResult = checkWinner(aiBoard)
          if (aiResult.winner) {
            setWinner(aiResult.winner)
            setWinningLine(aiResult.line)
          } else {
            setCurrentPlayer("X")
          }
        }
      }, 500)
    },
    [board, winner, currentPlayer, checkWinner, makeAIMove],
  )

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
    setWinningLine(null)
  }

  const getResultType = (): "win" | "lose" | "draw" => {
    if (winner === "X") return "win"
    if (winner === "O") return "lose"
    return "draw"
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-6 py-8">
      <div className="relative">
        <GameCard className="px-8 py-4 border-2 border-primary/30 shadow-lg shadow-primary/10">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-3 h-3 rounded-full animate-pulse",
                currentPlayer === "X" ? "bg-cyan-400" : "bg-pink-400",
              )}
            />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {currentPlayer === "X" ? t("game.yourTurn") : t("game.opponentTurn")}
            </span>
          </div>
        </GameCard>
      </div>

      <div className="relative">
        {/* Glow effect behind board */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10" />

        <div className="grid grid-cols-3 gap-4 w-full max-w-sm p-6 bg-card/50 backdrop-blur-sm rounded-2xl border-2 border-border/50 shadow-2xl">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || !!winner || currentPlayer !== "X"}
              className={cn(
                "aspect-square rounded-xl border-2 transition-all duration-300",
                "flex items-center justify-center",
                "disabled:cursor-not-allowed relative overflow-hidden group",
                !cell &&
                  !winner &&
                  currentPlayer === "X" &&
                  "hover:scale-105 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/20",
                winningLine?.includes(index)
                  ? "border-green-400 bg-gradient-to-br from-green-500/30 to-emerald-500/30 shadow-lg shadow-green-500/30 animate-pulse"
                  : "border-border/50 bg-gradient-to-br from-card to-secondary/30",
              )}
            >
              {/* Hover glow effect */}
              {!cell && !winner && currentPlayer === "X" && (
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}

              {cell === "X" && (
                <div className="relative animate-in zoom-in duration-300">
                  <XIcon
                    className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    strokeWidth={3}
                  />
                </div>
              )}
              {cell === "O" && (
                <div className="relative animate-in zoom-in duration-300">
                  <Circle
                    className="w-16 h-16 text-pink-400 drop-shadow-[0_0_10px_rgba(244,114,182,0.5)]"
                    strokeWidth={3}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <GameCard className="px-6 py-4 border-2 border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
          <div className="flex flex-col items-center gap-2">
            <XIcon className="w-10 h-10 text-cyan-400" strokeWidth={3} />
            <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">{t("game.you")}</div>
          </div>
        </GameCard>

        <div className="text-3xl font-bold text-muted-foreground">VS</div>

        <GameCard className="px-6 py-4 border-2 border-pink-400/30 bg-gradient-to-br from-pink-500/10 to-purple-500/10">
          <div className="flex flex-col items-center gap-2">
            <Circle className="w-10 h-10 text-pink-400" strokeWidth={3} />
            <div className="text-xs text-pink-400 font-semibold uppercase tracking-wider">{t("game.opponent")}</div>
          </div>
        </GameCard>
      </div>

      {/* Result Modal */}
      {winner && (
        <GameResultModal result={getResultType()} onPlayAgain={resetGame} onExit={() => router.push("/classic")} />
      )}
    </div>
  )
}
