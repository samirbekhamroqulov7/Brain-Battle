import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Основные оптимизации для мобильных
    const setupMobileOptimizations = () => {
      // Предотвращаем масштабирование на мобильных
      const disableZoom = (e: TouchEvent) => {
        if (e.touches.length > 1) e.preventDefault()
      }
      
      // Улучшаем touch-обработку
      const improveTouchHandling = () => {
        document.documentElement.style.touchAction = 'manipulation'
        document.documentElement.style.webkitTapHighlightColor = 'transparent'
      }
      
      // Оптимизация производительности
      const optimizePerformance = () => {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual'
        }
      }
      
      // Добавляем обработчики
      document.addEventListener('touchstart', disableZoom, { passive: false })
      improveTouchHandling()
      optimizePerformance()
      
      return () => {
        document.removeEventListener('touchstart', disableZoom)
      }
    }
    
    setupMobileOptimizations()
  }, [])

  return (
    <>
      <Head>
        {/* Критически важные мета-теги для мобильных */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" 
        />
        <meta name="theme-color" content="#0f172a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Базовый SEO */}
        <title>Brain Battle - 38 логических игр</title>
        <meta name="description" content="Играйте в 38 логических игр: шахматы, шашки, судоку и многое другое!" />
        
        {/* Иконки */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Предзагрузка шрифтов */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      
      <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
        <Component {...pageProps} />
      </div>
    </>
  )
}