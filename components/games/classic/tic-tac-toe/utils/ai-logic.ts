import { GameMode } from "../types"
import { checkWinner } from "./game-logic"

export function makeAIMove(
  board: Array<string | null>,
  mode: GameMode,
  aiSymbol: "X" | "O"
): number {
  const playerSymbol = aiSymbol === "X" ? "O" : "X"
  const size = mode === "3x3" ? 3 : mode === "5x5" ? 5 : 7
  
  // Получаем список пустых клеток
  const emptyCells = board
    .map((cell, index) => cell === null ? index : -1)
    .filter(index => index !== -1)
  
  if (emptyCells.length === 0) return -1

  // 1. Проверяем, можем ли выиграть следующим ходом
  for (const cell of emptyCells) {
    const testBoard = [...board]
    testBoard[cell] = aiSymbol
    const result = checkWinner(testBoard, mode)
    if (result.winner === aiSymbol) {
      return cell
    }
  }

  // 2. Проверяем, может ли игрок выиграть следующим ходом (блокируем)
  for (const cell of emptyCells) {
    const testBoard = [...board]
    testBoard[cell] = playerSymbol
    const result = checkWinner(testBoard, mode)
    if (result.winner === playerSymbol) {
      return cell
    }
  }

  // 3. Стратегические ходы
  let preferredPositions: number[] = []
  
  if (size === 3) {
    // Для 3x3: центр, углы, затем стороны
    const center = Math.floor(size * size / 2)
    const corners = [0, size - 1, size * (size - 1), size * size - 1]
    const sides = []
    for (let i = 0; i < size * size; i++) {
      if (!corners.includes(i) && i !== center) {
        sides.push(i)
      }
    }
    preferredPositions = [center, ...corners, ...sides]
  } else if (size === 5) {
    // Для 5x5: центр и ближайшие к центру позиции
    const center = Math.floor(size * size / 2)
    const centerIndices = [
      center,
      center - 1, center + 1,
      center - size, center + size,
      center - size - 1, center - size + 1,
      center + size - 1, center + size + 1
    ]
    preferredPositions = [...centerIndices]
    // Добавляем остальные позиции
    for (let i = 0; i < size * size; i++) {
      if (!centerIndices.includes(i)) {
        preferredPositions.push(i)
      }
    }
  } else {
    // Для 7x7: случайный, но избегаем краев в начале
    const middleIndices = []
    for (let row = 2; row < size - 2; row++) {
      for (let col = 2; col < size - 2; col++) {
        middleIndices.push(row * size + col)
      }
    }
    if (middleIndices.length > 0) {
      preferredPositions = [...middleIndices]
      for (let i = 0; i < size * size; i++) {
        if (!middleIndices.includes(i)) {
          preferredPositions.push(i)
        }
      }
    } else {
      preferredPositions = emptyCells
    }
  }
  
  // Выбираем первую доступную предпочтительную позицию
  for (const pos of preferredPositions) {
    if (emptyCells.includes(pos)) {
      return pos
    }
  }

  // Fallback: случайный из доступных
  return emptyCells[Math.floor(Math.random() * emptyCells.length)]
}
