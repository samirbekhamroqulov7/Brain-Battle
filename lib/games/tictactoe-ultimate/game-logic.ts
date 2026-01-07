// Tic-Tac-Toe Ultimate game logic

import type { Cell, Player, SpecialCell, UltimateGameState } from "./types"

export class TicTacToeUltimate {
  private gameState: UltimateGameState

  constructor(mode: "classic" | "blitz" | "team" | "royale" = "classic") {
    this.gameState = this.initializeGame(mode)
  }

  private initializeGame(mode: "classic" | "blitz" | "team" | "royale"): UltimateGameState {
    return {
      board: this.createBoard(7),
      currentPlayer: "X",
      gameMode: mode,
      specialCells: this.generateSpecialCells(7),
      moveTime: mode === "blitz" ? 3000 : 0,
      scores: { X: 0, O: 0 },
      winner: null,
      moveHistory: [],
      playersCount: mode === "royale" ? 4 : 2,
    }
  }

  private createBoard(size: number): Cell[][] {
    return Array(size)
      .fill(null)
      .map(() =>
        Array(size)
          .fill(null)
          .map(() => ({
            player: null,
            isDestroyed: false,
          })),
      )
  }

  private generateSpecialCells(size: number): SpecialCell[][] {
    const specials: SpecialCell[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null))

    const specialTypes: SpecialCell[] = ["fire", "shield", "lightning", "teleport"]
    const cellsToFill = Math.floor((size * size) / 8) // ~12.5% of cells are special

    for (let i = 0; i < cellsToFill; i++) {
      const row = Math.floor(Math.random() * size)
      const col = Math.floor(Math.random() * size)
      if (specials[row][col] === null) {
        specials[row][col] = specialTypes[Math.floor(Math.random() * specialTypes.length)]
      }
    }

    return specials
  }

  /**
   * Make a move on the board
   */
  makeMove(row: number, col: number): boolean {
    // Validate move
    if (row < 0 || row >= 7 || col < 0 || col >= 7) return false
    if (this.gameState.board[row][col].player !== null) return false
    if (this.gameState.board[row][col].isDestroyed) return false
    if (this.gameState.winner !== null) return false

    const cell = this.gameState.board[row][col]
    const special = this.gameState.specialCells[row][col]

    // Place player mark
    this.gameState.board[row][col].player = this.gameState.currentPlayer

    // Handle special cell effects
    if (special) {
      this.handleSpecialCell(row, col, special, this.gameState.currentPlayer)
    }

    // Record move
    this.gameState.moveHistory.push({
      player: this.gameState.currentPlayer,
      row,
      col,
      timestamp: Date.now(),
      special,
    })

    // Check for winner (5 in a row)
    const winner = this.checkWinner(row, col, this.gameState.currentPlayer)
    if (winner) {
      this.gameState.winner = this.gameState.currentPlayer
      this.gameState.scores[this.gameState.currentPlayer]++
    }

    // Check for draw
    if (this.isBoardFull()) {
      this.gameState.winner = "draw"
    }

    // Switch player
    this.gameState.currentPlayer = this.gameState.currentPlayer === "X" ? "O" : "X"

    return true
  }

  /**
   * Handle special cell effects
   */
  private handleSpecialCell(row: number, col: number, special: SpecialCell, player: Player): void {
    const opponent = player === "X" ? "O" : "X"

    switch (special) {
      case "fire": // Destroy adjacent cells
        this.destroyAdjacentCells(row, col)
        break

      case "shield": // Protect cell from destruction
        this.gameState.board[row][col].isDestroyed = false
        break

      case "lightning": // Skip opponent's next turn and make another move
        // This would require turn management
        break

      case "teleport": // Swap positions with random cell
        this.teleportCell(row, col)
        break
    }
  }

  private destroyAdjacentCells(row: number, col: number): void {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]

    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc

      if (newRow >= 0 && newRow < 7 && newCol >= 0 && newCol < 7) {
        if (this.gameState.board[newRow][newCol].player !== null) {
          this.gameState.board[newRow][newCol].isDestroyed = true
        }
      }
    }
  }

  private teleportCell(row: number, col: number): void {
    const player = this.gameState.board[row][col].player
    if (!player) return

    // Find random empty cell
    let newRow, newCol
    let attempts = 0
    do {
      newRow = Math.floor(Math.random() * 7)
      newCol = Math.floor(Math.random() * 7)
      attempts++
    } while (
      this.gameState.board[newRow][newCol].player !== null &&
      !this.gameState.board[newRow][newCol].isDestroyed &&
      attempts < 10
    )

    if (attempts < 10) {
      this.gameState.board[row][col].player = null
      this.gameState.board[newRow][newCol].player = player
    }
  }

  /**
   * Check for 5 in a row (winner condition)
   */
  private checkWinner(row: number, col: number, player: Player): boolean {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal
      [1, -1], // anti-diagonal
    ]

    for (const [dr, dc] of directions) {
      let count = 1

      // Check forward
      for (let i = 1; i < 5; i++) {
        const newRow = row + dr * i
        const newCol = col + dc * i
        if (newRow < 0 || newRow >= 7 || newCol < 0 || newCol >= 7) break
        if (this.gameState.board[newRow][newCol].player === player) count++
        else break
      }

      // Check backward
      for (let i = 1; i < 5; i++) {
        const newRow = row - dr * i
        const newCol = col - dc * i
        if (newRow < 0 || newRow >= 7 || newCol < 0 || newCol >= 7) break
        if (this.gameState.board[newRow][newCol].player === player) count++
        else break
      }

      if (count >= 5) return true
    }

    return false
  }

  private isBoardFull(): boolean {
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 7; col++) {
        if (this.gameState.board[row][col].player === null && !this.gameState.board[row][col].isDestroyed) {
          return false
        }
      }
    }
    return true
  }

  /**
   * Get current game state
   */
  getState(): UltimateGameState {
    return { ...this.gameState }
  }

  /**
   * Get valid moves
   */
  getValidMoves(): [number, number][] {
    const moves: [number, number][] = []

    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 7; col++) {
        if (this.gameState.board[row][col].player === null && !this.gameState.board[row][col].isDestroyed) {
          moves.push([row, col])
        }
      }
    }

    return moves
  }
}
