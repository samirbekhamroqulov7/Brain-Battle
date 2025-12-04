import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/layout/Header';
import GameCard from '@/components/ui/cards/GameCard';
import LoadingSpinner from '@/components/ui/indicators/LoadingSpinner';
import { GAMES_CONFIG } from '@/lib/games/config';

export default function ClassicGamesPage() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Категории для фильтра
  const categories = [
    { id: 'all', name: 'Все игры', icon: '🎮' },
    { id: 'puzzle', name: 'Головоломки', icon: '🧩' },
    { id: 'strategy', name: 'Стратегии', icon: '♟️' },
    { id: 'math', name: 'Математика', icon: '🧮' },
    { id: 'words', name: 'Слова', icon: '📝' },
    { id: 'logic', name: 'Логика', icon: '🔍' }
  ];

  // Фильтрация игр
  const filteredGames = GAMES_CONFIG.filter(game => {
    // Поиск по названию
    if (searchQuery && !game.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Фильтр по категории
    if (categoryFilter !== 'all' && game.category !== categoryFilter) {
      return false;
    }
    
    // Фильтр по сложности
    if (difficultyFilter && game.difficulty !== difficultyFilter) {
      return false;
    }
    
    return true;
  });

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    setIsLoading(true);
    
    // Навигация с задержкой для анимации
    setTimeout(() => {
      router.push(`/game/${gameId}`);
    }, 400);
  };

  const handleBack = () => {
    router.back();
  };

  // Сброс фильтров
  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setDifficultyFilter(null);
  };

  return (
    <>
      <Head>
        <title>Brain Battle | Классические игры</title>
        <meta name="description" content="Выберите из 20 логических игр" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        
        {/* Анимированный фон */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Загрузка */}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <LoadingSpinner size="xl" />
            <p className="mt-6 text-white text-lg font-medium animate-pulse">
              Загружаем игру...
            </p>
          </div>
        )}

        <div className="relative z-10">
          <Header 
            showBack={true} 
            onBack={handleBack}
            title="Классические игры"
          />

          <main className="container mx-auto px-4 py-6 md:py-8">
            
            {/* Заголовок и статистика */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                20 игр для развития мозга
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Тренируйте логику, память и стратегическое мышление. 
                Каждая игра разработана для развития разных когнитивных навыков.
              </p>
              
              {/* Быстрая статистика */}
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">20</div>
                  <div className="text-sm text-gray-400">игр</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">5</div>
                  <div className="text-sm text-gray-400">категорий</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">∞</div>
                  <div className="text-sm text-gray-400">комбинаций</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-gray-400">бесплатно</div>
                </div>
              </div>
            </div>

            {/* Панель фильтров */}
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-lg border border-white/10">
              
              {/* Поиск */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск игр по названию..."
                    className="w-full p-4 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Категории */}
                <div>
                  <h3 className="text-white mb-3 font-medium">Категории:</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setCategoryFilter(cat.id)}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-full transition-all
                          ${categoryFilter === cat.id 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                          }
                        `}
                      >
                        <span>{cat.icon}</span>
                        <span className="text-sm">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Сложность */}
                <div>
                  <h3 className="text-white mb-3 font-medium">Сложность:</h3>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map(level => (
                      <button
                        key={level}
                        onClick={() => setDifficultyFilter(difficultyFilter === level ? null : level)}
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center transition-all
                          ${difficultyFilter === level 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-110' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                          }
                        `}
                      >
                        {'★'.repeat(level)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Управление видом */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      ▦
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      ☰
                    </button>
                  </div>
                  
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 text-white text-sm hover:from-gray-600 hover:to-gray-500 transition-all"
                  >
                    Сбросить
                  </button>
                </div>
              </div>
              
              {/* Информация о фильтрах */}
              {(searchQuery || categoryFilter !== 'all' || difficultyFilter) && (
                <div className="mt-4 text-sm text-gray-400">
                  Найдено игр: {filteredGames.length}
                  {(searchQuery || categoryFilter !== 'all' || difficultyFilter) && (
                    <button
                      onClick={resetFilters}
                      className="ml-2 text-purple-400 hover:text-purple-300"
                    >
                      (сбросить фильтры)
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Список игр */}
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'flex flex-col'
              } 
              gap-6 mb-12
            `}>
              {filteredGames.length > 0 ? (
                filteredGames.map((game, index) => (
                  <div
                    key={game.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-fade-in"
                  >
                    <GameCard
                      game={game}
                      onClick={() => handleGameSelect(game.id)}
                      isSelected={selectedGame === game.id}
                      compact={viewMode === 'grid'}
                      showDetails={viewMode === 'list'}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="text-6xl mb-4 opacity-20">🎮</div>
                  <h3 className="text-xl text-white mb-2">Игры не найдены</h3>
                  <p className="text-gray-400 mb-6">Попробуйте изменить параметры поиска</p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                  >
                    Показать все игры
                  </button>
                </div>
              )}
            </div>

            {/* Информационный блок */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💡</div>
                <div>
                  <h3 className="text-white text-xl font-bold mb-2">Совет по тренировке</h3>
                  <p className="text-gray-300">
                    Чередуйте игры разных категорий для равномерного развития когнитивных навыков. 
                    Начните с головоломок для разминки, затем перейдите к стратегическим играм, 
                    и завершите математическими задачами.
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Рекомендуем играть 20-30 минут в день</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>Старайтесь бить свои рекорды</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </>
  );
}