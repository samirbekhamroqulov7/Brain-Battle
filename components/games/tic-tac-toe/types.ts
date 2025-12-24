export type Player = "X" | "O" | null;
export type Board = Player[];
export type GameMode = "3x3" | "5x5" | "7x7";
export type AILevel = "novice" | "pro" | "grandmaster";
export type Screen = "menu" | "game" | "settings";

export interface GameStats {
  playerWins: number;
  aiWins: number;
  draws: number;
}

export interface GameState {
  board: Board;
  currentPlayer: "X" | "O";
  winner: Player | "draw" | null;
  winningLine: number[] | null;
  gameMode: GameMode;
  aiLevel: AILevel;
  gameStarted: boolean;
}

export interface Move {
  index: number;
  player: Player;
}