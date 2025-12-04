import React from 'react';
import RankBadge from '@/components/ui/indicators/RankBadge';
import IconButton from '@/components/ui/buttons/IconButton';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  showBack = false, 
  onBack, 
  title 
}) => {
  // Данные игрока (заглушка - потом из стейта)
  const playerData = {
    name: 'BrainMaster',
    rank: 1250,
    level: 12,
    gamesPlayed: 47
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg bg-white/5 border-b border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Левая часть: кнопка назад или лого */}
          <div className="flex items-center space-x-4">
            {showBack && onBack ? (
              <IconButton
                icon="←"
                onClick={onBack}
                label="Назад"
                variant="ghost"
                size="md"
                rounded="full"
                className="text-white hover:bg-white/10"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">BB</span>
                </div>
                {title && (
                  <h1 className="text-lg font-semibold text-white hidden md:block">
                    {title}
                  </h1>
                )}
              </div>
            )}
          </div>

          {/* Центр: заголовок если есть */}
          {title && !showBack && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-lg font-semibold text-white">{title}</h1>
            </div>
          )}

          {/* Правая часть: профиль */}
          <div className="flex items-center space-x-3">
            
            {/* Статистика (скрыта на мобилках) */}
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className="text-right">
                <div className="text-white font-medium">{playerData.name}</div>
                <div className="text-gray-400">Уровень {playerData.level}</div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-2">
                  <RankBadge rank={playerData.rank} showLabel={true} />
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  {playerData.gamesPlayed} игр
                </div>
              </div>
            </div>
            
            {/* Аватар */}
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 
                           flex items-center justify-center text-white font-bold shadow-lg
                           border-2 border-white/20 group-hover:border-cyan-300 transition-all">
                {playerData.name.charAt(0)}
                
                {/* Индикатор уровня */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full 
                             bg-gradient-to-r from-yellow-500 to-orange-500 
                             flex items-center justify-center text-xs font-bold
                             border-2 border-gray-900">
                  {playerData.level}
                </div>
              </div>
              
              {/* Тулкит при наведении */}
              <div className="absolute right-0 top-full mt-2 w-48 py-2 px-3 
                           bg-gray-900/95 backdrop-blur-lg rounded-lg shadow-xl 
                           border border-white/10 invisible group-hover:visible 
                           transition-all opacity-0 group-hover:opacity-100 z-50">
                <div className="text-white text-sm font-medium">{playerData.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-400 text-xs">Ранг:</span>
                  <span className="text-amber-400 text-xs font-bold">
                    {getRankTitle(playerData.rank)}
                  </span>
                </div>
                <div className="h-px bg-white/10 my-2"></div>
                <button className="w-full text-left text-xs text-gray-300 hover:text-white py-1">
                  📊 Статистика
                </button>
                <button className="w-full text-left text-xs text-gray-300 hover:text-white py-1">
                  ⚙️ Настройки
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

// Вспомогательная функция
function getRankTitle(rank: number): string {
  if (rank < 1000) return "Новичок";
  if (rank < 1200) return "Ученик";
  if (rank < 1400) return "Знаток";
  if (rank < 1600) return "Эксперт";
  if (rank < 1800) return "Мастер";
  return "Гроссмейстер";
}

export default Header;