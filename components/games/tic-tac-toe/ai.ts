import { Board, AILevel } from "./types";
import { getWinningCombinations, getBoardSize } from "./utils";

// Оценка позиции для минимакса
function evaluatePosition(board: Board, player: "X" | "O", mode: string): number {
  const size = getBoardSize(mode as any);
  const combinations = getWinningCombinations(mode as any);
  let score = 0;

  for (const combination of combinations) {
    const [a, b, c] = combination;
    const cells = [board[a], board[b], board[c]];

    const playerCount = cells.filter(cell => cell === player).length;
    const opponentCount = cells.filter(cell => cell === (player === "X" ? "O" : "X")).length;
    const emptyCount = cells.filter(cell => cell === null).length;

    if (playerCount === 3) score += 100;
    else if (playerCount === 2 && emptyCount === 1) score += 10;
    else if (playerCount === 1 && emptyCount === 2) score += 1;
    else if (opponentCount === 2 && emptyCount === 1) score -= 20;
    else if (opponentCount === 3) score -= 100;
  }

  return score;
}

// Минимакс алгоритм
function minimax(board: Board, depth: number, isMaximizing: boolean, player: "X" | "O", mode: string, maxDepth: number): { score: number; index: number | null } {
  const size = getBoardSize(mode as any);
  const winner = checkWinner(board, mode as any);
  
  if (winner.winner === player) return { score: 100 - depth, index: null };
  if (winner.winner === (player === "X" ? "O" : "X")) return { score: -100 + depth, index: null };
  if (winner.winner === "draw") return { score: 0, index: null };
  if (depth >= maxDepth) return { score: evaluatePosition(board, player, mode), index: null };

  const emptyIndices = board.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1);

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove = emptyIndices[0];

    for (const index of emptyIndices) {
      const newBoard = [...board];
      newBoard[index] = player;
      const result = minimax(newBoard, depth + 1, false, player, mode, maxDepth);
      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = index;
      }
    }

    return { score: bestScore, index: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove = emptyIndices[0];

    for (const index of emptyIndices) {
      const newBoard = [...board];
      newBoard[index] = player === "X" ? "O" : "X";
      const result = minimax(newBoard, depth + 1, true, player, mode, maxDepth);
      if (result.score < bestScore) {
        bestScore = result.score;
        bestMove = index;
      }
    }

    return { score: bestScore, index: bestMove };
  }
}

// Основная функция для хода ИИ
export function makeAIMove(board: Board, aiLevel: AILevel, mode: string, currentPlayer: "X" | "O"): number {
  const size = getBoardSize(mode as any);
  const emptyIndices = board.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1);

  if (emptyIndices.length === 0) return -1;

  // Легкий уровень - случайные ходы с базовой логикой
  if (aiLevel === "novice") {
    // 70% случайных ходов, 30% умных
    if (Math.random() < 0.7) {
      return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }
  }

  // Средний уровень - минимакс с небольшой глубиной
  if (aiLevel === "pro") {
    const maxDepth = size <= 3 ? 4 : 2;
    const result = minimax(board, 0, true, currentPlayer === "X" ? "O" : "X", mode, maxDepth);
    return result.index !== null ? result.index : emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  // Сложный уровень - минимакс с большой глубиной
  if (aiLevel === "grandmaster") {
    const maxDepth = size <= 3 ? 8 : size <= 5 ? 4 : 3;
    const result = minimax(board, 0, true, currentPlayer === "X" ? "O" : "X", mode, maxDepth);
    return result.index !== null ? result.index : emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  // Базовые стратегии для всех уровней
  const currentPlayerSymbol = currentPlayer === "X" ? "O" : "X";
  const opponentSymbol = currentPlayer;

  // 1. Попробовать выиграть
  for (const combination of getWinningCombinations(mode as any)) {
    const [a, b, c] = combination;
    const cells = [board[a], board[b], board[c]];
    
    if (cells.filter(cell => cell === currentPlayerSymbol).length === 2 && 
        cells.includes(null)) {
      return combination.find(i => board[i] === null)!;
    }
  }

  // 2. Блокировать противника
  for (const combination of getWinningCombinations(mode as any)) {
    const [a, b, c] = combination;
    const cells = [board[a], board[b], board[c]];
    
    if (cells.filter(cell => cell === opponentSymbol).length === 2 && 
        cells.includes(null)) {
      return combination.find(i => board[i] === null)!;
    }
  }

  // 3. Занимать центр
  const centerIndex = Math.floor((size * size) / 2);
  if (board[centerIndex] === null) return centerIndex;

  // 4. Занимать углы
  const corners = [0, size - 1, size * (size - 1), size * size - 1];
  const availableCorners = corners.filter(i => board[i] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // 5. Случайный ход
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function checkWinner(board: Board, mode: string): { winner: any; line: null } {
  // Упрощенная проверка для демонстрации
  const combinations = getWinningCombinations(mode as any);
  
  for (const combination of combinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: null };
    }
  }
  
  if (board.every(cell => cell !== null)) {
    return { winner: "draw", line: null };
  }
  
  return { winner: null, line: null };
}