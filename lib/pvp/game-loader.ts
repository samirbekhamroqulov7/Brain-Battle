// PvP Game Loader - Dynamically load games

import type { PvPGameType } from "@/lib/types/pvp-games"

export const AVAILABLE_PVP_GAMES: Record<PvPGameType, { name: string; description: string; icon: string }> = {
  "tic-tac-toe": { name: "Tic Tac Toe", description: "Classic 3x3 strategy game", icon: "Grid3x3" },
  chess: { name: "Chess", description: "Ultimate strategy game", icon: "Crown" },
  checkers: { name: "Checkers", description: "Jump your way to victory", icon: "Circle" },
  sudoku: { name: "Sudoku", description: "Number placement puzzle", icon: "Hash" },
  dots: { name: "Dots", description: "Connect and score points", icon: "PenTool" },
  crossword: { name: "Crossword", description: "Word puzzle challenge", icon: "FileText" },
  anagrams: { name: "Anagrams", description: "Unscramble the words", icon: "Shuffle" },
  "math-duel": { name: "Math Duel", description: "Quick math problems", icon: "Calculator" },
  "puzzle-15": { name: "15 Puzzle", description: "Arrange the tiles", icon: "LayoutGrid" },
  "flags-quiz": { name: "Flags Quiz", description: "Identify countries fast", icon: "Flag" },
  "memory-match": { name: "Memory Match", description: "Find matching pairs", icon: "Brain" },
}

export const getGameConfig = (gameType: PvPGameType) => {
  return AVAILABLE_PVP_GAMES[gameType]
}
