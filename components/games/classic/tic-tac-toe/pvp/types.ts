export type PvpMode = "3x3" | "5x5" | "7x7"
export type PvpRoundResult = "player1" | "player2" | "draw"
export type PvpMatchStatus = "waiting" | "selecting_mode" | "selecting_symbol" | "playing" | "round_result" | "match_result"

export interface PvpMatchConfig {
  mode: PvpMode
  totalRounds: number
  winsNeeded: number
  roundTime: number
}

export interface PvpPlayer {
  id: string
  name: string
  symbol: "X" | "O"
  score: number
  isAI: boolean
  aiLevel?: "easy" | "normal" | "hard"
}

export interface PvpRound {
  number: number
  board: Array<string | null>
  currentPlayer: "X" | "O"
  winner: "X" | "O" | "draw" | null
  winningLine: number[] | null
  moves: number[]
  startTime: number
  endTime?: number
}

export interface PvpMatch {
  id: string
  player1: PvpPlayer
  player2: PvpPlayer
  config: PvpMatchConfig
  currentRound: number
  rounds: PvpRound[]
  status: PvpMatchStatus
  winner: "player1" | "player2" | "draw" | null
  createdAt: number
}
