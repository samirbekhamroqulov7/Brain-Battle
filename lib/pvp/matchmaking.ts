"use server"

// Реэкспорт функций из других модулей
export { makeMove } from "./matchmaking-moves"
export { findMatch, cancelSearch } from "./matchmaking-core"
export { initializeGameState, generateMathProblems, generateFlagsQuestions, generateAnagramWords } from "./matchmaking-game-init"

// Типы также нужно реэкспортировать
export type { MatchmakingResult, MatchState } from "./matchmaking-core"

// The existing code for findMatch, cancelSearch, initializeGameState, generateMathProblems, generateFlagsQuestions, generateAnagramWords
// and checkGameResult, applyMove, updatePlayerStats has been moved to separate modules.
// The main matchmaking module now only re-exports functions and types from these modules.

// initializeCheckersBoard, generateSudokuPuzzle, generateCrosswordGrid
// Эти функции специфичны для определенных типов игр и оставлены здесь

function initializeCheckersBoard() {
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

function generateSudokuPuzzle() {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill(0))
}

function generateCrosswordGrid() {
  return Array(10)
    .fill(null)
    .map(() => Array(10).fill(""))
}

// Также экспортируем локальные функции, если они нужны где-то еще
export { initializeCheckersBoard, generateSudokuPuzzle, generateCrosswordGrid }