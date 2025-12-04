import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@/components/layout/Header';
import MenuButton from '@/components/ui/buttons/MenuButton';
import LoadingSpinner from '@/components/ui/indicators/LoadingSpinner';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleNavigation = (path: string, buttonId: string) => {
    setActiveButton(buttonId);
    setLoading(true);
    
    // Имитация загрузки для плавности
    setTimeout(() => {
      router.push(path);
      setLoading(false);
      setActiveButton(null);
    }, 300);
  };

  return (
    <>
      <Head>
        <title>Brain Battle | Тренировка ума</title>
        <meta name="description" content="20 логических игр для развития мозга" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      {/* Главный контейнер с CSS-градиентом */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        
        {/* Анимированный фон (чистый CSS) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        {/* Загрузка */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Контент */}
        <div className="relative z-10 container mx-auto px-4 py-6 md:py-8">
          <Header />
          
          <main className="flex flex-col items-center justify-center min-h-[75vh] px-4">
            
            {/* Логотип через CSS */}
            <div className="mb-10 md:mb-16 text-center">
              <div className="inline-block relative">
                <div className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  BRAIN BATTLE
                </div>
                <div className="text-sm md:text-base text-gray-300 mt-3 font-light tracking-wider">
                  20 ИГР ДЛЯ РАЗВИТИЯ МОЗГА
                </div>
                
                {/* Подчеркивание-анимация */}
                <div className="mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
              </div>
            </div>

            {/* Меню кнопок */}
            <div className="w-full max-w-md space-y-5 md:space-y-6">
              
              <MenuButton
                id="classic"
                title="КЛАССИЧЕСКИЙ"
                subtitle="20 логических игр"
                description="Тренируйтесь в одиночку"
                icon="🧠"
                onClick={() => handleNavigation('/classic', 'classic')}
                isActive={activeButton === 'classic'}
                gradient="from-blue-600 to-cyan-500"
                hoverGradient="from-blue-700 to-cyan-600"
                iconColor="text-cyan-300"
                pulse={true}
              />
              
              <MenuButton
                id="pvp"
                title="ПВП"
                subtitle="Соревнуйтесь с игроками"
                description="Рейтинговые матчи"
                icon="⚔️"
                onClick={() => handleNavigation('/pvp', 'pvp')}
                isActive={activeButton === 'pvp'}
                gradient="from-green-600 to-emerald-500"
                hoverGradient="from-green-700 to-emerald-600"
                iconColor="text-emerald-300"
                badge={<span className="bg-red-500 text-white px-2 py-1 rounded text-xs">НОВОЕ</span>}
              />
              
              <MenuButton
                id="settings"
                title="НАСТРОЙКИ"
                subtitle="Звук, профиль, статистика"
                description="Настройте игру под себя"
                icon="⚙️"
                onClick={() => {
                  // Открыть модалку настроек
                  console.log('Settings clicked');
                }}
                isActive={activeButton === 'settings'}
                gradient="from-gray-700 to-gray-600"
                hoverGradient="from-gray-800 to-gray-700"
                iconColor="text-gray-300"
              />
              
            </div>

            {/* Статистика */}
            <div className="mt-12 md:mt-16 text-center">
              <div className="inline-flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Онлайн: 1,234</span>
                </div>
                <div className="hidden md:block">•</div>
                <div className="hidden md:block">
                  <span>Игр сыграно: 45,678</span>
                </div>
              </div>
            </div>
            
          </main>
          
          {/* Футер */}
          <footer className="mt-8 md:mt-12 text-center text-gray-500 text-sm">
            <div className="border-t border-white/10 pt-4">
              <p>Играйте бесплатно • Без регистрации • На любом устройстве</p>
              <p className="mt-2 text-xs">v1.0.0 • Поддерживается Chrome, Safari, Firefox</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}