// Tic-Tac-Toe Ultimate game types

export type SpecialCell = "fire" | "shield" | "lightning" | "teleport" | null
export type GameMode = "classic" | "blitz" | "team" | "royale"
export type Player = "X" | "O"

export interface UltimateGameState {
  board: Cell[][]
  currentPlayer: Player
  gameMode: GameMode
  specialCells: SpecialCell[][]
  moveTime: number // milliseconds per move in blitz
  scores: { X: number; O: number }
  winner: Player | "draw" | null
  moveHistory: Move[]
  playersCount: number
}

export interface Cell {
  player: Player | null
  isDestroyed: boolean
  special?: SpecialCell
}

export interface Move {
  player: Player
  row: number
  col: number
  timestamp: number
  special?: SpecialCell
}
