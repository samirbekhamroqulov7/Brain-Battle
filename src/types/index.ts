// ==================== ИГРОВЫЕ ТИПЫ ====================

// Базовая конфигурация игры
export interface GameConfig {
  id: string;
  name: string;
  description: string;
  category: GameCategory;
  timeLimit: number; // секунды
  players: 1 | 2;
  difficulty: number; // 1-5
  colorScheme: string; // Tailwind градиент
  icon: string;
  rules?: string[];
  features: string[];
  requires?: string[];
}

// Категории игр
export type GameCategory = 'puzzle' | 'strategy' | 'math' | 'words' | 'logic';

// Состояние игры
export interface GameState {
  id: string;
  gameId: string;
  status: GameStatus;
  players: Player[];
  currentPlayer: string;
  timer: number;
  moves: GameMove[];
  result?: GameResult;
  createdAt: number;
  updatedAt: number;
}

// Статусы игры
export type GameStatus = 'waiting' | 'playing' | 'paused' | 'finished' | 'cancelled';

// Результат игры
export interface GameResult {
  winner: string; // playerId
  reason: 'win' | 'timeout' | 'resignation' | 'draw';
  scores: Record<string, number>;
}

// Ход в игре
export interface GameMove {
  playerId: string;
  move: any; // Любые данные хода
  timestamp: number;
  moveNumber: number;
}

// ==================== ИГРОКИ И ПРОФИЛИ ====================

// Игрок
export interface Player {
  id: string;
  name: string;
  avatar: AvatarConfig;
  stats: PlayerStats;
  rank: number;
  level: number;
  status: PlayerStatus;
  achievements: string[];
  friends: string[];
}

// Статистика игрока
export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  totalTimePlayed: number;
  averageScore: number;
  winRate: number;
  currentStreak: number;
  maxStreak: number;
}

// Статус игрока
export type PlayerStatus = 'online' | 'offline' | 'in_game' | 'away' | 'busy';

// Аватар
export interface AvatarConfig {
  type: 'gradient' | 'emoji' | 'initial';
  value: string; // Для градиента: "from-cyan-400 to-blue-500", для эмодзи: "🎮"
  color?: string;
  bgColor?: string;
}

// ==================== РЕЙТИНГ И РАНГИ ====================

// Ранг игрока
export interface Rank {
  id: string;
  name: string;
  minElo: number;
  maxElo: number;
  color: string;
  icon: string;
  description: string;
}

// Матч ПВП
export interface PvPMatch {
  id: string;
  gameId: string;
  players: {
    playerId: string;
    rankBefore: number;
    rankAfter?: number;
  }[];
  result: GameResult;
  duration: number;
  startedAt: number;
  finishedAt: number;
}

// ==================== ЧАТ И СООБЩЕНИЯ ====================

// Сообщение в чате
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  type: 'text' | 'system' | 'emoji';
  gameId?: string;
}

// ==================== НАСТРОЙКИ ====================

// Настройки пользователя
export interface UserSettings {
  theme: 'dark' | 'light' | 'auto';
  sound: {
    enabled: boolean;
    volume: number;
    effectsVolume: number;
    musicVolume: number;
  };
  notifications: {
    gameInvites: boolean;
    friendRequests: boolean;
    gameResults: boolean;
    achievements: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  language: string;
}

// ==================== ДОСТИЖЕНИЯ ====================

// Достижение
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'games' | 'streaks' | 'skills' | 'social' | 'special';
  condition: AchievementCondition;
  unlockedAt?: number;
}

// Условие достижения
export interface AchievementCondition {
  type: 'games_played' | 'games_won' | 'win_streak' | 'perfect_game' | 'time_played' | 'friend_count';
  threshold: number;
  gameId?: string;
}

// ==================== СИСТЕМНЫЕ ТИПЫ ====================

// Уведомление
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'game_invite';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: number;
  read: boolean;
}

// Сессия
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: number;
  device: string;
}

// ==================== КОМПОНЕНТЫ ПРОПСЫ ====================

// Пропсы для игровых компонентов
export interface GameComponentProps {
  gameId: string;
  playerId: string;
  onMove: (move: any) => void;
  onGameEnd: (result: GameResult) => void;
  onTimeUpdate: (time: number) => void;
  isMultiplayer: boolean;
  opponent?: Player;
}

// Пропсы для карточек игр
export interface GameCardProps {
  game: GameConfig;
  onClick: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  showDetails?: boolean;
  compact?: boolean;
}

// Пропсы для кнопок меню
export interface MenuButtonProps {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  icon: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  gradient: string;
  hoverGradient?: string;
  iconColor?: string;
  pulse?: boolean;
  badge?: React.ReactNode;
  loading?: boolean;
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ТИПЫ ====================

// Утилиты для состояния загрузки
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Пагинация
export interface Pagination<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Ошибки API
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Успешный ответ API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: number;
}

// ==================== ENUMS И КОНСТАНТЫ ====================

// Конфигурация рангов
export const RANKS: Rank[] = [
  { id: 'novice', name: 'Новичок', minElo: 0, maxElo: 999, color: 'text-gray-400', icon: '🌱', description: 'Начальный уровень' },
  { id: 'apprentice', name: 'Ученик', minElo: 1000, maxElo: 1199, color: 'text-green-400', icon: '📚', description: 'Осваиваете основы' },
  { id: 'specialist', name: 'Знаток', minElo: 1200, maxElo: 1399, color: 'text-blue-400', icon: '🎓', description: 'Понимаете стратегии' },
  { id: 'expert', name: 'Эксперт', minElo: 1400, maxElo: 1599, color: 'text-purple-400', icon: '⭐', description: 'Мастер тактики' },
  { id: 'master', name: 'Мастер', minElo: 1600, maxElo: 1799, color: 'text-yellow-400', icon: '👑', description: 'Виртуоз логики' },
  { id: 'grandmaster', name: 'Гроссмейстер', minElo: 1800, maxElo: Infinity, color: 'text-red-400', icon: '🏆', description: 'Легенда игры' }
];

// События WebSocket
export enum SocketEvents {
  // Подключение
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  
  // Игры
  GAME_START = 'game:start',
  GAME_MOVE = 'game:move',
  GAME_END = 'game:end',
  GAME_UPDATE = 'game:update',
  
  // Игроки
  PLAYER_JOIN = 'player:join',
  PLAYER_LEAVE = 'player:leave',
  PLAYER_UPDATE = 'player:update',
  
  // Чат
  CHAT_MESSAGE = 'chat:message',
  CHAT_TYPING = 'chat:typing',
  
  // Уведомления
  NOTIFICATION = 'notification',
  
  // Матчмейкинг
  MATCH_FOUND = 'match:found',
  MATCH_CANCEL = 'match:cancel',
  MATCH_UPDATE = 'match:update',
  
  // Ошибки
  ERROR = 'error'
}

// Ключи для LocalStorage
export enum StorageKeys {
  USER_SETTINGS = 'brain-battle-settings',
  GAME_STATS = 'brain-battle-stats',
  SESSION_TOKEN = 'brain-battle-token',
  RECENT_GAMES = 'brain-battle-recent',
  FAVORITE_GAMES = 'brain-battle-favorites'
}

// ==================== ТИПЫ ДЛЯ КОНКРЕТНЫХ ИГР ====================

// Пентаго
export interface PentagoState {
  board: ('X' | 'O' | null)[][]; // 6x6 массив
  currentPlayer: 'X' | 'O';
  quadrantToRotate: number | null; // 0-3
  lastMove?: {
    player: 'X' | 'O';
    position: [number, number];
    rotatedQuadrant: number;
    direction: 'clockwise' | 'counterclockwise';
  };
  winner: 'X' | 'O' | 'draw' | null;
}

// Точки и квадраты
export interface DotsAndBoxesState {
  gridSize: number; // обычно 3x3, 4x4
  horizontalLines: boolean[][]; // линии между точками по горизонтали
  verticalLines: boolean[][]; // линии между точками по вертикали
  boxes: (string | null)[][]; // кому принадлежит квадрат
  currentPlayer: string;
  scores: Record<string, number>;
  lastBoxCaptured: boolean;
}

// Шахматы блиц
export interface ChessBlitzState {
  fen: string; // FEN нотация позиции
  moves: string[]; // список ходов в нотации
  timeWhite: number; // оставшееся время белых (секунды)
  timeBlack: number; // оставшееся время черных
  currentTurn: 'white' | 'black';
  status: 'playing' | 'checkmate' | 'stalemate' | 'draw' | 'timeout';
  winner?: 'white' | 'black';
}

// Математический спринт
export interface MathSprintState {
  problems: MathProblem[];
  currentProblem: number;
  score: number;
  timeLeft: number;
  answers: (number | null)[];
  streak: number;
}

export interface MathProblem {
  id: number;
  expression: string;
  answer: number;
  options?: number[]; // для режима с вариантами
  timeLimit: number;
}

// Судоку
export interface SudokuState {
  grid: number[][];
  solution: number[][];
  initial: number[][]; // начальные цифры (неизменяемые)
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  mistakes: number;
  hintsUsed: number;
  timeSpent: number;
}

// Быки и коровы
export interface BullsAndCowsState {
  secretCode: number[]; // загаданный код
  attempts: {
    guess: number[];
    bulls: number;
    cows: number;
  }[];
  currentGuess: number[];
  maxAttempts: number;
  solved: boolean;
}

// Пятнашки
export interface FifteenPuzzleState {
  board: number[][]; // 0 представляет пустую клетку
  emptyPosition: [number, number];
  movesCount: number;
  solved: boolean;
  timeSpent: number;
}

// ==================== УТИЛИТЫ ТИПОВ ====================

// Утилита для создания Partial с определенными обязательными полями
export type PartialWithRequired<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Утилита для выбора значений из enum
export type ValueOf<T> = T[keyof T];

// Утилита для глубокого readonly
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Утилита для ненулевых значений
export type NonNullable<T> = T extends null | undefined ? never : T;

// ==================== API ТИПЫ ====================

// Запросы
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface GameMoveRequest {
  gameId: string;
  playerId: string;
  move: any;
}

export interface MatchmakingRequest {
  gameId: string;
  minRank: number;
  maxRank: number;
}

// Ответы
export interface LoginResponse {
  token: string;
  user: Player;
  session: Session;
}

export interface GameStateResponse {
  game: GameState;
  players: Player[];
}

export interface LeaderboardEntry {
  rank: number;
  player: Player;
  elo: number;
  gamesPlayed: number;
  winRate: number;
}

// Экспорт всех типов
export type {
  GameConfig as IGameConfig,
  Player as IPlayer,
  GameState as IGameState,
  // и т.д. для удобства импорта
};