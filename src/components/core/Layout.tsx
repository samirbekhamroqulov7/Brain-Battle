import React, { ReactNode, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useStore } from '@/lib/state/store';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showNavigation?: boolean;
  fullScreen?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showNavigation = false,
  fullScreen = false,
  title,
  description,
  className = ''
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { settings } = useStore();
  
  // Обработка загрузки страниц
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);
    
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Применение темы
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Авто тема
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // Применение размера шрифта
  useEffect(() => {
    const fontSizeMap = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg'
    };
    
    document.documentElement.className = fontSizeMap[settings.accessibility.fontSize] || 'text-base';
  }, [settings.accessibility.fontSize]);

  // Получение градиента для текущей страницы
  const getPageGradient = () => {
    const path = router.pathname;
    
    if (path === '/') return 'from-gray-900 via-purple-900/20 to-violet-900';
    if (path === '/classic') return 'from-gray-900 via-blue-900/20 to-cyan-900';
    if (path === '/pvp') return 'from-gray-900 via-red-900/20 to-pink-900';
    if (path.startsWith('/game/')) return 'from-gray-900 via-purple-900/10 to-gray-900';
    if (path.startsWith('/pvp/match')) return 'from-gray-900 via-orange-900/20 to-yellow-900';
    
    return 'from-gray-900 via-gray-800 to-gray-900';
  };

  if (fullScreen) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getPageGradient()} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getPageGradient()} ${className}`}>
      
      {/* Анимированный фон */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Индикатор загрузки */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-shimmer"></div>
        </div>
      )}

      {/* Основной контент */}
      <div className="relative z-10">
        {showHeader && (
          <Header
            showBack={router.pathname !== '/'}
            onBack={() => router.back()}
            title={title}
          />
        )}
        
        <div className="flex">
          {/* Боковая панель */}
          {showNavigation && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: showSidebar ? 0 : -300 }}
              className="fixed left-0 top-0 h-full w-64 z-40 bg-gray-900/95 backdrop-blur-lg border-r border-white/10 shadow-2xl"
            >
              <Navigation onClose={() => setShowSidebar(false)} />
            </motion.aside>
          )}
          
          {/* Кнопка меню для мобильных */}
          {showNavigation && !showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="fixed left-4 top-20 z-30 p-2 rounded-lg bg-gray-900/80 backdrop-blur-lg border border-white/10 text-white lg:hidden"
            >
              ☰
            </button>
          )}
          
          {/* Оверлей для мобильной навигации */}
          {showNavigation && showSidebar && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}
          
          {/* Основной контент */}
          <main className={`flex-1 ${showNavigation ? 'lg:ml-64' : ''} transition-all duration-300`}>
            <div className="container mx-auto px-4 py-6">
              {description && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 text-center"
                >
                  <p className="text-gray-400 max-w-2xl mx-auto">{description}</p>
                </motion.div>
              )}
              
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Футер */}
      <footer className="relative z-10 border-t border-white/10 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="text-white font-bold text-lg">Brain Battle</div>
              <div className="text-gray-400 text-sm">20 логических игр для развития ума</div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <button
                onClick={() => router.push('/classic')}
                className="hover:text-white transition-colors"
              >
                Игры
              </button>
              <button
                onClick={() => router.push('/pvp')}
                className="hover:text-white transition-colors"
              >
                ПВП
              </button>
              <button
                onClick={() => console.log('Открыть настройки')}
                className="hover:text-white transition-colors"
              >
                Настройки
              </button>
            </div>
            
            <div className="text-gray-500 text-xs text-center">
              <div>© {new Date().getFullYear()} Brain Battle</div>
              <div className="mt-1">Все игры бесплатны • Не требует регистрации</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;