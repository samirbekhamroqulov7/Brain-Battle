"use client"

import { cn } from "@/lib/utils"
import { XIcon, Circle } from "lucide-react"
import { Board as BoardType, GameMode } from "./types"
import { getBoardSize } from "./utils"

interface BoardProps {
  board: BoardType
  currentPlayer: "X" | "O"
  winner: "X" | "O" | "draw" | null
  winningLine: number[] | null
  gameMode: GameMode
  onCellClick: (index: number) => void
  isPlayerTurn: boolean
}

export function TicTacToeBoard({
  board,
  currentPlayer,
  winner,
  winningLine,
  gameMode,
  onCellClick,
  isPlayerTurn,
}: BoardProps) {
  const size = getBoardSize(gameMode)
  const cellSize = size <= 3 ? "h-20" : size <= 5 ? "h-16" : "h-12"

  return (
    <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-3 shadow-inner">
      <div
        className="grid gap-2 w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0,1fr))`,
        }}
      >
        {board.map((cell, index) => {
          const isWinningCell = winningLine?.includes(index)
          const row = Math.floor(index / size)
          const col = index % size
          const isEvenCell = (row + col) % 2 === 0

          return (
            <button
              key={index}
              onClick={() => onCellClick(index)}
              disabled={!!cell || !!winner || !isPlayerTurn}
              className={cn(
                "flex items-center justify-center rounded-xl transition-all duration-200",
                cellSize,
                "text-2xl font-bold",
                !cell && !winner && isPlayerTurn && "hover:scale-105 hover:bg-black/60",
                isWinningCell
                  ? "bg-gradient-to-br from-emerald-500/30 to-green-500/30 text-emerald-300 animate-pulse"
                  : isEvenCell
                  ? "bg-black/40 text-cyan-300"
                  : "bg-black/30 text-cyan-300",
                cell ? "cursor-default" : isPlayerTurn ? "cursor-pointer" : "cursor-not-allowed opacity-70"
              )}
            >
              {cell === "X" && (
                <XIcon className="w-8 h-8 text-cyan-400" strokeWidth={3} />
              )}
              {cell === "O" && (
                <Circle className="w-8 h-8 text-pink-400" strokeWidth={3} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}