/**
 * Система локализации
 */
class Localization {
    static instance = null;
    static currentLanguage = 'ru';
    static translations = {};
    static listeners = [];
    
    constructor() {
        if (Localization.instance) {
            return Localization.instance;
        }
        
        // Загружаем настройки
        this.settings = SettingsManager.getInstance().get();
        this.currentLanguage = this.settings.language || 'ru';
        
        // Загружаем переводы
        this.loadTranslations();
        
        Localization.instance = this;
    }
    
    /**
     * Загрузка переводов
     */
    loadTranslations() {
        // Базовые переводы
        const baseTranslations = {
            ru: this.getRussianTranslations(),
            en: this.getEnglishTranslations(),
            es: this.getSpanishTranslations(),
            fr: this.getFrenchTranslations(),
            de: this.getGermanTranslations(),
            tr: this.getTurkishTranslations()
        };
        
        Localization.translations = baseTranslations;
    }
    
    /**
     * Получение перевода
     */
    static t(key, params = {}) {
        const translation = this.translations[this.currentLanguage] || 
                          this.translations.ru || 
                          {};
        
        let text = translation[key] || key;
        
        // Заменяем параметры
        Object.entries(params).forEach(([param, value]) => {
            text = text.replace(new RegExp(`{{${param}}}`, 'g'), value);
        });
        
        return text;
    }
    
    /**
     * Установка языка
     */
    static setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            
            // Сохраняем в настройках
            SettingsManager.getInstance().set('language', language);
            
            // Обновляем язык документа
            document.documentElement.lang = language;
            
            // Уведомляем слушателей
            this.notifyListeners();
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Получение текущего языка
     */
    static getLanguage() {
        return this.currentLanguage;
    }
    
    /**
     * Получение доступных языков
     */
    static getAvailableLanguages() {
        return [
            { code: 'ru', name: 'Русский', flag: '🇷🇺' },
            { code: 'en', name: 'English', flag: '🇬🇧' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
            { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
        ];
    }
    
    /**
     * Добавление слушателя
     */
    static addListener(callback) {
        this.listeners.push(callback);
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }
    
    /**
     * Уведомление слушателей
     */
    static notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.currentLanguage);
            } catch (error) {
                console.error('Localization listener error:', error);
            }
        });
    }
    
    /**
     * Обновление текстов на странице
     */
    static updatePageTexts() {
        // Находим все элементы с data-i18n атрибутом
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const params = {};
            
            // Собираем параметры из data-атрибутов
            Array.from(element.attributes).forEach(attr => {
                if (attr.name.startsWith('data-i18n-')) {
                    const paramName = attr.name.replace('data-i18n-', '');
                    params[paramName] = attr.value;
                }
            });
            
            const translation = this.t(key, params);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.type !== 'submit' && element.type !== 'button') {
                    element.placeholder = translation;
                }
            } else if (element.hasAttribute('title')) {
                element.title = translation;
            } else if (element.hasAttribute('alt')) {
                element.alt = translation;
            } else {
                element.textContent = translation;
            }
        });
    }
    
    /**
     * Русские переводы
     */
    getRussianTranslations() {
        return {
            // Общее
            'app.name': 'Brain Battle',
            'app.developer': 'Az&Dil Group',
            'loading': 'Загрузка...',
            'loading.game': 'Загрузка игры...',
            'loading.assets': 'Загрузка ресурсов...',
            
            // Кнопки
            'button.play': 'Играть',
            'button.settings': 'Настройки',
            'button.profile': 'Профиль',
            'button.back': 'Назад',
            'button.save': 'Сохранить',
            'button.cancel': 'Отмена',
            'button.reset': 'Сбросить',
            'button.close': 'Закрыть',
            'button.continue': 'Продолжить',
            'button.restart': 'Заново',
            'button.hint': 'Подсказка',
            'button.menu': 'Меню',
            'button.leaderboard': 'Таблица лидеров',
            'button.achievements': 'Достижения',
            'button.help': 'Помощь',
            'button.about': 'О приложении',
            
            // Меню
            'menu.title': 'Главное меню',
            'menu.classic': 'Классический',
            'menu.pvp': 'PvP Бой',
            'menu.timed': 'На время',
            'menu.single': 'Одиночная',
            'menu.multiplayer': 'Мультиплеер',
            'menu.training': 'Тренировка',
            
            // Игра
            'game.title': 'Игра',
            'game.moves': 'Ходы: {{count}}',
            'game.time': 'Время: {{time}}',
            'game.timer': 'Таймер',
            'game.rank': 'Ранг',
            'game.score': 'Очки: {{score}}',
            'game.level': 'Уровень {{level}}',
            'game.progress': 'Прогресс: {{percent}}%',
            'game.complete': 'Завершено!',
            'game.victory': '🎉 Победа!',
            'game.defeat': 'Поражение',
            'game.draw': 'Ничья',
            'game.paused': 'Пауза',
            'game.resume': 'Продолжить игру',
            
            // Победа
            'victory.message': 'Поздравляем! Вы решили головоломку!',
            'victory.moves': 'Ходы: {{moves}}',
            'victory.time': 'Время: {{time}}',
            'victory.bestTime': 'Лучшее время: {{time}}',
            'victory.bestMoves': 'Лучшие ходы: {{moves}}',
            'victory.newRecord': 'Новый рекорд!',
            'victory.continue': 'Следующий уровень',
            
            // Настройки
            'settings.title': 'Настройки',
            'settings.sound': 'Звук',
            'settings.music': 'Музыка',
            'settings.volume': 'Громкость',
            'settings.language': 'Язык',
            'settings.theme': 'Тема',
            'settings.theme.light': 'Светлая',
            'settings.theme.dark': 'Темная',
            'settings.animations': 'Анимации',
            'settings.vibration': 'Виброотклик',
            'settings.swipe': 'Управление свайпом',
            'settings.notifications': 'Уведомления',
            'settings.privacy': 'Конфиденциальность',
            'settings.help': 'Помощь',
            'settings.about': 'О приложении',
            'settings.reset': 'Сбросить настройки',
            'settings.confirmReset': 'Вы уверены, что хотите сбросить все настройки?',
            
            // Профиль
            'profile.title': 'Профиль',
            'profile.name': 'Имя игрока',
            'profile.avatar': 'Аватар',
            'profile.rating': 'Рейтинг',
            'profile.level': 'Уровень',
            'profile.score': 'Очки',
            'profile.games': 'Игр сыграно',
            'profile.wins': 'Побед',
            'profile.losses': 'Поражений',
            'profile.achievements': 'Достижения',
            'profile.edit': 'Редактировать профиль',
            'profile.save': 'Сохранить профиль',
            
            // Таблица лидеров
            'leaderboard.title': 'Таблица лидеров',
            'leaderboard.rank': 'Ранг',
            'leaderboard.name': 'Имя',
            'leaderboard.score': 'Очки',
            'leaderboard.level': 'Уровень',
            'leaderboard.games': 'Игры',
            'leaderboard.wins': 'Побед',
            'leaderboard.loading': 'Загрузка таблицы...',
            'leaderboard.empty': 'Таблица лидеров пуста',
            'leaderboard.yourRank': 'Ваш ранг: {{rank}}',
            
            // Достижения
            'achievements.title': 'Достижения',
            'achievements.locked': 'Заблокировано',
            'achievements.unlocked': 'Разблокировано',
            'achievements.progress': 'Прогресс: {{current}}/{{total}}',
            'achievements.empty': 'Достижения не найдены',
            
            // Уведомления
            'notification.error': 'Ошибка',
            'notification.success': 'Успех',
            'notification.warning': 'Предупреждение',
            'notification.info': 'Информация',
            'notification.connectionLost': 'Потеряно соединение',
            'notification.connectionRestored': 'Соединение восстановлено',
            'notification.gameSaved': 'Игра сохранена',
            'notification.settingsSaved': 'Настройки сохранены',
            'notification.profileUpdated': 'Профиль обновлен',
            
            // Ошибки
            'error.general': 'Произошла ошибка',
            'error.network': 'Ошибка сети',
            'error.save': 'Ошибка сохранения',
            'error.load': 'Ошибка загрузки',
            'error.invalidMove': 'Невозможный ход',
            'error.gameNotFound': 'Игра не найдена',
            'error.playerNotFound': 'Игрок не найден',
            'error.roomFull': 'Комната заполнена',
            
            // Подсказки
            'hint.swipe': 'Используйте свайп для перемещения плиток',
            'hint.click': 'Кликните на плитку для перемещения',
            'hint.empty': 'Перемещайте плитки к пустой клетке',
            'hint.solution': 'Решение: {{moves}} ходов',
            'hint.available': 'Доступные ходы: {{count}}',
            
            // PvP
            'pvp.searching': 'Поиск соперника...',
            'pvp.opponentFound': 'Соперник найден!',
            'pvp.waiting': 'Ожидание хода соперника...',
            'pvp.yourTurn': 'Ваш ход',
            'pvp.opponentTurn': 'Ход соперника',
            'pvp.disconnected': 'Соперник отключился',
            'pvp.win': 'Вы победили!',
            'pvp.lose': 'Вы проиграли',
            'pvp.draw': 'Ничья',
            'pvp.rematch': 'Реванш',
            
            // Помощь
            'help.title': 'Помощь',
            'help.rules': 'Правила игры',
            'help.rules.text': 'Перемещайте плитки, чтобы расположить их в порядке от 1 до 15. Пустая клетка должна оказаться в правом нижнем углу.',
            'help.controls': 'Управление',
            'help.controls.text': 'Кликайте на плитки рядом с пустой клеткой или используйте свайп для перемещения.',
            'help.tips': 'Советы',
            'help.tips.text': 'Начинайте с углов, собирайте сначала верхний ряд, затем левый столбец.',
            'help.contact': 'Связаться с поддержкой',
            'help.contact.text': 'Если у вас есть вопросы или предложения, напишите нам.',
            'help.email': 'support@brainbattle.azdilgroup.com',
            
            // О приложении
            'about.title': 'О приложении',
            'about.version': 'Версия {{version}}',
            'about.developer': 'Разработчик: {{developer}}',
            'about.license': 'Лицензия: MIT',
            'about.privacy': 'Политика конфиденциальности',
            'about.terms': 'Условия использования',
            'about.credits': 'Благодарности',
            'about.credits.text': 'Спасибо всем тестировщикам и сообществу за поддержку!',
            
            // Размеры поля
            'size.3x3': '3x3 (Легко)',
            'size.4x4': '4x4 (Стандарт)',
            'size.5x5': '5x5 (Сложно)',
            'size.6x6': '6x6 (Эксперт)',
            'size.7x7': '7x7 (Мастер)',
            'size.8x8': '8x8 (Гуру)',
            'size.9x9': '9x9 (Легенда)',
            'size.10x10': '10x10 (Невозможно?)'
        };
    }
    
    /**
     * Английские переводы
     */
    getEnglishTranslations() {
        return {
            'app.name': 'Brain Battle',
            'app.developer': 'Az&Dil Group',
            'loading': 'Loading...',
            'button.play': 'Play',
            'button.settings': 'Settings',
            'button.profile': 'Profile',
            'game.moves': 'Moves: {{count}}',
            'game.time': 'Time: {{time}}',
            'victory.message': 'Congratulations! You solved the puzzle!',
            'settings.title': 'Settings',
            'settings.sound': 'Sound',
            'settings.language': 'Language',
            'profile.title': 'Profile',
            'help.title': 'Help'
            // ... остальные переводы
        };
    }
    
    /**
     * Испанские переводы
     */
    getSpanishTranslations() {
        return {
            'app.name': 'Batalla Cerebral',
            'button.play': 'Jugar',
            'settings.title': 'Ajustes'
            // ... остальные переводы
        };
    }
    
    /**
     * Французские переводы
     */
    getFrenchTranslations() {
        return {
            'app.name': 'Bataille Cérébrale',
            'button.play': 'Jouer',
            'settings.title': 'Paramètres'
            // ... остальные переводы
        };
    }
    
    /**
     * Немецкие переводы
     */
    getGermanTranslations() {
        return {
            'app.name': 'Gehirnschlacht',
            'button.play': 'Spielen',
            'settings.title': 'Einstellungen'
            // ... остальные переводы
        };
    }
    
    /**
     * Турецкие переводы
     */
    getTurkishTranslations() {
        return {
            'app.name': 'Beyin Savaşı',
            'button.play': 'Oyna',
            'settings.title': 'Ayarlar'
            // ... остальные переводы
        };
    }
    
    /**
     * Получение инстанса
     */
    static getInstance() {
        if (!Localization.instance) {
            Localization.instance = new Localization();
        }
        return Localization.instance;
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const localization = Localization.getInstance();
    
    // Обновляем тексты на странице
    Localization.updatePageTexts();
    
    // Слушаем изменения языка
    SettingsManager.getInstance().addListener((key, newValue) => {
        if (key === 'language') {
            Localization.setLanguage(newValue);
            Localization.updatePageTexts();
        }
    });
});

// Создаем алиас для удобства
const t = Localization.t;

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Localization;
}