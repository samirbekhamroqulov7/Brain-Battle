// Tic-Tac-Toe Ultimate game board component with 3D hologram effects

"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TicTacToeUltimate } from "@/lib/games/tictactoe-ultimate/game-logic"
import type { UltimateGameState } from "@/lib/games/tictactoe-ultimate/types"

interface GameBoardProps {
  gameType: "classic" | "blitz" | "team" | "royale"
  onGameEnd: (winner: string, scores: { X: number; O: number }) => void
}

const SPECIAL_CELL_ICONS: Record<string, string> = {
  fire: "🔥",
  shield: "🛡️",
  lightning: "⚡",
  teleport: "🔄",
}

export function TicTacToeUltimateBoard({ gameType, onGameEnd }: GameBoardProps) {
  const [game] = useState(() => new TicTacToeUltimate(gameType))
  const [state, setState] = useState<UltimateGameState>(game.getState())
  const [selectedMove, setSelectedMove] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (state.winner !== null) {
      onGameEnd(state.winner, state.scores)
    }
  }, [state.winner, state.scores, onGameEnd])

  const handleCellClick = (row: number, col: number) => {
    if (game.makeMove(row, col)) {
      setState(game.getState())
      setSelectedMove(null)
    }
  }

  const handleNewGame = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Game Info */}
      <div className="grid grid-cols-3 gap-4 w-full">
        <Card className="p-4 text-center bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30">
          <div className="text-sm text-gray-400">Player X</div>
          <div className="text-2xl font-bold text-red-400">{state.scores.X}</div>
        </Card>

        <Card className="p-4 text-center bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
          <div className="text-sm text-gray-400">Current: {state.currentPlayer}</div>
          <div className="text-2xl font-bold text-purple-400">{state.gameMode}</div>
        </Card>

        <Card className="p-4 text-center bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
          <div className="text-sm text-gray-400">Player O</div>
          <div className="text-2xl font-bold text-blue-400">{state.scores.O}</div>
        </Card>
      </div>

      {/* Game Board */}
      <div className="relative inline-block">
        {/* 3D hologram background effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 blur-xl"></div>

        <div className="relative grid gap-1 p-4 bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-lg">
          {state.board.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-1">
              {row.map((cell, colIdx) => {
                const special = state.specialCells[rowIdx][colIdx]
                const isCurrent = selectedMove && selectedMove[0] === rowIdx && selectedMove[1] === colIdx

                return (
                  <button
                    key={`${rowIdx}-${colIdx}`}
                    onClick={() => handleCellClick(rowIdx, colIdx)}
                    onMouseEnter={() => setSelectedMove([rowIdx, colIdx])}
                    className={`
                      w-12 h-12 rounded-lg font-bold text-xl transition-all duration-200
                      flex items-center justify-center relative
                      ${
                        cell.player === "X"
                          ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/50"
                          : cell.player === "O"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50"
                            : isCurrent && cell.player === null && !cell.isDestroyed
                              ? "bg-gray-700 border-2 border-purple-400"
                              : cell.isDestroyed
                                ? "bg-gray-800 opacity-30"
                                : "bg-gray-800 border border-gray-700 hover:border-purple-400"
                      }
                    `}
                    disabled={state.winner !== null || cell.player !== null || cell.isDestroyed}
                  >
                    {cell.player ? cell.player : special ? SPECIAL_CELL_ICONS[special] : ""}

                    {/* Special cell indicator */}
                    {special && !cell.player && (
                      <div className="absolute inset-0 rounded-lg animate-pulse opacity-50 pointer-events-none"></div>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Game Status */}
      {state.winner !== null && (
        <Card className="w-full p-6 text-center bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
          <h2 className="text-2xl font-bold mb-4">
            {state.winner === "draw" ? "It's a Draw!" : `Player ${state.winner} Wins!`}
          </h2>
          <Button onClick={handleNewGame} className="w-full">
            Play Again
          </Button>
        </Card>
      )}

      {/* Move History */}
      {state.moveHistory.length > 0 && (
        <Card className="w-full p-4 max-h-32 overflow-y-auto bg-gray-800/50">
          <h3 className="font-semibold mb-2">Moves</h3>
          <div className="text-xs text-gray-400 space-y-1">
            {state.moveHistory.slice(-5).map((move, idx) => (
              <div key={idx}>
                {move.player}: ({move.row}, {move.col}) {move.special ? SPECIAL_CELL_ICONS[move.special] : ""}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
