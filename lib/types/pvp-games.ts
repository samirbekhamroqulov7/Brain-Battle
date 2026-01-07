// PvP Game Types for all 11 games

export type PvPGameType =
  | "tic-tac-toe"
  | "chess"
  | "checkers"
  | "sudoku"
  | "dots"
  | "crossword"
  | "anagrams"
  | "math-duel"
  | "puzzle-15"
  | "flags-quiz"
  | "memory-match"

export type GameStatus = "waiting" | "selecting" | "playing" | "finished"
export type GameResult = "player1_win" | "player2_win" | "draw" | "abandoned"

export interface PvPPlayer {
  id: string
  username: string
  avatar_url: string | null
  rating: number
}

export interface PvPMatch {
  id: string
  game_type: PvPGameType
  player1: PvPPlayer
  player2: PvPPlayer | null
  status: GameStatus
  game_state: Record<string, unknown>
  result: GameResult | null
  winner_id: string | null
  created_at: string
  finished_at: string | null
  updated_at: string
}

export interface GameScreenConfig {
  title: string
  description: string
  timeLimit?: number
  rounds?: number
  maxScore?: number
}
