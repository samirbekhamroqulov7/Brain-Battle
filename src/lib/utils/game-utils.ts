import { GameConfig, GameState, Player, GameResult } from '@/types';

/**
 * Утилиты для работы с играми
 */

// Форматирование времени игры
export function formatGameTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Форматирование времени для таймера
export function formatTimerTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Получение категории игры на русском
export function getGameCategoryName(category: string): string {
  const categories: Record<string, string> = {
    puzzle: 'Головоломка',
    strategy: 'Стратегия',
    math: 'Математика',
    words: 'Слова',
    logic: 'Логика'
  };
  return categories[category] || 'Игра';
}

// Получение цвета для категории игры
export function getGameCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    puzzle: 'bg-gradient-to-r from-purple-500 to-pink-500',
    strategy: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    math: 'bg-gradient-to-r from-green-500 to-emerald-500',
    words: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    logic: 'bg-gradient-to-r from-cyan-500 to-blue-500'
  };
  return colors[category] || 'bg-gradient-to-r from-gray-500 to-gray-600';
}

// Получение иконки для категории игры
export function getGameCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    puzzle: '🧩',
    strategy: '♟️',
    math: '🧮',
    words: '📝',
    logic: '🔍'
  };
  return icons[category] || '🎮';
}

// Расчет сложности игры в звездах
export function getDifficultyStars(difficulty: number): string {
  return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
}

// Генерация уникального ID игры
export function generateGameId(): string {
  return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Проверка возможности присоединения к игре
export function canJoinGame(game: GameState, playerId: string): boolean {
  if (game.status !== 'waiting') return false;
  if (game.players.some(p => p.id === playerId)) return false;
  if (game.players.length >= 2) return false; // Максимум 2 игрока
  return true;
}

// Расчет результатов игры для таблицы лидеров
export function calculateGameResults(
  players: Player[],
  scores: Record<string, number>
): GameResult {
  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = scores[a.id] || 0;
    const scoreB = scores[b.id] || 0;
    return scoreB - scoreA;
  });

  const winner = sortedPlayers[0].id;
  const isDraw = scores[winner] === scores[sortedPlayers[1]?.id];

  return {
    winner: isDraw ? null : winner,
    reason: isDraw ? 'draw' : 'win',
    scores
  };
}

// Фильтрация игр по различным критериям
export function filterGames(
  games: GameConfig[],
  filters: {
    category?: string;
    difficulty?: number;
    players?: number;
    search?: string;
  }
): GameConfig[] {
  return games.filter(game => {
    // Фильтр по категории
    if (filters.category && filters.category !== 'all' && game.category !== filters.category) {
      return false;
    }
    
    // Фильтр по сложности
    if (filters.difficulty && game.difficulty !== filters.difficulty) {
      return false;
    }
    
    // Фильтр по количеству игроков
    if (filters.players && game.players !== filters.players) {
      return false;
    }
    
    // Поиск по названию и описанию
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesName = game.name.toLowerCase().includes(searchLower);
      const matchesDesc = game.description.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesDesc) return false;
    }
    
    return true;
  });
}

// Сортировка игр
export function sortGames(
  games: GameConfig[],
  sortBy: 'name' | 'difficulty' | 'time' | 'popularity',
  order: 'asc' | 'desc' = 'asc'
): GameConfig[] {
  const sorted = [...games];
  
  sorted.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'difficulty':
        aValue = a.difficulty;
        bValue = b.difficulty;
        break;
      case 'time':
        aValue = a.timeLimit;
        bValue = b.timeLimit;
        break;
      case 'popularity':
        // Здесь можно добавить логику популярности
        aValue = 0;
        bValue = 0;
        break;
    }
    
    if (order === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
  
  return sorted;
}

// Генерация случайной игры
export function getRandomGame(games: GameConfig[]): GameConfig {
  return games[Math.floor(Math.random() * games.length)];
}

// Проверка доступности игры (для ПВП)
export function isGameAvailableForPvP(game: GameConfig): boolean {
  return game.players === 2; // Только игры для 2 игроков
}

// Получение рекомендуемых игр на основе истории
export function getRecommendedGames(
  allGames: GameConfig[],
  playedGames: string[], // IDs сыгранных игр
  count: number = 3
): GameConfig[] {
  // Фильтруем несыгранные игры
  const unplayedGames = allGames.filter(game => !playedGames.includes(game.id));
  
  // Если есть несыгранные игры, выбираем случайные
  if (unplayedGames.length > 0) {
    const recommendations: GameConfig[] = [];
    const shuffled = [...unplayedGames].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      recommendations.push(shuffled[i]);
    }
    
    return recommendations;
  }
  
  // Если все игры сыграны, возвращаем популярные
  return allGames
    .sort((a, b) => b.difficulty - a.difficulty) // Сначала более сложные
    .slice(0, count);
}

// Расчет очков за игру
export function calculateGamePoints(
  result: 'win' | 'loss' | 'draw',
  difficulty: number,
  timeBonus: number = 0
): number {
  let basePoints = 0;
  
  switch (result) {
    case 'win':
      basePoints = 100;
      break;
    case 'draw':
      basePoints = 50;
      break;
    case 'loss':
      basePoints = 10;
      break;
  }
  
  // Множитель сложности
  const difficultyMultiplier = 1 + (difficulty - 1) * 0.2;
  
  // Бонус за время
  const totalPoints = Math.round(basePoints * difficultyMultiplier + timeBonus);
  
  return Math.max(1, totalPoints);
}

// Валидация имени игрока
export function validatePlayerName(name: string): {
  isValid: boolean;
  error?: string;
} {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Имя не может быть пустым' };
  }
  
  if (name.length < 2) {
    return { isValid: false, error: 'Имя должно содержать минимум 2 символа' };
  }
  
  if (name.length > 20) {
    return { isValid: false, error: 'Имя не должно превышать 20 символов' };
  }
  
  // Проверка на специальные символы
  const regex = /^[a-zA-Zа-яА-Я0-9_\s]+$/;
  if (!regex.test(name)) {
    return { isValid: false, error: 'Имя содержит недопустимые символы' };
  }
  
  return { isValid: true };
}

// Создание URL для игры
export function createGameUrl(gameId: string, mode: 'classic' | 'pvp' | 'ai' = 'classic'): string {
  const baseUrl = '/game';
  
  if (mode === 'classic') {
    return `${baseUrl}/${gameId}`;
  } else if (mode === 'pvp') {
    return `${baseUrl}/${gameId}?mode=pvp`;
  } else if (mode === 'ai') {
    return `${baseUrl}/${gameId}?mode=ai`;
  }
  
  return `${baseUrl}/${gameId}`;
}

// Получение начальных данных для игры
export function getInitialGameState(
  gameId: string,
  players: Player[]
): Omit<GameState, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    gameId,
    status: 'waiting',
    players,
    currentPlayer: players[0]?.id || '',
    timer: 0,
    moves: []
  };
}

// Экспорт данных игры
export function exportGameData(gameState: GameState): string {
  const exportData = {
    gameId: gameState.gameId,
    players: gameState.players.map(p => ({ id: p.id, name: p.name })),
    moves: gameState.moves,
    result: gameState.result,
    duration: gameState.timer,
    exportedAt: Date.now()
  };
  
  return JSON.stringify(exportData, null, 2);
}

// Импорт данных игры
export function importGameData(data: string): Partial<GameState> | null {
  try {
    const imported = JSON.parse(data);
    
    // Валидация импортированных данных
    if (!imported.gameId || !imported.players) {
      throw new Error('Невалидные данные игры');
    }
    
    return {
      gameId: imported.gameId,
      players: imported.players,
      moves: imported.moves || [],
      result: imported.result,
      timer: imported.duration || 0
    };
  } catch (error) {
    console.error('Ошибка импорта игры:', error);
    return null;
  }
}

// Утилиты для работы с местоположением в игре
export function getBoardPosition(index: number, total: number): { x: number; y: number } {
  const size = Math.sqrt(total);
  const row = Math.floor(index / size);
  const col = index % size;
  
  return { x: col, y: row };
}

export function getIndexFromPosition(x: number, y: number, size: number): number {
  return y * size + x;
}

// Проверка на победу в играх типа "n в ряд"
export function checkLineWin(
  board: any[],
  size: number,
  lineLength: number,
  player: string
): boolean {
  // Проверка горизонталей
  for (let row = 0; row < size; row++) {
    for (let col = 0; col <= size - lineLength; col++) {
      let win = true;
      for (let i = 0; i < lineLength; i++) {
        const index = getIndexFromPosition(col + i, row, size);
        if (board[index] !== player) {
          win = false;
          break;
        }
      }
      if (win) return true;
    }
  }
  
  // Проверка вертикалей
  for (let col = 0; col < size; col++) {
    for (let row = 0; row <= size - lineLength; row++) {
      let win = true;
      for (let i = 0; i < lineLength; i++) {
        const index = getIndexFromPosition(col, row + i, size);
        if (board[index] !== player) {
          win = false;
          break;
        }
      }
      if (win) return true;
    }
  }
  
  // Проверка диагоналей (слева направо)
  for (let row = 0; row <= size - lineLength; row++) {
    for (let col = 0; col <= size - lineLength; col++) {
      let win = true;
      for (let i = 0; i < lineLength; i++) {
        const index = getIndexFromPosition(col + i, row + i, size);
        if (board[index] !== player) {
          win = false;
          break;
        }
      }
      if (win) return true;
    }
  }
  
  // Проверка диагоналей (справа налево)
  for (let row = 0; row <= size - lineLength; row++) {
    for (let col = lineLength - 1; col < size; col++) {
      let win = true;
      for (let i = 0; i < lineLength; i++) {
        const index = getIndexFromPosition(col - i, row + i, size);
        if (board[index] !== player) {
          win = false;
          break;
        }
      }
      if (win) return true;
    }
  }
  
  return false;
}