// Puzzle-15 Mega (8x8) game logic with PvP mechanics

export type PuzzleTheme = "numbers" | "picture" | "symbols" | "colors"

export interface Puzzle15State {
  board: number[]
  emptyPos: number
  moves: number
  startTime: number
  theme: PuzzleTheme
  isComplete: boolean
  opponentVisibility: boolean
  playerMoveCount: { player1: number; player2: number }
}

export class Puzzle15Mega {
  private state: Puzzle15State
  private readonly BOARD_SIZE = 8
  private readonly BOARD_LENGTH = 64

  constructor(theme: PuzzleTheme = "numbers") {
    this.state = this.initializeBoard(theme)
  }

  private initializeBoard(theme: PuzzleTheme): Puzzle15State {
    const board = Array.from({ length: this.BOARD_LENGTH }, (_, i) => i + 1)
    board[this.BOARD_LENGTH - 1] = 0 // Last position is empty

    // Shuffle with minimum 100 moves
    for (let i = 0; i < 500; i++) {
      this.shuffle(board)
    }

    return {
      board,
      emptyPos: this.BOARD_LENGTH - 1,
      moves: 0,
      startTime: Date.now(),
      theme,
      isComplete: false,
      opponentVisibility: false,
      playerMoveCount: { player1: 0, player2: 0 },
    }
  }

  private shuffle(board: number[]): void {
    const emptyIdx = board.indexOf(0)
    const adjacentIndices = this.getAdjacentCells(emptyIdx)
    const randomIdx = adjacentIndices[Math.floor(Math.random() * adjacentIndices.length)]
    ;[board[emptyIdx], board[randomIdx]] = [board[randomIdx], board[emptyIdx]]
  }

  moveTile(tileNum: number, playerId: number): boolean {
    const tilePos = this.state.board.indexOf(tileNum)
    if (!this.canMove(tilePos)) return false
    ;[this.state.board[this.state.emptyPos], this.state.board[tilePos]] = [
      this.state.board[tilePos],
      this.state.board[this.state.emptyPos],
    ]

    this.state.emptyPos = tilePos
    this.state.moves++

    if (playerId === 1) this.state.playerMoveCount.player1++
    else this.state.playerMoveCount.player2++

    if (this.checkComplete()) {
      this.state.isComplete = true
    }

    return true
  }

  private canMove(tilePos: number): boolean {
    return this.getAdjacentCells(this.state.emptyPos).includes(tilePos)
  }

  private getAdjacentCells(pos: number): number[] {
    const adjacent: number[] = []
    const row = Math.floor(pos / this.BOARD_SIZE)
    const col = pos % this.BOARD_SIZE

    if (row > 0) adjacent.push(pos - this.BOARD_SIZE)
    if (row < this.BOARD_SIZE - 1) adjacent.push(pos + this.BOARD_SIZE)
    if (col > 0) adjacent.push(pos - 1)
    if (col < this.BOARD_SIZE - 1) adjacent.push(pos + 1)

    return adjacent
  }

  private checkComplete(): boolean {
    for (let i = 0; i < this.BOARD_LENGTH - 1; i++) {
      if (this.state.board[i] !== i + 1) return false
    }
    return this.state.board[this.BOARD_LENGTH - 1] === 0
  }

  getState(): Puzzle15State {
    return { ...this.state }
  }

  getElapsedTime(): number {
    return Math.floor((Date.now() - this.state.startTime) / 1000)
  }
}
