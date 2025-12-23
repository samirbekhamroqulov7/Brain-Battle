# Brain Battle - Deployment Fixes

## Исправленные проблемы

### 1. Проблемы серверного рендеринга (SSR)
- **Проблема**: Хуки пытались использовать `localStorage` при серверном рендеринге
- **Исправление**: Добавлены проверки `typeof window !== "undefined"` и флаг `isClient` во всех хуках:
  - `lib/hooks/use-music.ts`
  - `lib/hooks/use-sound.ts`
  - `lib/i18n/context.tsx`

### 2. Аудио файлы
- **Проблема**: Отсутствующие аудио файлы вызывали ошибки 404
- **Исправление**: 
  - Созданы route handlers для `/sounds/[file]` и `/music/[file]`
  - Музыка теперь запускается только после взаимодействия пользователя (требование браузеров)
  - Добавлена обработка ошибок autoplay

### 3. Изображения аватаров
- **Проблема**: Локальные изображения не загружались
- **Исправление**: Заменены на API dicebear.com, которые генерируют аватары динамически

### 4. Метаданные и SEO
- **Проблема**: Некорректные Open Graph изображения
- **Исправление**: Упрощены метаданные, убраны ссылки на несуществующие изображения

### 5. OAuth и регистрация
- **Проблема**: Редирект на localhost:3000
- **Исправление**: 
  - Используется `NEXT_PUBLIC_SITE_URL` из environment variables
  - Убрано подтверждение email через `emailConfirmRequired: false` в конфиге Supabase

## Переменные окружения

Убедитесь, что в Vercel настроены следующие переменные:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://jxwlbmkcipwwbmpraryq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_bGdl1gbLYJoaxlP8SHej5A_2eC_BmU6
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=https://brain-battle-az-dil.vercel.app
\`\`\`

## Настройки Supabase

### 1. Отключение подтверждения email

В Supabase Dashboard:
1. Зайдите в `Authentication` → `Settings`
2. Найдите "Email Confirmations"
3. Отключите "Enable email confirmations"

### 2. Настройка Google OAuth

1. В `Authentication` → `Providers` → `Google`
2. Добавьте Redirect URLs:
   - `https://brain-battle-az-dil.vercel.app/auth/callback`
   - `https://jxwlbmkcipwwbmpraryq.supabase.co/auth/v1/callback`

### 3. Обновление базы данных

Выполните SQL скрипт для добавления новых полей:

\`\`\`sql
-- Добавление полей для кастомизации профиля
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar_frame TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS nickname_style TEXT DEFAULT 'normal';
\`\`\`

## Проверка перед деплоем

1. ✅ Все переменные окружения настроены
2. ✅ Supabase auth settings обновлены
3. ✅ OAuth redirect URLs добавлены
4. ✅ База данных обновлена
5. ✅ Домен настроен в Vercel

## Как протестировать

1. Откройте сайт в браузере
2. Проверьте регистрацию через email (должна работать без подтверждения)
3. Проверьте вход через Google (должен редиректить на ваш домен)
4. Проверьте гостевой вход (должен создать локальный профиль)
5. Попробуйте отредактировать профиль
6. Проверьте форму помощи

## Известные ограничения

- Аудио файлы пока пустые (заглушки). Для добавления реальной музыки замените route handlers на статические файлы
- Premium аватары и рамки пока доступны всем (нужна интеграция платежей)

## Дополнительные улучшения (опционально)

1. Добавьте реальные аудио файлы в `public/sounds/` и `public/music/`
2. Настройте Stripe для премиум функций
3. Добавьте Google Analytics
4. Настройте CDN для статических файлов
