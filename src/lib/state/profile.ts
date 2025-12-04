import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, PlayerStats, AvatarConfig, Achievement, StorageKeys } from '@/types';

// Достижения игрока
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: 'Первая победа',
    description: 'Одержайте первую победу в любой игре',
    icon: '🏆',
    points: 10,
    category: 'games',
    condition: { type: 'games_won', threshold: 1 }
  },
  {
    id: 'game_master',
    name: 'Мастер игр',
    description: 'Сыграйте во все 20 игр',
    icon: '🎮',
    points: 50,
    category: 'games',
    condition: { type: 'games_played', threshold: 20 }
  },
  {
    id: 'win_streak_5',
    name: 'Неудержимый',
    description: 'Выиграйте 5 игр подряд',
    icon: '🔥',
    points: 30,
    category: 'streaks',
    condition: { type: 'win_streak', threshold: 5 }
  },
  {
    id: 'time_traveler',
    name: 'Путешественник во времени',
    description: 'Проведите 10 часов в играх',
    icon: '⏰',
    points: 100,
    category: 'time_played',
    condition: { type: 'time_played', threshold: 36000 } // 10 часов в секундах
  },
  {
    id: 'perfect_game',
    name: 'Совершенство',
    description: 'Выиграйте игру без единой ошибки',
    icon: '⭐',
    points: 25,
    category: 'skills',
    condition: { type: 'perfect_game', threshold: 1 }
  },
  {
    id: 'social_butterfly',
    name: 'Социальная бабочка',
    description: 'Добавьте 5 друзей',
    icon: '👥',
    points: 20,
    category: 'social',
    condition: { type: 'friend_count', threshold: 5 }
  }
];

// Начальное состояние игрока
const initialPlayer: Player = {
  id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: 'BrainMaster',
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

// Типы для стора профиля
interface ProfileStore {
  // Данные игрока
  player: Player;
  achievements: Achievement[];
  friends: Player[];
  
  // Действия с профилем
  updateProfile: (updates: Partial<Player>) => void;
  updateStats: (statsUpdate: Partial<PlayerStats>) => void;
  addGameResult: (result: 'win' | 'loss' | 'draw', timePlayed: number, score?: number) => void;
  addFriend: (friendId: string, friendData: Partial<Player>) => void;
  removeFriend: (friendId: string) => void;
  updateStatus: (status: Player['status']) => void;
  
  // Достижения
  checkAchievements: () => void;
  unlockAchievement: (achievementId: string) => void;
  getUnlockedAchievements: () => Achievement[];
  getLockedAchievements: () => Achievement[];
  
  // Ранг и уровень
  updateRank: (newRank: number) => void;
  calculateLevel: (rank: number) => number;
  
  // Аватар
  updateAvatar: (avatar: AvatarConfig) => void;
  getAvatarUrl: () => string;
  
  // Импорт/экспорт
  exportProfile: () => string;
  importProfile: (data: string) => void;
  
  // Сброс
  resetProfile: () => void;
}

// Создание стора профиля
export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      // Начальные данные
      player: initialPlayer,
      achievements: ACHIEVEMENTS,
      friends: [],
      
      // Обновление профиля
      updateProfile: (updates) =>
        set((state) => ({
          player: { ...state.player, ...updates }
        })),
      
      // Обновление статистики
      updateStats: (statsUpdate) =>
        set((state) => {
          const newStats = { ...state.player.stats, ...statsUpdate };
          
          // Пересчет win rate
          if (newStats.gamesPlayed > 0) {
            newStats.winRate = Math.round((newStats.gamesWon / newStats.gamesPlayed) * 100);
          }
          
          // Пересчет среднего счета
          if (statsUpdate.averageScore !== undefined) {
            newStats.averageScore = statsUpdate.averageScore;
          }
          
          return {
            player: {
              ...state.player,
              stats: newStats
            }
          };
        }),
      
      // Добавление результата игры
      addGameResult: (result, timePlayed, score) => {
        const state = get();
        const newStats = { ...state.player.stats };
        
        // Обновление базовой статистики
        newStats.gamesPlayed += 1;
        newStats.totalTimePlayed += timePlayed;
        
        if (result === 'win') {
          newStats.gamesWon += 1;
          newStats.currentStreak += 1;
          newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
        } else if (result === 'loss') {
          newStats.gamesLost += 1;
          newStats.currentStreak = 0;
        } else {
          newStats.gamesDrawn += 1;
          newStats.currentStreak = 0;
        }
        
        // Обновление среднего счета
        if (score !== undefined) {
          const totalScore = state.player.stats.averageScore * (state.player.stats.gamesPlayed - 1) + score;
          newStats.averageScore = totalScore / newStats.gamesPlayed;
        }
        
        // Пересчет win rate
        newStats.winRate = Math.round((newStats.gamesWon / newStats.gamesPlayed) * 100);
        
        // Обновление состояния
        set({
          player: {
            ...state.player,
            stats: newStats
          }
        });
        
        // Проверка достижений
        get().checkAchievements();
        
        // Обновление ранга (упрощенная система ELO)
        if (result === 'win') {
          const rankIncrease = Math.floor(Math.random() * 20) + 10; // +10-30 за победу
          get().updateRank(state.player.rank + rankIncrease);
        } else if (result === 'loss') {
          const rankDecrease = Math.floor(Math.random() * 15) + 5; // -5-20 за поражение
          get().updateRank(Math.max(800, state.player.rank - rankDecrease));
        }
      },
      
      // Добавление друга
      addFriend: (friendId, friendData) =>
        set((state) => {
          if (state.player.friends.includes(friendId)) return state;
          
          const newFriend: Player = {
            id: friendId,
            name: friendData.name || 'Друг',
            avatar: friendData.avatar || { type: 'gradient', value: 'from-gray-400 to-gray-600' },
            stats: friendData.stats || initialPlayer.stats,
            rank: friendData.rank || 1000,
            level: friendData.level || 1,
            status: friendData.status || 'offline',
            achievements: friendData.achievements || [],
            friends: []
          };
          
          return {
            player: {
              ...state.player,
              friends: [...state.player.friends, friendId]
            },
            friends: [...state.friends, newFriend]
          };
        }),
      
      // Удаление друга
      removeFriend: (friendId) =>
        set((state) => ({
          player: {
            ...state.player,
            friends: state.player.friends.filter(id => id !== friendId)
          },
          friends: state.friends.filter(friend => friend.id !== friendId)
        })),
      
      // Обновление статуса
      updateStatus: (status) =>
        set((state) => ({
          player: { ...state.player, status }
        })),
      
      // Проверка достижений
      checkAchievements: () => {
        const state = get();
        const { player } = state;
        
        state.achievements.forEach(achievement => {
          if (player.achievements.includes(achievement.id)) return;
          
          let conditionMet = false;
          
          switch (achievement.condition.type) {
            case 'games_played':
              conditionMet = player.stats.gamesPlayed >= achievement.condition.threshold;
              break;
              
            case 'games_won':
              conditionMet = player.stats.gamesWon >= achievement.condition.threshold;
              break;
              
            case 'win_streak':
              conditionMet = player.stats.currentStreak >= achievement.condition.threshold;
              break;
              
            case 'perfect_game':
              // Эта логика будет в конкретных играх
              break;
              
            case 'time_played':
              conditionMet = player.stats.totalTimePlayed >= achievement.condition.threshold;
              break;
              
            case 'friend_count':
              conditionMet = player.friends.length >= achievement.condition.threshold;
              break;
          }
          
          if (conditionMet) {
            get().unlockAchievement(achievement.id);
          }
        });
      },
      
      // Разблокировка достижения
      unlockAchievement: (achievementId) =>
        set((state) => {
          if (state.player.achievements.includes(achievementId)) return state;
          
          const achievement = state.achievements.find(a => a.id === achievementId);
          if (!achievement) return state;
          
          return {
            player: {
              ...state.player,
              achievements: [...state.player.achievements, achievementId]
            }
          };
        }),
      
      // Получение разблокированных достижений
      getUnlockedAchievements: () => {
        const state = get();
        return state.achievements.filter(achievement =>
          state.player.achievements.includes(achievement.id)
        );
      },
      
      // Получение заблокированных достижений
      getLockedAchievements: () => {
        const state = get();
        return state.achievements.filter(achievement =>
          !state.player.achievements.includes(achievement.id)
        );
      },
      
      // Обновление ранга
      updateRank: (newRank) =>
        set((state) => {
          const clampedRank = Math.max(800, Math.min(2000, newRank));
          const newLevel = get().calculateLevel(clampedRank);
          
          return {
            player: {
              ...state.player,
              rank: clampedRank,
              level: newLevel
            }
          };
        }),
      
      // Расчет уровня на основе ранга
      calculateLevel: (rank) => {
        return Math.floor((rank - 800) / 20) + 1;
      },
      
      // Обновление аватара
      updateAvatar: (avatar) =>
        set((state) => ({
          player: { ...state.player, avatar }
        })),
      
      // Получение URL аватара (для градиентов)
      getAvatarUrl: () => {
        const state = get();
        const { avatar } = state.player;
        
        if (avatar.type === 'gradient') {
          return `linear-gradient(135deg, ${avatar.value})`;
        }
        
        if (avatar.type === 'emoji') {
          return avatar.value;
        }
        
        return 'linear-gradient(135deg, #667eea, #764ba2)';
      },
      
      // Экспорт профиля
      exportProfile: () => {
        const state = get();
        return JSON.stringify({
          player: state.player,
          achievements: state.player.achievements,
          friends: state.friends,
          exportedAt: Date.now()
        });
      },
      
      // Импорт профиля
      importProfile: (data) => {
        try {
          const imported = JSON.parse(data);
          
          set({
            player: {
              ...initialPlayer,
              ...imported.player,
              id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // Новый ID для безопасности
            },
            friends: imported.friends || []
          });
          
          return true;
        } catch (error) {
          console.error('Ошибка импорта профиля:', error);
          return false;
        }
      },
      
      // Сброс профиля
      resetProfile: () =>
        set({
          player: {
            ...initialPlayer,
            id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          },
          friends: []
        })
    }),
    {
      name: StorageKeys.GAME_STATS,
      storage: localStorage,
      partialize: (state) => ({
        player: state.player,
        friends: state.friends
      })
    }
  )
);

// Вспомогательные функции
export const profileActions = {
  // Быстрое обновление имени
  updateName: (name: string) => {
    useProfileStore.getState().updateProfile({ name });
  },
  
  // Быстрое обновление статуса
  setOnline: () => {
    useProfileStore.getState().updateStatus('online');
  },
  
  setAway: () => {
    useProfileStore.getState().updateStatus('away');
  },
  
  setInGame: () => {
    useProfileStore.getState().updateStatus('in_game');
  },
  
  // Получение статистики в удобном формате
  getFormattedStats: () => {
    const { player } = useProfileStore.getState();
    
    return {
      gamesPlayed: player.stats.gamesPlayed,
      winRate: `${player.stats.winRate}%`,
      timePlayed: formatTime(player.stats.totalTimePlayed),
      currentStreak: player.stats.currentStreak,
      maxStreak: player.stats.maxStreak,
      averageScore: Math.round(player.stats.averageScore)
    };
  },
  
  // Получение информации о ранге
  getRankInfo: (rank?: number) => {
    const currentRank = rank || useProfileStore.getState().player.rank;
    
    const ranks = [
      { name: 'Новичок', min: 800, max: 999, color: 'text-gray-400', icon: '🌱' },
      { name: 'Ученик', min: 1000, max: 1199, color: 'text-green-400', icon: '📚' },
      { name: 'Знаток', min: 1200, max: 1399, color: 'text-blue-400', icon: '🎓' },
      { name: 'Эксперт', min: 1400, max: 1599, color: 'text-purple-400', icon: '⭐' },
      { name: 'Мастер', min: 1600, max: 1799, color: 'text-yellow-400', icon: '👑' },
      { name: 'Гроссмейстер', min: 1800, max: 2000, color: 'text-red-400', icon: '🏆' }
    ];
    
    const rankInfo = ranks.find(r => currentRank >= r.min && currentRank <= r.max) || ranks[0];
    const progress = ((currentRank - rankInfo.min) / (rankInfo.max - rankInfo.min)) * 100;
    
    return {
      ...rankInfo,
      progress: Math.min(100, Math.max(0, progress)),
      rank: currentRank
    };
  },
  
  // Проверка нового достижения после игры
  checkGameAchievement: (gameId: string, result: 'win' | 'loss' | 'draw', perfectGame: boolean = false) => {
    const state = useProfileStore.getState();
    
    // Проверка достижения "Первая победа"
    if (result === 'win' && state.player.stats.gamesWon === 1) {
      state.unlockAchievement('first_win');
    }
    
    // Проверка достижения "Совершенство"
    if (perfectGame && result === 'win') {
      state.unlockAchievement('perfect_game');
    }
    
    // Проверка достижения "Мастер игр"
    const uniqueGamesPlayed = new Set(); // Здесь нужно отслеживать уникальные игры
    if (uniqueGamesPlayed.size >= 20) {
      state.unlockAchievement('game_master');
    }
  }
};

// Форматирование времени
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  }
  
  return `${minutes} минут`;
}

// Экспорт
export default useProfileStore;