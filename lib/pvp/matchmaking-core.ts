"use server"

// Надёжные re-export'ы — чтобы сборщик статически видел все экспорты.
// Экспортируем makeMove и другие серверные функции из matchmaking-moves,
// а также функции поиска/отмены поиска и инициализации игры из соответствующих модулей.

// Экспортируем всё из matchmaking-moves (включая makeMove)
export * from "./matchmaking-moves"

// Импортируем и экспортируем core функции поиска/отмены из отдельного файла
import { findMatch, cancelSearch, type MatchmakingResult, type MatchState } from "./matchmaking-functions"

export { findMatch, cancelSearch }
export type { MatchmakingResult, MatchState }

// Экспортируем инициализаторы/утилиты для различных типов игр
export * from "./matchmaking-game-init"

// Локальные вспомогательные генераторы (оставлены на месте, экспортируем их тоже).
// Они используются в matchmaking-game-init, но оставлены здесь на случай прямого импорта.
export function initializeCheckersBoard() {
  const board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) board[row][col] = "black"
    }
  }
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) board[row][col] = "white"
    }
  }
  return { board, currentPlayer: "white" }
}

export function generateSudokuPuzzle() {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill(0))
}

export function generateCrosswordGrid() {
  return Array(10)
    .fill(null)
    .map(() => Array(10).fill(""))
}