// Game and PvP type definitions for the entire system

export type GameType =
  | "tictactoe-ultimate"
  | "puzzle-15-mega"
  | "chess-hyper"
  | "checkers-titans"
  | "crossword-duel"
  | "anagrams-battle"
  | "math-duel"
  | "dots-boxes-mega"
  | "flags-quiz"
  | "sudoku-war"

export type RoomStatus = "waiting" | "playing" | "finished"

export interface User {
  id: string
  username: string
  avatar_url: string | null
  level: number
  coins: number
  isGuest: boolean
  created_at: string
  updated_at: string
  settings?: UserSettings
}

export interface UserSettings {
  soundEnabled: boolean
  musicEnabled: boolean
  theme: "cyberpunk" | "steampunk" | "fantasy" | "cosmos" | "nature"
  language: string
}

export interface GameRating {
  userId: string
  gameType: GameType
  rating: number
  wins: number
  losses: number
  draws: number
  lastUpdated: string
}

export interface Room {
  id: string
  gameType: GameType
  players: User[]
  maxPlayers: number
  status: RoomStatus
  createdAt: string
  startedAt?: string
  finishedAt?: string
  settings: GameSettings
  moves: GameMove[]
  currentTurn?: string
}

export interface GameSettings {
  difficulty?: "easy" | "normal" | "hard"
  timePerMove?: number
  mode?: string
  specialRules?: Record<string, boolean>
}

export interface GameMove {
  id: string
  roomId: string
  playerId: string
  move: Record<string, any>
  timestamp: string
  validationStatus: "pending" | "valid" | "invalid"
}

export interface GameSession {
  id: string
  roomId: string
  gameType: GameType
  players: {
    id: string
    username: string
    finalScore: number
  }[]
  winner?: string
  result: "win" | "loss" | "draw"
  duration: number
  replayAvailable: boolean
  createdAt: string
}

export interface Achievement {
  id: string
  userId: string
  achievementType: string
  unlockedAt: string
  reward: {
    coins?: number
    xp?: number
  }
}

export interface Clan {
  id: string
  name: string
  leaderUserId: string
  members: string[]
  createdAt: string
  level: number
  treasury: number
}

export interface Tournament {
  id: string
  gameType: GameType
  name: string
  status: "upcoming" | "active" | "finished"
  startTime: string
  endTime: string
  prizePool: number
  maxParticipants: number
  participants: string[]
  bracket: TournamentBracket[]
}

export interface TournamentBracket {
  id: string
  tournamentId: string
  round: number
  match: {
    player1Id: string
    player2Id: string
    winner?: string
  }[]
}

export interface RealtimeMessage {
  id: string
  roomId: string
  senderId: string
  type: "chat" | "emote" | "system"
  content: string
  timestamp: string
}
