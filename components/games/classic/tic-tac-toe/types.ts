export type Player = "X" | "O" | null;
export type Board = Player[];
export type GameMode = "3x3" | "5x5" | "7x7";
export type OpponentType = "ai" | "player2";
export type Screen = "opponent" | "mode" | "symbol" | "game" | "result" | "settings";

export interface GameConfig {
  mode: GameMode;
  opponent: OpponentType;
  playerSymbol: "X" | "O";
}

export interface MatchStats {
  matches: number;
  wins: number;
  gamesInMatch: number;
  currentMatchWins: number;
  currentMatchLosses: number;
  draws: number;
}

export interface GameResult {
  type: "win" | "lose" | "draw";
  message: string;
  opponentType: OpponentType;
}
