import { Board, GameMode, Player } from "./types";

// Получить размер доски
export function getBoardSize(mode: GameMode): number {
  return parseInt(mode[0]);
}

// Получить все выигрышные комбинации для заданного режима
export function getWinningCombinations(mode: GameMode): number[][] {
  const size = getBoardSize(mode);
  const combinations: number[][] = [];

  // Горизонтальные линии
  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - 3; col++) {
      const combination = [];
      for (let i = 0; i < 3; i++) {
        combination.push(row * size + col + i);
      }
      combinations.push(combination);
    }
  }

  // Вертикальные линии
  for (let col = 0; col < size; col++) {
    for (let row = 0; row <= size - 3; row++) {
      const combination = [];
      for (let i = 0; i < 3; i++) {
        combination.push((row + i) * size + col);
      }
      combinations.push(combination);
    }
  }

  // Диагонали (слева направо)
  for (let row = 0; row <= size - 3; row++) {
    for (let col = 0; col <= size - 3; col++) {
      const combination = [];
      for (let i = 0; i < 3; i++) {
        combination.push((row + i) * size + col + i);
      }
      combinations.push(combination);
    }
  }

  // Диагонали (справа налево)
  for (let row = 0; row <= size - 3; row++) {
    for (let col = 2; col < size; col++) {
      const combination = [];
      for (let i = 0; i < 3; i++) {
        combination.push((row + i) * size + col - i);
      }
      combinations.push(combination);
    }
  }

  // Для больших досок также добавляем 4-клеточные комбинации
  if (size >= 5) {
    // Горизонтальные линии из 4 клеток
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - 4; col++) {
        const combination = [];
        for (let i = 0; i < 4; i++) {
          combination.push(row * size + col + i);
        }
        combinations.push(combination);
      }
    }

    // Вертикальные линии из 4 клеток
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - 4; row++) {
        const combination = [];
        for (let i = 0; i < 4; i++) {
          combination.push((row + i) * size + col);
        }
        combinations.push(combination);
      }
    }
  }

  return combinations;
}

// Проверить победителя
export function checkWinner(board: Board, mode: GameMode): { winner: Player | "draw"; line: number[] | null } {
  const combinations = getWinningCombinations(mode);
  const size = getBoardSize(mode);

  for (const combination of combinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combination };
    }
  }

  // Проверка на ничью (все клетки заполнены)
  if (board.every((cell) => cell !== null)) {
    return { winner: "draw", line: null };
  }

  return { winner: null, line: null };
}

// Инициализировать пустую доску
export function initializeBoard(mode: GameMode): Board {
  const size = getBoardSize(mode);
  return Array(size * size).fill(null);
}

// Проверить, возможен ли ход
export function isValidMove(board: Board, index: number): boolean {
  return board[index] === null;
}

// Сделать ход
export function makeMove(board: Board, index: number, player: Player): Board {
  if (!isValidMove(board, index)) return board;
  const newBoard = [...board];
  newBoard[index] = player;
  return newBoard;
}

// Получить координаты клетки
export function getCellCoordinates(index: number, size: number): { row: number; col: number } {
  return {
    row: Math.floor(index / size),
    col: index % size,
  };
}