// ==================== БАЗОВЫЕ ТИПЫ ДЛЯ ВСЕХ ИГР ====================

export type GameCategory = 
  | 'board'      // Настольные игры (шахматы, шашки, нарды)
  | 'strategy'   // Стратегические (го, реверси, блокус)
  | 'puzzle'     // Головоломки (судоку, пятнашки, ханойская башня)
  | 'word'       // Словесные (скрэббл, балда, алиас)
  | 'numbers'    // Числовые (быки и коровы, математический дуэль)
  | 'logic'      // Логические (мастермайнд, сет, точки)
  | 'card'       // Карточные (покер, блекджек, уно)
  | 'classic'    // Классические (крестики-нолики, морской бой)
  | 'party'      // Для вечеринок (крокодил, 20 вопросов, викторина)
  | 'mobile'     // Оптимизированные для мобильных

export type GameDifficulty = 
  | 'easy'
  | 'medium'
  | 'hard'
  | 'expert'

export type GameMode = 
  | 'singleplayer'
  | 'multiplayer'
  | 'pvp'
  | 'ai'

export type GameStatus = 
  | 'waiting'
  | 'playing'
  | 'paused'
  | 'finished'
  | 'abandoned'

export interface Player {
  id: string
  name: string
  avatar?: string
  score: number
  isAI?: boolean
  difficulty?: GameDifficulty
}

export interface GameMove {
  playerId: string
  move: any
  timestamp: number
  isValid: boolean
  message?: string
}

export interface GameHistory {
  moves: GameMove[]
  winner?: string
  duration: number
  scores: Record<string, number>
}

// ==================== БАЗОВЫЙ ИНТЕРФЕЙС ДЛЯ ВСЕХ ИГР ====================

export interface BaseGameConfig {
  id: string
  name: string
  description: string
  category: GameCategory
  difficulty: GameDifficulty
  minPlayers: number
  maxPlayers: number
  estimatedTime: number // в минутах
  supportsMobile: boolean
  requiresInternet?: boolean
  icon: string
  color: string
}

export interface GameState<T = any> {
  id: string
  gameId: string
  players: Player[]
  currentPlayer: string
  status: GameStatus
  board: T
  moves: GameMove[]
  history: GameHistory[]
  createdAt: number
  updatedAt: number
  winner?: string
  settings: Record<string, any>
}

// ==================== ИНТЕРФЕЙС ДЛЯ ИГРОВЫХ ДВИЖКОВ ====================

export interface GameEngine<T = any> {
  // Инициализация
  initialize: (config: BaseGameConfig, players: Player[]) => GameState<T>
  
  // Валидация
  validateMove: (state: GameState<T>, move: any) => boolean
  isValidMove: (state: GameState<T>, move: any) => boolean
  
  // Обновление состояния
  applyMove: (state: GameState<T>, move: any) => GameState<T>
  getNextPlayer: (state: GameState<T>) => string
  
  // Проверка окончания
  checkWin: (state: GameState<T>) => string | null
  checkDraw: (state: GameState<T>) => boolean
  isGameOver: (state: GameState<T>) => boolean
  
  // Вспомогательные методы
  getPossibleMoves: (state: GameState<T>) => any[]
  getGameScore: (state: GameState<T>) => Record<string, number>
  serialize: (state: GameState<T>) => string
  deserialize: (data: string) => GameState<T>
}

// ==================== СПИСОК ВСЕХ 38 ИГР ====================

export const ALL_GAMES: BaseGameConfig[] = [
  // Существующие 20 игр
  {
    id: 'pentago',
    name: 'Пентаго',
    description: 'Стратегическая игра с вращающимися квадрантами',
    category: 'strategy',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 10,
    supportsMobile: true,
    icon: '♟️',
    color: '#8b5cf6'
  },
  {
    id: 'dots-and-boxes',
    name: 'Точки и квадраты',
    description: 'Классическая игра на бумаге',
    category: 'classic',
    difficulty: 'easy',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 5,
    supportsMobile: true,
    icon: '⬛',
    color: '#ec4899'
  },
  {
    id: 'chess',
    name: 'Шахматы',
    description: 'Король настольных игр',
    category: 'board',
    difficulty: 'hard',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 30,
    supportsMobile: true,
    icon: '♔',
    color: '#1e293b'
  },
  {
    id: 'checkers',
    name: 'Шашки',
    description: 'Классическая игра шашками',
    category: 'board',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 15,
    supportsMobile: true,
    icon: '⚫',
    color: '#dc2626'
  },
  {
    id: 'backgammon',
    name: 'Нарды',
    description: 'Древняя игра с костями',
    category: 'board',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 20,
    supportsMobile: true,
    icon: '🎲',
    color: '#f59e0b'
  },
  {
    id: 'reversi',
    name: 'Реверси (Отелло)',
    description: 'Захватывай фишки противника',
    category: 'strategy',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 15,
    supportsMobile: true,
    icon: '⚪',
    color: '#10b981'
  },
  {
    id: 'go',
    name: 'Го',
    description: 'Древнейшая стратегическая игра',
    category: 'strategy',
    difficulty: 'expert',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 45,
    supportsMobile: true,
    icon: '⚫',
    color: '#000000'
  },
  {
    id: '15-puzzle',
    name: 'Пятнашки',
    description: 'Головоломка на скорость',
    category: 'puzzle',
    difficulty: 'medium',
    minPlayers: 1,
    maxPlayers: 1,
    estimatedTime: 5,
    supportsMobile: true,
    icon: '🧩',
    color: '#3b82f6'
  },
  {
    id: 'sudoku',
    name: 'Судоку',
    description: 'Числовая головоломка',
    category: 'puzzle',
    difficulty: 'medium',
    minPlayers: 1,
    maxPlayers: 1,
    estimatedTime: 10,
    supportsMobile: true,
    icon: '9️⃣',
    color: '#8b5cf6'
  },
  {
    id: 'bridge',
    name: 'Бридж',
    description: 'Интеллектуальная карточная игра',
    category: 'card',
    difficulty: 'hard',
    minPlayers: 4,
    maxPlayers: 4,
    estimatedTime: 60,
    supportsMobile: true,
    icon: '🃏',
    color: '#7c3aed'
  },
  {
    id: 'scrabble',
    name: 'Эрудит (Scrabble)',
    description: 'Словообразующая игра',
    category: 'word',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 4,
    estimatedTime: 30,
    supportsMobile: true,
    icon: '🔤',
    color: '#10b981'
  },
  {
    id: 'balda',
    name: 'Балда',
    description: 'Словесная игра на поле',
    category: 'word',
    difficulty: 'easy',
    minPlayers: 2,
    maxPlayers: 4,
    estimatedTime: 10,
    supportsMobile: true,
    icon: '📝',
    color: '#f59e0b'
  },
  {
    id: 'alias',
    name: 'Алиас',
    description: 'Объяснение слов на время',
    category: 'word',
    difficulty: 'easy',
    minPlayers: 2,
    maxPlayers: 8,
    estimatedTime: 15,
    supportsMobile: true,
    icon: '🗣️',
    color: '#ef4444'
  },
  {
    id: 'charades',
    name: 'Крокодил',
    description: 'Покажи слово без слов',
    category: 'party',
    difficulty: 'easy',
    minPlayers: 3,
    maxPlayers: 12,
    estimatedTime: 20,
    supportsMobile: true,
    icon: '🎭',
    color: '#ec4899'
  },
  {
    id: 'anagrams',
    name: 'Анаграммы',
    description: 'Составь слова из букв на скорость',
    category: 'word',
    difficulty: 'medium',
    minPlayers: 1,
    maxPlayers: 4,
    estimatedTime: 5,
    supportsMobile: true,
    icon: '🔠',
    color: '#8b5cf6'
  },
  {
    id: '20-questions',
    name: '20 вопросов',
    description: 'Угадай предмет за 20 вопросов',
    category: 'party',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 5,
    supportsMobile: true,
    icon: '❓',
    color: '#06b6d4'
  },
  {
    id: 'quiz',
    name: 'Викторина',
    description: 'Вопрос-ответ на разные темы',
    category: 'party',
    difficulty: 'medium',
    minPlayers: 1,
    maxPlayers: 4,
    estimatedTime: 10,
    supportsMobile: true,
    icon: '🎯',
    color: '#f59e0b'
  },
  {
    id: 'blackjack',
    name: 'Blackjack (21)',
    description: 'Карточная игра против дилера',
    category: 'card',
    difficulty: 'easy',
    minPlayers: 1,
    maxPlayers: 7,
    estimatedTime: 10,
    supportsMobile: true,
    icon: '🃁',
    color: '#000000'
  },
  {
    id: 'poker',
    name: 'Покер (Техасский холдем)',
    description: 'Популярная карточная игра',
    category: 'card',
    difficulty: 'hard',
    minPlayers: 2,
    maxPlayers: 10,
    estimatedTime: 30,
    supportsMobile: true,
    icon: '♦️',
    color: '#dc2626'
  },
  {
    id: 'dice-poker',
    name: 'Покер на костях',
    description: 'Покер с использованием костей',
    category: 'numbers',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 6,
    estimatedTime: 15,
    supportsMobile: true,
    icon: '🎲',
    color: '#7c3aed'
  },
  {
    id: 'mancala',
    name: 'Манкала',
    description: 'Африканская настольная игра',
    category: 'strategy',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 10,
    supportsMobile: true,
    icon: '🪨',
    color: '#d97706'
  },
  {
    id: 'carcassonne',
    name: 'Каркассон',
    description: 'Стратегическая игра с плитками',
    category: 'strategy',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 5,
    estimatedTime: 45,
    supportsMobile: true,
    icon: '🏰',
    color: '#059669'
  },
  {
    id: 'uno',
    name: 'Уно',
    description: 'Весёлая карточная игра',
    category: 'card',
    difficulty: 'easy',
    minPlayers: 2,
    maxPlayers: 10,
    estimatedTime: 15,
    supportsMobile: true,
    icon: '🌈',
    color: '#ec4899'
  },
  {
    id: 'paper-soccer',
    name: 'Бумажный футбол',
    description: 'Тактическая игра на бумаге',
    category: 'strategy',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 10,
    supportsMobile: true,
    icon: '⚽',
    color: '#10b981'
  },
  {
    id: 'dots',
    name: 'Точки',
    description: 'Игра на бумаге с точками',
    category: 'logic',
    difficulty: 'easy',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 5,
    supportsMobile: true,
    icon: '•',
    color: '#3b82f6'
  },
  {
    id: 'bulls-and-cows',
    name: 'Быки и коровы',
    description: 'Логическая игра с числами',
    category: 'numbers',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 5,
    supportsMobile: true,
    icon: '🐮',
    color: '#f59e0b'
  },
  {
    id: 'mastermind',
    name: 'Mastermind',
    description: 'Логическая игра с цветами',
    category: 'logic',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 10,
    supportsMobile: true,
    icon: '🎨',
    color: '#8b5cf6'
  },
  {
    id: 'set-game',
    name: 'Сет (Set)',
    description: 'Карточная игра на поиск комбинаций',
    category: 'logic',
    difficulty: 'medium',
    minPlayers: 1,
    maxPlayers: 4,
    estimatedTime: 10,
    supportsMobile: true,
    icon: '🃏',
    color: '#ec4899'
  },
  {
    id: 'tower-of-hanoi',
    name: 'Ханойская башня',
    description: 'Математическая головоломка',
    category: 'puzzle',
    difficulty: 'medium',
    minPlayers: 1,
    maxPlayers: 1,
    estimatedTime: 5,
    supportsMobile: true,
    icon: '🗼',
    color: '#06b6d4'
  },
  {
    id: 'blokus',
    name: 'Блокус (Blokus)',
    description: 'Стратегическая игра с фигурами',
    category: 'strategy',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 4,
    estimatedTime: 20,
    supportsMobile: true,
    icon: '🧩',
    color: '#10b981'
  },
  {
    id: 'math-duel',
    name: 'Математический дуэль',
    description: 'Арифметика на время',
    category: 'numbers',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 5,
    supportsMobile: true,
    icon: '🧮',
    color: '#ef4444'
  },
  {
    id: 'tic-tac-toe-large',
    name: 'Крестики-нолики (большое поле)',
    description: 'Классическая игра на поле 5x5',
    category: 'classic',
    difficulty: 'easy',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 5,
    supportsMobile: true,
    icon: '❌',
    color: '#3b82f6'
  },
  {
    id: 'battleship',
    name: 'Морской бой',
    description: 'Стратегическая игра на угадывание',
    category: 'strategy',
    difficulty: 'medium',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 15,
    supportsMobile: true,
    icon: '🚢',
    color: '#06b6d4'
  },
  {
    id: 'connect-four',
    name: 'Четыре в ряд',
    description: 'Классическая вертикальная игра',
    category: 'classic',
    difficulty: 'easy',
    minPlayers: 2,
    maxPlayers: 2,
    estimatedTime: 5,
    supportsMobile: true,
    icon: '🔴',
    color: '#ef4444'
  },
  {
    id: 'memory-game',
    name: 'Мемори',
    description: 'Игра на память с карточками',
    category: 'puzzle',
    difficulty: 'easy',
    minPlayers: 1,
    maxPlayers: 4,
    estimatedTime: 5,
    supportsMobile: true,
    icon: '🧠',
    color: '#8b5cf6'
  },
  {
    id: 'word-search',
    name: 'Поиск слов',
    description: 'Найди слова в сетке букв',
    category: 'word',
    difficulty: 'easy',
    minPlayers: 1,
    maxPlayers: 1,
    estimatedTime: 10,
    supportsMobile: true,
    icon: '🔍',
    color: '#10b981'
  },
  {
    id: 'crossword',
    name: 'Кроссворд',
    description: 'Классическая словесная головоломка',
    category: 'word',
    difficulty: 'hard',
    minPlayers: 1,
    maxPlayers: 1,
    estimatedTime: 30,
    supportsMobile: true,
    icon: '📋',
    color: '#7c3aed'
  },
  {
    id: 'mahjong',
    name: 'Маджонг',
    description: 'Китайская игра с костями',
    category: 'strategy',
    difficulty: 'hard',
    minPlayers: 4,
    maxPlayers: 4,
    estimatedTime: 60,
    supportsMobile: true,
    icon: '🀄',
    color: '#dc2626'
  }
]

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

export function getGameById(id: string): BaseGameConfig | undefined {
  return ALL_GAMES.find(game => game.id === id)
}

export function getGamesByCategory(category: GameCategory): BaseGameConfig[] {
  return ALL_GAMES.filter(game => game.category === category)
}

export function getGamesByDifficulty(difficulty: GameDifficulty): BaseGameConfig[] {
  return ALL_GAMES.filter(game => game.difficulty === difficulty)
}

export function getGamesForMobile(): BaseGameConfig[] {
  return ALL_GAMES.filter(game => game.supportsMobile)
}

export function searchGames(query: string): BaseGameConfig[] {
  const lowerQuery = query.toLowerCase()
  return ALL_GAMES.filter(game => 
    game.name.toLowerCase().includes(lowerQuery) ||
    game.description.toLowerCase().includes(lowerQuery) ||
    game.category.toLowerCase().includes(lowerQuery)
  )
}