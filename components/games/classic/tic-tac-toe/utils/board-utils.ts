import { Board, GameMode } from "../types"

export function getEmptyCells(board: Board): number[] {
  return board
    .map((cell, index) => cell === null ? index : -1)
    .filter(i => i !== -1)
}

export function getBoardCenter(mode: GameMode): number {
  const size = parseInt(mode[0])
  return Math.floor(size * size / 2)
}

export function getCorners(mode: GameMode): number[] {
  const size = parseInt(mode[0])
  return [0, size-1, size*(size-1), size*size-1]
}

export function isBoardFull(board: Board): boolean {
  return board.every(cell => cell !== null)
}

export function countMoves(board: Board): number {
  return board.filter(cell => cell !== null).length
}
