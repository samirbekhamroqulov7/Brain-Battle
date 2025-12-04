import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameConfig, Player, GameState, UserSettings, Notification, StorageKeys } from '@/types';

// ==================== ТИПЫ СТОРА ====================

interface GameStore {
  // Игрок
  player: Player | null;
  setPlayer: (player: Player | null) => void;
  updatePlayerStats: (stats: Partial<Player['stats']>) => void;
  
  // Настройки
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  // Текущая игра
  currentGame: GameState | null;
  setCurrentGame: (game: GameState | null) => void;
  makeMove: (move: any) => void;
  
  // Избранные игры
  favoriteGames: string[]; // gameIds
  toggleFavorite: (gameId: string) => void;
  
  // История игр
  gameHistory: GameState[];
  addToHistory: (game: GameState) => void;
  clearHistory: () => void;
  
  // Уведомления
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  
  // Состояние UI
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  
  // Темп игры
  soundEnabled: boolean;
  toggleSound: () => void;
  
  // Сессия
  sessionToken: string | null;
  setSessionToken: (token: string | null) => void;
  
  // Сброс стора
  resetStore: () => void;
}

// ==================== НАЧАЛЬНОЕ СОСТОЯНИЕ ====================

const initialPlayer: Player = {
  id: 'guest_1',
  name: 'Гость',
  avatar: {
    type: 'gradient',
    value: 'from-cyan-400 to-blue-500'
  },
  stats: {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesDrawn: 0,
    totalTimePlayed: 0,
    averageScore: 0,
    winRate: 0,
    currentStreak: 0,
    maxStreak: 0
  },
  rank: 1000,
  level: 1,
  status: 'online',
  achievements: [],
  friends: []
};

const initialSettings: UserSettings = {
  theme: 'dark',
  sound: {
    enabled: true,
    volume: 0.7,
    effectsVolume: 0.8,
    musicVolume: 0.5
  },
  notifications: {
    gameInvites: true,
    friendRequests: true,
    gameResults: true,
    achievements: true
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium'
  },
  language: 'ru'
};

// ==================== СОЗДАНИЕ СТОРА ====================

export const useStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Игрок
      player: initialPlayer,
      setPlayer: (player) => set({ player }),
      
      updatePlayerStats: (stats) => {
        const currentPlayer = get().player;
        if (currentPlayer) {
          set({
            player: {
              ...currentPlayer,
              stats: {
                ...currentPlayer.stats,
                ...stats
              }
            }
          });
        }
      },
      
      // Настройки
      settings: initialSettings,
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings }
        })),
      
      // Текущая игра
      currentGame: null,
      setCurrentGame: (game) => set({ currentGame: game }),
      
      makeMove: (move) => {
        const currentGame = get().currentGame;
        if (currentGame && currentGame.status === 'playing') {
          // Здесь будет логика обработки хода
          // Пока просто обновляем состояние
          set({
            currentGame: {
              ...currentGame,
              moves: [...currentGame.moves, move],
              updatedAt: Date.now()
            }
          });
        }
      },
      
      // Избранные игры
      favoriteGames: ['pentago', 'chess-blitz', 'math-sprint'],
      toggleFavorite: (gameId) =>
        set((state) => {
          const isFavorite = state.favoriteGames.includes(gameId);
          return {
            favoriteGames: isFavorite
              ? state.favoriteGames.filter(id => id !== gameId)
              : [...state.favoriteGames, gameId]
          };
        }),
      
      // История игр
      gameHistory: [],
      addToHistory: (game) =>
        set((state) => ({
          gameHistory: [game, ...state.gameHistory].slice(0, 50) // Храним последние 50 игр
        })),
      clearHistory: () => set({ gameHistory: [] }),
      
      // Уведомления
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              timestamp: Date.now(),
              read: false
            },
            ...state.notifications
          ].slice(0, 20) // Храним последние 20 уведомлений
        })),
      
      markAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      // Состояние UI
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      loading: false,
      setLoading: (loading) => set({ loading }),
      error: null,
      setError: (error) => set({ error }),
      
      // Звук
      soundEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      
      // Сессия
      sessionToken: null,
      setSessionToken: (token) => set({ sessionToken: token }),
      
      // Сброс
      resetStore: () =>
        set({
          player: initialPlayer,
          settings: initialSettings,
          currentGame: null,
          favoriteGames: ['pentago', 'chess-blitz', 'math-sprint'],
          gameHistory: [],
          notifications: [],
          sidebarOpen: false,
          loading: false,
          error: null,
          soundEnabled: true,
          sessionToken: null
        })
    }),
    {
      name: StorageKeys.USER_SETTINGS,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        player: state.player,
        settings: state.settings,
        favoriteGames: state.favoriteGames,
        gameHistory: state.gameHistory.slice(0, 20), // Сохраняем только 20 последних игр
        notifications: state.notifications,
        soundEnabled: state.soundEnabled
      })
    }
  )
);

// ==================== ДЕРИВИРОВАННЫЕ СТОРЕС ====================

// Селекторы для производительности
export const usePlayer = () => useStore((state) => state.player);
export const useSettings = () => useStore((state) => state.settings);
export const useCurrentGame = () => useStore((state) => state.currentGame);
export const useFavoriteGames = () => useStore((state) => state.favoriteGames);
export const useNotifications = () => useStore((state) => state.notifications);
export const useLoading = () => useStore((state) => state.loading);

// Кастомные хуки
export const useGameStats = () => {
  const player = usePlayer();
  return player?.stats || initialPlayer.stats;
};

export const useUnreadNotifications = () => {
  const notifications = useNotifications();
  return notifications.filter(notif => !notif.read);
};

export const useIsFavorite = (gameId: string) => {
  const favoriteGames = useFavoriteGames();
  return favoriteGames.includes(gameId);
};

// ==================== ДЕЙСТВИЯ СТОРА ====================

// Экшены для игр
export const gameActions = {
  startGame: (gameId: string, players: Player[]) => {
    const newGame: GameState = {
      id: `game_${Date.now()}`,
      gameId,
      status: 'playing',
      players,
      currentPlayer: players[0].id,
      timer: 0,
      moves: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    useStore.getState().setCurrentGame(newGame);
    return newGame;
  },
  
  endGame: (result: GameState['result']) => {
    const currentGame = useStore.getState().currentGame;
    if (currentGame) {
      const endedGame: GameState = {
        ...currentGame,
        status: 'finished',
        result,
        updatedAt: Date.now()
      };
      
      useStore.getState().setCurrentGame(null);
      useStore.getState().addToHistory(endedGame);
      
      // Обновляем статистику игрока
      if (result && result.winner === useStore.getState().player?.id) {
        useStore.getState().updatePlayerStats({
          gamesPlayed: (useStore.getState().player?.stats.gamesPlayed || 0) + 1,
          gamesWon: (useStore.getState().player?.stats.gamesWon || 0) + 1
        });
      }
    }
  },
  
  surrender: () => {
    const currentGame = useStore.getState().currentGame;
    const player = useStore.getState().player;
    
    if (currentGame && player) {
      const result: GameState['result'] = {
        winner: currentGame.players.find(p => p.id !== player.id)?.id || '',
        reason: 'resignation',
        scores: {
          [player.id]: 0,
          [currentGame.players.find(p => p.id !== player.id)?.id || '']: 1
        }
      };
      
      gameActions.endGame(result);
    }
  }
};

// Экшены для игрока
export const playerActions = {
  updateRank: (newRank: number) => {
    const player = useStore.getState().player;
    if (player) {
      useStore.getState().setPlayer({
        ...player,
        rank: newRank,
        level: Math.floor(newRank / 100) + 1
      });
    }
  },
  
  addAchievement: (achievementId: string) => {
    const player = useStore.getState().player;
    if (player && !player.achievements.includes(achievementId)) {
      useStore.getState().setPlayer({
        ...player,
        achievements: [...player.achievements, achievementId]
      });
      
      // Добавляем уведомление
      useStore.getState().addNotification({
        type: 'success',
        title: 'Новое достижение!',
        message: 'Вы получили новое достижение'
      });
    }
  },
  
  updateStatus: (status: Player['status']) => {
    const player = useStore.getState().player;
    if (player) {
      useStore.getState().setPlayer({
        ...player,
        status
      });
    }
  }
};

// Экшены для уведомлений
export const notificationActions = {
  showError: (message: string) => {
    useStore.getState().addNotification({
      type: 'error',
      title: 'Ошибка',
      message
    });
  },
  
  showSuccess: (message: string) => {
    useStore.getState().addNotification({
      type: 'success',
      title: 'Успех',
      message
    });
  },
  
  showGameInvite: (fromPlayer: string, gameId: string) => {
    useStore.getState().addNotification({
      type: 'game_invite',
      title: 'Приглашение в игру',
      message: `${fromPlayer} приглашает вас сыграть`,
      action: {
        label: 'Принять',
        onClick: () => {
          console.log('Принято приглашение в игру:', gameId);
          // Здесь будет навигация к игре
        }
      }
    });
  }
};

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

// Расчет нового ELO рейтинга
export function calculateNewElo(
  playerElo: number,
  opponentElo: number,
  result: 'win' | 'loss' | 'draw',
  kFactor: number = 32
): number {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  
  let actualScore: number;
  switch (result) {
    case 'win': actualScore = 1; break;
    case 'loss': actualScore = 0; break;
    case 'draw': actualScore = 0.5; break;
    default: actualScore = 0.5;
  }
  
  return Math.round(playerElo + kFactor * (actualScore - expectedScore));
}

// Форматирование времени
export function formatGameTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Проверка звука
export function playSound(sound: 'move' | 'win' | 'lose' | 'notification', volume?: number) {
  const { soundEnabled, settings } = useStore.getState();
  
  if (!soundEnabled || !settings.sound.enabled) return;
  
  // Здесь будет реализация звуков
  // Пока просто логируем
  console.log(`Playing sound: ${sound} at volume ${volume || settings.sound.effectsVolume}`);
}

// ==================== ЭКСПОРТ ====================

export default useStore;
export { gameActions, playerActions, notificationActions };