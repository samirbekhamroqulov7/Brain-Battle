import { RANKS } from '@/types';

/**
 * Утилиты для работы с рангами и рейтингами
 */

// Интерфейс для информации о ранге
export interface RankInfo {
  id: string;
  name: string;
  minElo: number;
  maxElo: number;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
  progress: number;
  nextRank?: RankInfo;
  eloToNext: number;
}

// Получение информации о ранге по ELO
export function getRankInfo(elo: number): RankInfo {
  const rank = RANKS.find(r => elo >= r.minElo && elo <= r.maxElo) || RANKS[0];
  const progress = Math.min(100, ((elo - rank.minElo) / (rank.maxElo - rank.minElo)) * 100);
  const nextRank = RANKS[RANKS.indexOf(rank) + 1];
  const eloToNext = nextRank ? nextRank.minElo - elo : 0;
  
  // Цвета для Tailwind
  const colors: Record<string, { text: string; bg: string; border: string }> = {
    'novice': {
      text: 'text-gray-400',
      bg: 'bg-gradient-to-br from-gray-400 to-gray-600',
      border: 'border-gray-500'
    },
    'apprentice': {
      text: 'text-green-400',
      bg: 'bg-gradient-to-br from-green-400 to-emerald-600',
      border: 'border-green-500'
    },
    'specialist': {
      text: 'text-blue-400',
      bg: 'bg-gradient-to-br from-blue-400 to-cyan-600',
      border: 'border-blue-500'
    },
    'expert': {
      text: 'text-purple-400',
      bg: 'bg-gradient-to-br from-purple-400 to-violet-600',
      border: 'border-purple-500'
    },
    'master': {
      text: 'text-yellow-400',
      bg: 'bg-gradient-to-br from-yellow-400 to-orange-600',
      border: 'border-yellow-500'
    },
    'grandmaster': {
      text: 'text-red-400',
      bg: 'bg-gradient-to-br from-red-400 to-pink-600',
      border: 'border-red-500'
    }
  };
  
  const rankColors = colors[rank.id] || colors.novice;
  
  return {
    ...rank,
    textColor: rankColors.text,
    bgColor: rankColors.bg,
    borderColor: rankColors.border,
    progress: isNaN(progress) ? 100 : progress,
    nextRank: nextRank,
    eloToNext
  };
}

// Получение названия ранга по ELO
export function getRankName(elo: number): string {
  return getRankInfo(elo).name;
}

// Получение иконки ранга по ELO
export function getRankIcon(elo: number): string {
  return getRankInfo(elo).icon;
}

// Получение цвета ранга по ELO
export function getRankColor(elo: number): string {
  return getRankInfo(elo).color;
}

// Расчет прогресса до следующего ранга
export function getRankProgress(elo: number): number {
  return getRankInfo(elo).progress;
}

// Расчет количества ELO до следующего ранга
export function getEloToNextRank(elo: number): number {
  return getRankInfo(elo).eloToNext;
}

// Проверка, является ли ранг максимальным
export function isMaxRank(elo: number): boolean {
  const rankInfo = getRankInfo(elo);
  return !rankInfo.nextRank;
}

// Расчет уровня игрока на основе ELO
export function calculateLevel(elo: number): number {
  return Math.floor((elo - 800) / 20) + 1;
}

// Расчет опыта до следующего уровня
export function getXpToNextLevel(elo: number): number {
  const level = calculateLevel(elo);
  const xpForCurrentLevel = 800 + (level - 1) * 20;
  const xpForNextLevel = xpForCurrentLevel + 20;
  return xpForNextLevel - elo;
}

// Расчет нового ELO после игры
export function calculateNewElo(
  playerElo: number,
  opponentElo: number,
  result: 'win' | 'loss' | 'draw',
  kFactor: number = 32
): number {
  // Ожидаемый результат
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  
  // Фактический результат
  let actualScore: number;
  switch (result) {
    case 'win':
      actualScore = 1;
      break;
    case 'loss':
      actualScore = 0;
      break;
    case 'draw':
      actualScore = 0.5;
      break;
    default:
      actualScore = 0.5;
  }
  
  // Расчет нового ELO
  const newElo = Math.round(playerElo + kFactor * (actualScore - expectedScore));
  
  // Ограничение диапазона
  return Math.max(800, Math.min(2000, newElo));
}

// Расчет K-фактора в зависимости от количества игр
export function getKFactor(gamesPlayed: number): number {
  if (gamesPlayed < 10) return 40; // Новые игроки
  if (gamesPlayed < 30) return 32; // Опытные игроки
  return 24; // Ветераны
}

// Расчет изменения ELO для обоих игроков
export function calculateEloChange(
  player1Elo: number,
  player2Elo: number,
  winner: 'player1' | 'player2' | 'draw',
  gamesPlayed1: number,
  gamesPlayed2: number
): { player1Change: number; player2Change: number } {
  const k1 = getKFactor(gamesPlayed1);
  const k2 = getKFactor(gamesPlayed2);
  
  let result1: 'win' | 'loss' | 'draw';
  let result2: 'win' | 'loss' | 'draw';
  
  switch (winner) {
    case 'player1':
      result1 = 'win';
      result2 = 'loss';
      break;
    case 'player2':
      result1 = 'loss';
      result2 = 'win';
      break;
    case 'draw':
      result1 = 'draw';
      result2 = 'draw';
      break;
  }
  
  const newElo1 = calculateNewElo(player1Elo, player2Elo, result1, k1);
  const newElo2 = calculateNewElo(player2Elo, player1Elo, result2, k2);
  
  return {
    player1Change: newElo1 - player1Elo,
    player2Change: newElo2 - player2Elo
  };
}

// Форматирование изменения ELO
export function formatEloChange(change: number): string {
  if (change > 0) {
    return `+${change}`;
  } else if (change < 0) {
    return change.toString();
  }
  return '±0';
}

// Получение цвета для изменения ELO
export function getEloChangeColor(change: number): string {
  if (change > 0) return 'text-green-400';
  if (change < 0) return 'text-red-400';
  return 'text-gray-400';
}

// Расчет позиции в глобальном рейтинге (оценочно)
export function estimateGlobalRanking(elo: number, totalPlayers: number = 10000): number {
  // Предполагаем нормальное распределение ELO
  const mean = 1200;
  const stdDev = 200;
  
  // Z-оценка
  const zScore = (elo - mean) / stdDev;
  
  // Процент игроков с меньшим ELO (используем CDF нормального распределения)
  const percentile = 0.5 * (1 + erf(zScore / Math.sqrt(2)));
  
  // Позиция в рейтинге
  const rank = Math.max(1, Math.round((1 - percentile) * totalPlayers));
  
  return rank;
}

// Вспомогательная функция для ошибки (используется в нормальном распределении)
function erf(x: number): number {
  // Аппроксимация функции ошибок
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return sign * y;
}

// Расчет необходимого количества побед для следующего ранга
export function estimateWinsToNextRank(
  currentElo: number,
  targetElo: number,
  averageOpponentElo: number = currentElo
): number {
  const eloNeeded = targetElo - currentElo;
  const averageEloChange = 16; // Среднее изменение за победу против равного соперника
  return Math.ceil(eloNeeded / averageEloChange);
}

// Получение достижений связанных с рангами
export function getRankAchievements(elo: number): string[] {
  const achievements: string[] = [];
  const rankInfo = getRankInfo(elo);
  
  // Проверка достижений по рангам
  if (rankInfo.id === 'apprentice') {
    achievements.push('first_rank_up');
  }
  
  if (rankInfo.id === 'specialist') {
    achievements.push('skilled_player');
  }
  
  if (rankInfo.id === 'expert') {
    achievements.push('expert_rank');
  }
  
  if (rankInfo.id === 'master') {
    achievements.push('master_rank');
  }
  
  if (rankInfo.id === 'grandmaster') {
    achievements.push('grandmaster_rank');
  }
  
  // Проверка достижений по ELO
  if (elo >= 1500) {
    achievements.push('elo_1500');
  }
  
  if (elo >= 1700) {
    achievements.push('elo_1700');
  }
  
  if (elo >= 1900) {
    achievements.push('elo_1900');
  }
  
  return achievements;
}

// Генерация рангового бейджа
export function generateRankBadge(elo: number, size: 'sm' | 'md' | 'lg' = 'md') {
  const rankInfo = getRankInfo(elo);
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-2xl'
  };
  
  return {
    elo,
    rankName: rankInfo.name,
    rankIcon: rankInfo.icon,
    backgroundColor: rankInfo.bgColor,
    textColor: rankInfo.textColor,
    sizeClass: sizeClasses[size],
    progress: rankInfo.progress
  };
}

// Сравнение рангов двух игроков
export function compareRanks(player1Elo: number, player2Elo: number): {
  difference: number;
  advantage: 'player1' | 'player2' | 'equal';
  expectedWinRate: number;
} {
  const difference = player1Elo - player2Elo;
  const advantage = difference > 0 ? 'player1' : difference < 0 ? 'player2' : 'equal';
  
  // Расчет ожидаемой вероятности победы
  const expectedWinRate = 1 / (1 + Math.pow(10, -difference / 400));
  
  return {
    difference: Math.abs(difference),
    advantage,
    expectedWinRate
  };
}

// Получение рангов для отображения в селекторе
export function getRankOptions(): Array<{
  value: string;
  label: string;
  icon: string;
  description: string;
  minElo: number;
  maxElo: number;
}> {
  return RANKS.map(rank => ({
    value: rank.id,
    label: rank.name,
    icon: rank.icon,
    description: rank.description,
    minElo: rank.minElo,
    maxElo: rank.maxElo
  }));
}

// Проверка возможности участия в турнире по рангу
export function canJoinTournament(
  playerElo: number,
  tournamentMinElo: number,
  tournamentMaxElo: number
): boolean {
  return playerElo >= tournamentMinElo && playerElo <= tournamentMaxElo;
}

// Расчет призовых очков за турнир на основе ранга
export function calculateTournamentPoints(
  placement: number,
  playerElo: number,
  tournamentDifficulty: number = 1
): number {
  const basePoints = 1000 / placement; // Базовые очки за место
  
  // Модификатор ранга (игроки с высоким ELO получают меньше очков)
  const rankModifier = 1 - (playerElo - 1200) / 2000;
  
  // Модификатор сложности турнира
  const difficultyModifier = 1 + (tournamentDifficulty - 1) * 0.2;
  
  const totalPoints = Math.round(basePoints * rankModifier * difficultyModifier);
  
  return Math.max(10, totalPoints);
}

// Экспорт ранговой системы
export const rankSystem = {
  getRankInfo,
  getRankName,
  getRankIcon,
  getRankColor,
  getRankProgress,
  getEloToNextRank,
  isMaxRank,
  calculateLevel,
  getXpToNextLevel,
  calculateNewElo,
  calculateEloChange,
  formatEloChange,
  getEloChangeColor,
  estimateGlobalRanking,
  estimateWinsToNextRank,
  getRankAchievements,
  generateRankBadge,
  compareRanks,
  getRankOptions,
  canJoinTournament,
  calculateTournamentPoints
};

export default rankSystem;