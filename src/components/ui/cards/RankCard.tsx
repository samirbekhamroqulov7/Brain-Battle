import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getRankInfo, formatEloChange } from '@/lib/utils/rank-utils';

interface RankCardProps {
  elo: number;
  showDetails?: boolean;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  onClick?: () => void;
  eloChange?: number;
  className?: string;
}

const RankCard: React.FC<RankCardProps> = ({
  elo,
  showDetails = true,
  showProgress = true,
  size = 'md',
  animated = false,
  onClick,
  eloChange = 0,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const rankInfo = getRankInfo(elo);
  
  // Размеры карточки
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const textSizes = {
    sm: {
      rank: 'text-lg',
      elo: 'text-sm',
      name: 'text-xs'
    },
    md: {
      rank: 'text-2xl',
      elo: 'text-base',
      name: 'text-sm'
    },
    lg: {
      rank: 'text-3xl',
      elo: 'text-lg',
      name: 'text-base'
    }
  };
  
  // Анимация изменения ELO
  const [displayedElo, setDisplayedElo] = useState(elo);
  const [displayedChange, setDisplayedChange] = useState(eloChange);
  
  // Анимируем изменение ELO
  React.useEffect(() => {
    if (eloChange !== 0) {
      const duration = 1000;
      const steps = 30;
      const stepSize = eloChange / steps;
      const changeStepSize = eloChange / steps;
      
      let currentStep = 0;
      const startElo = displayedElo - eloChange;
      const startChange = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        
        if (currentStep <= steps) {
          setDisplayedElo(Math.round(startElo + stepSize * currentStep));
          setDisplayedChange(Math.round(startChange + changeStepSize * currentStep));
        } else {
          setDisplayedElo(elo);
          setDisplayedChange(eloChange);
          clearInterval(interval);
        }
      }, duration / steps);
      
      return () => clearInterval(interval);
    }
  }, [elo, eloChange]);
  
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { scale: 1.02 } : {}}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Анимированный фон для высоких рангов */}
      {animated && rankInfo.id === 'grandmaster' && (
        <motion.div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: '200% 200%'
          }}
        />
      )}
      
      {/* Основная карточка */}
      <div className={`
        relative
        ${sizeClasses[size]}
        rounded-2xl
        ${rankInfo.bgColor}
        border-2 ${rankInfo.borderColor}
        backdrop-blur-sm
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-300
        ${isHovered && onClick ? 'shadow-2xl' : 'shadow-lg'}
        overflow-hidden
      `}>
        
        {/* Внутренний градиент */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        
        {/* Контент */}
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            
            {/* Левая часть: Иконка и название ранга */}
            <div className="flex items-center gap-3">
              <div className={`
                ${size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16'}
                rounded-full
                bg-white/10
                backdrop-blur-sm
                flex items-center justify-center
                border-2 border-white/20
                ${isHovered && onClick ? 'scale-110' : ''}
                transition-transform duration-300
              `}>
                <span className={`${textSizes[size].rank} text-white`}>
                  {rankInfo.icon}
                </span>
              </div>
              
              <div>
                <h3 className={`${textSizes[size].name} font-bold text-white`}>
                  {rankInfo.name}
                </h3>
                <div className={`${textSizes[size].elo} ${rankInfo.textColor} font-bold`}>
                  {displayedElo} ELO
                </div>
              </div>
            </div>
            
            {/* Правая часть: Изменение ELO */}
            {eloChange !== 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`${getChangeColor(displayedChange)} font-bold ${textSizes[size].elo}`}
              >
                {formatEloChange(displayedChange)}
              </motion.div>
            )}
          </div>
          
          {/* Детали (если показаны) */}
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-4 pt-4 border-t border-white/20"
            >
              <div className="text-white/80 text-xs mb-2">
                {rankInfo.description}
              </div>
              
              {/* Прогресс до следующего ранга */}
              {showProgress && rankInfo.nextRank && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">До {rankInfo.nextRank.name}:</span>
                    <span className="text-white">{rankInfo.eloToNext} ELO</span>
                  </div>
                  
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${rankInfo.progress}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Уровень:</span>
                    <span className="text-white">
                      {Math.floor((elo - 800) / 20) + 1}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Если это максимальный ранг */}
              {showProgress && !rankInfo.nextRank && (
                <div className="text-center py-2">
                  <div className="text-yellow-300 text-sm font-bold">
                    🏆 Максимальный ранг!
                  </div>
                  <div className="text-white/60 text-xs mt-1">
                    Вы достигли вершины рейтинга
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Декоративные элементы */}
        {animated && (
          <>
            {/* Блестки для высоких рангов */}
            {['master', 'grandmaster'].includes(rankInfo.id) && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    initial={{
                      x: Math.random() * 100 + '%',
                      y: -10,
                      opacity: 0
                    }}
                    animate={{
                      y: ['0%', '100%'],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      delay: i * 0.5,
                      repeat: Infinity
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Свечение при наведении */}
            {isHovered && onClick && (
              <motion.div
                className="absolute -inset-1 rounded-2xl blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                style={{
                  background: rankInfo.bgColor.replace('bg-gradient-to-br', '')
                }}
              />
            )}
          </>
        )}
      </div>
      
      {/* Тулкит с дополнительной информацией при наведении */}
      {isHovered && showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl bg-gray-900/95 backdrop-blur-lg border border-white/10 shadow-2xl z-50"
        >
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-white font-bold">{rankInfo.name}</div>
              <div className="text-gray-400 text-sm">{rankInfo.description}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 rounded-lg bg-white/5">
                <div className="text-gray-400">Диапазон ELO</div>
                <div className="text-white font-bold">
                  {rankInfo.minElo} - {rankInfo.maxElo === Infinity ? '∞' : rankInfo.maxElo}
                </div>
              </div>
              
              <div className="text-center p-2 rounded-lg bg-white/5">
                <div className="text-gray-400">Процент игроков</div>
                <div className="text-white font-bold">
                  {estimatePlayerPercentage(elo)}%
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 text-center">
              {/* Достижения связанные с рангом */}
              {getRankAchievementsText(rankInfo.id)}
            </div>
            
            {rankInfo.nextRank && (
              <div className="pt-3 border-t border-white/10">
                <div className="text-center text-sm">
                  <div className="text-gray-400 mb-1">Следующий ранг:</div>
                  <div className="text-white font-bold">{rankInfo.nextRank.name}</div>
                  <div className="text-gray-300 text-xs">
                    Нужно еще {rankInfo.eloToNext} ELO
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Вспомогательная функция для оценки процента игроков
function estimatePlayerPercentage(elo: number): number {
  if (elo < 1000) return Math.round((elo - 800) / 2); // 0-100%
  if (elo < 1200) return Math.round(10 + (elo - 1000) / 2); // 10-20%
  if (elo < 1400) return Math.round(20 + (elo - 1200) / 2); // 20-30%
  if (elo < 1600) return Math.round(30 + (elo - 1400) / 2); // 30-40%
  if (elo < 1800) return Math.round(40 + (elo - 1600) / 2); // 40-50%
  return Math.round(50 + (elo - 1800) / 4); // 50-100%
}

// Вспомогательная функция для текста достижений
function getRankAchievementsText(rankId: string): string {
  const achievements: Record<string, string> = {
    novice: 'Начинающий игрок',
    apprentice: 'Освоил основы',
    specialist: 'Понимает стратегии',
    expert: 'Мастер тактики',
    master: 'Виртуоз логики',
    grandmaster: 'Легенда игры'
  };
  
  return achievements[rankId] || 'Ранг игрока';
}

export default RankCard;