# Система Авторизации BrainBattle

## Обзор

Новая система авторизации полностью независима от Supabase и использует:
- **PostgreSQL** для хранения данных пользователей
- **HTTP-only cookies** для сессий
- **SHA-256 хеширование** для паролей
- **6-значные коды** для сброса пароля

## Структура Базы Данных

### Таблицы

1. **users** - Основная таблица пользователей
   - `id` - UUID первичный ключ
   - `auth_id` - Уникальный идентификатор (TEXT)
   - `email` - Email (уникальный)
   - `username` - Имя пользователя
   - `password_hash` - Хеш пароля (SHA-256)
   - `isGuest` - Флаг гостевого аккаунта

2. **password_reset_tokens** - Токены сброса пароля
   - `token` - 6-значный код
   - `expires_at` - Время истечения (1 час)
   - `used` - Флаг использования

3. **mastery** - Прогресс мастерства
4. **glory** - Прогресс славы
5. **user_purchases** - Покупки
6. **user_game_stats** - Статистика игр
7. **matches** - PvP матчи

## API Endpoints

### Регистрация
```
POST /api/auth/register
Body: { email, password, username }
Response: { success: true, user: {...} }
```

### Вход
```
POST /api/auth/login
Body: { email, password }
Response: { success: true, user: {...} }
```

### Выход
```
POST /api/auth/logout
Response: { success: true }
```

### Гостевой аккаунт
```
POST /api/auth/guest
Response: { success: true, user: {...} }
```

### Получить текущего пользователя
```
GET /api/auth/me
Response: { user: {...}, mastery: {...}, glory: {...} }
```

### Запрос сброса пароля
```
POST /api/auth/reset-password/request
Body: { email }
Response: { success: true, message: "...", code: "123456" (dev only) }
```

### Подтверждение сброса пароля
```
POST /api/auth/reset-password/verify
Body: { code, email, newPassword }
Response: { success: true, message: "..." }
```

### Обновление профиля
```
POST /api/auth/update-profile
Body: { username?, avatar_url?, avatar_frame?, ... }
Response: { success: true }
```

## Установка

### 1. Настройка переменных окружения

```env
DATABASE_URL=postgresql://user:password@host:5432/database
AUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Создание таблиц

Выполните SQL скрипты в порядке:

```bash
# 1. Удаление старых таблиц
psql $DATABASE_URL < scripts/01-drop-all-tables.sql

# 2. Создание таблиц
psql $DATABASE_URL < scripts/02-create-tables.sql

# 3. Создание функций
psql $DATABASE_URL < scripts/03-create-functions.sql
```

### 3. Установка зависимостей

```bash
npm install
# или
yarn install
```

### 4. Запуск

```bash
npm run dev
```

## Использование

### Клиентская сторона

```tsx
import { useUser } from "@/lib/hooks/use-user"

function MyComponent() {
  const { user, profile, loading, signOut } = useUser()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>

  return (
    <div>
      <p>Welcome {profile?.username}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Серверная сторона

```ts
import { getSession } from "@/lib/auth/session"
import { getUserById } from "@/lib/database/users"

export async function GET() {
  const session = await getSession()
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  const user = await getUserById(session.userId)
  return Response.json({ user })
}
```

## Функции

### Валидация

```ts
import { validateEmail, validatePassword, validateUsername } from "@/lib/auth/validation"

const emailValid = validateEmail("test@example.com")
const passwordValid = validatePassword("password123")
const usernameValid = validateUsername("user123")
```

### Хеширование паролей

```ts
import { hashPassword, verifyPassword } from "@/lib/auth/password"

const hash = await hashPassword("mypassword")
const isValid = await verifyPassword("mypassword", hash)
```

### Сессии

```ts
import { createSession, getSession, deleteSession } from "@/lib/auth/session"

// Создать сессию
await createSession(userId, email, username, false)

// Получить сессию
const session = await getSession()

// Удалить сессию
await deleteSession()
```

## Безопасность

- ✅ Пароли хешируются с помощью SHA-256
- ✅ Сессии хранятся в HTTP-only cookies
- ✅ Токены сброса пароля истекают через 1 час
- ✅ Валидация всех входных данных
- ✅ SQL инъекции предотвращены (postgres библиотека)
- ✅ Email валидация с regex
- ✅ Минимальная длина пароля 6 символов

## Разработка

### Режим разработки

В режиме разработки коды сброса пароля выводятся в консоль и в ответе API:

```json
{
  "success": true,
  "message": "Reset code sent",
  "code": "123456"
}
```

### Продакшн

В продакшене коды не возвращаются в ответе. Необходимо настроить отправку email:

```ts
// В app/api/auth/reset-password/request/route.ts
await sendPasswordResetEmail(email, code)
```

## Миграция со Supabase

Старые функции из `lib/supabase/client.ts` обновлены для совместимости:

- `signInWithEmail()` → использует `/api/auth/login`
- `signUpWithEmail()` → использует `/api/auth/register`
- `signInAsGuest()` → использует `/api/auth/guest`
- `signOut()` → использует `/api/auth/logout`
- `signInWithGoogle()` → выбрасывает ошибку (требует настройки OAuth)

## Проблемы и решения

### Ошибка: "DATABASE_URL not set"
Добавьте `DATABASE_URL` в `.env.local`

### Ошибка: "Failed to create user"
Проверьте, что все SQL скрипты выполнены

### Сессия не сохраняется
Проверьте, что cookies работают (HTTPS в продакшене)

### Коды сброса не работают
Проверьте таблицу `password_reset_tokens` и время истечения

## TODO

- [ ] Настроить отправку email для сброса пароля
- [ ] Добавить OAuth (Google, GitHub)
- [ ] Добавить двухфакторную аутентификацию
- [ ] Добавить rate limiting
- [ ] Добавить логирование попыток входа
- [ ] Улучшить хеширование паролей (bcrypt/argon2)
