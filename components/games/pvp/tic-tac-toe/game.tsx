"use client"

import { useState } from "react"
import { GameCard } from "@/components/ui/game-card"
import { GameButton } from "@/components/ui/game-button"

interface GameState {
  board: (string | null)[]
  currentPlayer: string
  winner: string | null
  gamePhase: "symbol-select" | "playing" | "result"
  player1Symbol: string
  player2Symbol: string
  player1Score: number
  player2Score: number
  round: number
}

export function TicTacToePvP() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: "1",
    winner: null,
    gamePhase: "symbol-select",
    player1Symbol: "X",
    player2Symbol: "O",
    player1Score: 0,
    player2Score: 0,
    round: 1,
  })

  const [isLocalPlayer1, setIsLocalPlayer1] = useState(true)

  const handleSymbolSelect = (symbol: "X" | "O") => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: "playing",
      player1Symbol: symbol,
      player2Symbol: symbol === "X" ? "O" : "X",
      currentPlayer: "1",
    }))
  }

  const checkWinner = (board: (string | null)[]): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    return null
  }

  const handleCellClick = (index: number) => {
    if (gameState.gamePhase !== "playing" || gameState.board[index]) return

    const newBoard = [...gameState.board]
    const currentSymbol = gameState.currentPlayer === "1" ? gameState.player1Symbol : gameState.player2Symbol

    newBoard[index] = currentSymbol

    const winner = checkWinner(newBoard)

    if (winner) {
      const winnerId = winner === gameState.player1Symbol ? "1" : "2"
      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        winner: winnerId,
        gamePhase: "result",
        [`player${winnerId}Score`]: prev[`player${winnerId}Score` as keyof GameState] + 1,
      }))
    } else if (newBoard.every((cell) => cell !== null)) {
      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        gamePhase: "result",
        winner: "draw",
      }))
    } else {
      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        currentPlayer: gameState.currentPlayer === "1" ? "2" : "1",
      }))
    }
  }

  const handlePlayAgain = () => {
    setGameState((prev) => ({
      ...prev,
      board: Array(9).fill(null),
      currentPlayer: "1",
      winner: null,
      gamePhase: "playing",
      round: prev.round + 1,
    }))
  }

  if (gameState.gamePhase === "symbol-select") {
    return (
      <div className="flex flex-col gap-6 items-center justify-center">
        <h2 className="text-2xl font-bold text-white text-center">Choose Your Symbol</h2>
        <div className="flex gap-4">
          <GameButton onClick={() => handleSymbolSelect("X")} className="w-32 h-32 text-4xl font-bold">
            X
          </GameButton>
          <GameButton
            variant="secondary"
            onClick={() => handleSymbolSelect("O")}
            className="w-32 h-32 text-4xl font-bold"
          >
            O
          </GameButton>
        </div>
      </div>
    )
  }

  if (gameState.gamePhase === "result") {
    return (
      <div className="flex flex-col gap-6 items-center justify-center">
        <div className="text-center">
          {gameState.winner === "draw" ? (
            <>
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">It's a Draw!</h2>
              <p className="text-gray-400">Both players played perfectly</p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-green-400 mb-2">Player {gameState.winner} Wins!</h2>
              <p className="text-gray-400">
                {gameState.winner === "1" ? "You" : "Opponent"} won round {gameState.round}
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Player 1</p>
            <p className="text-3xl font-bold text-blue-400">{gameState.player1Score}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Player 2</p>
            <p className="text-3xl font-bold text-purple-400">{gameState.player2Score}</p>
          </div>
        </div>

        {gameState.round < 3 && (
          <GameButton onClick={handlePlayAgain} className="w-full h-12">
            Play Round {gameState.round + 1}
          </GameButton>
        )}

        {gameState.round >= 3 && (
          <>
            <div className="text-center pt-4">
              <h3 className="text-2xl font-bold text-white mb-2">Match Complete!</h3>
              <p className="text-lg text-gray-300">
                {gameState.player1Score > gameState.player2Score
                  ? "Player 1"
                  : gameState.player2Score > gameState.player1Score
                    ? "Player 2"
                    : "It's a tie"}{" "}
                wins!
              </p>
            </div>
            <GameButton onClick={() => (window.location.href = "/pvp")} className="w-full h-12" variant="secondary">
              Back to Games
            </GameButton>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Score Display */}
      <div className="grid grid-cols-2 gap-4">
        <GameCard className="p-4 text-center">
          <p className="text-gray-400 text-sm mb-2">Player 1</p>
          <p className="text-3xl font-bold text-blue-400">{gameState.player1Score}</p>
        </GameCard>
        <GameCard className="p-4 text-center">
          <p className="text-gray-400 text-sm mb-2">Player 2</p>
          <p className="text-3xl font-bold text-purple-400">{gameState.player2Score}</p>
        </GameCard>
      </div>

      {/* Game Status */}
      <div className="text-center">
        <p className="text-gray-400 text-sm mb-1">Round {gameState.round} of 3</p>
        <p className="text-lg font-semibold text-white">
          Current Player: {gameState.currentPlayer === "1" ? "Player 1" : "Player 2"}
        </p>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 bg-gray-800/50 p-4 rounded-lg">
        {gameState.board.map((cell, index) => (
          <GameCard
            key={index}
            variant="interactive"
            className="aspect-square flex items-center justify-center text-4xl font-bold cursor-pointer hover:bg-gray-700/50 transition-colors"
            onClick={() => handleCellClick(index)}
          >
            {cell && (
              <span className={cell === gameState.player1Symbol ? "text-blue-400" : "text-purple-400"}>{cell}</span>
            )}
          </GameCard>
        ))}
      </div>

      {/* Game Status Message */}
      <div className="text-center text-sm text-gray-400">Tap a cell to make your move</div>
    </div>
  )
}
