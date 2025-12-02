/**
 * Менеджер хранения данных
 */
class Storage {
    static PREFIX = 'brain_battle_';
    static VERSION = '1.0.0';

    /**
     * Сохранение данных
     */
    static set(key, value, permanent = false) {
        try {
            const storageKey = this.PREFIX + key;
            const data = {
                value: value,
                timestamp: Date.now(),
                version: this.VERSION,
                permanent: permanent
            };
            localStorage.setItem(storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            this.showStorageError();
            return false;
        }
    }

    /**
     * Получение данных
     */
    static get(key, defaultValue = null) {
        try {
            const storageKey = this.PREFIX + key;
            const item = localStorage.getItem(storageKey);
            
            if (!item) {
                return defaultValue;
            }

            const data = JSON.parse(item);
            
            // Проверка версии
            if (data.version !== this.VERSION && !data.permanent) {
                this.remove(key);
                return defaultValue;
            }

            return data.value;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    }

    /**
     * Удаление данных
     */
    static remove(key) {
        try {
            const storageKey = this.PREFIX + key;
            localStorage.removeItem(storageKey);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }

    /**
     * Очистка всех данных (кроме постоянных)
     */
    static clear() {
        try {
            const keysToRemove = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.PREFIX)) {
                    try {
                        const item = localStorage.getItem(key);
                        const data = JSON.parse(item);
                        
                        // Удаляем только непостоянные данные
                        if (!data.permanent) {
                            keysToRemove.push(key);
                        }
                    } catch (e) {
                        // Если не получается распарсить, удаляем
                        keysToRemove.push(key);
                    }
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }

    /**
     * Полная очистка (включая постоянные)
     */
    static clearAll() {
        try {
            const keysToRemove = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.PREFIX)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Storage clearAll error:', error);
            return false;
        }
    }

    /**
     * Получение всех настроек
     */
    static getAllSettings() {
        return {
            // Звук
            soundEnabled: this.get('sound_enabled', true),
            soundVolume: this.get('sound_volume', 0.7),
            musicEnabled: this.get('music_enabled', true),
            
            // Управление
            swipeEnabled: this.get('swipe_enabled', true),
            vibrationEnabled: this.get('vibration_enabled', true),
            
            // Интерфейс
            language: this.get('language', 'ru'),
            darkMode: this.get('dark_mode', false),
            animations: this.get('animations', true),
            
            // Игрок
            playerName: this.get('player_name', 'Игрок'),
            playerAvatar: this.get('player_avatar', '1'),
            playerRating: this.get('player_rating', 1200),
            playerScore: this.get('player_score', 0),
            playerGames: this.get('player_games', 0),
            
            // Игра
            lastGameSize: this.get('last_game_size', 4),
            lastGameMode: this.get('last_game_mode', 'single'),
            bestTimes: this.get('best_times', {}),
            bestMoves: this.get('best_moves', {}),
            
            // Достижения
            achievements: this.get('achievements', []),
            tutorialCompleted: this.get('tutorial_completed', false),
            
            // Системные
            firstLaunch: this.get('first_launch', true),
            appVersion: this.get('app_version', this.VERSION),
            lastUpdate: this.get('last_update', Date.now())
        };
    }

    /**
     * Сохранение всех настроек
     */
    static saveAllSettings(settings) {
        Object.entries(settings).forEach(([key, value]) => {
            const storageKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            this.set(storageKey, value, key.startsWith('player_'));
        });
    }

    /**
     * Сохранение игрового результата
     */
    static saveGameResult(size, mode, moves, time) {
        const bestTimes = this.get('best_times', {});
        const bestMoves = this.get('best_moves', {});
        const key = `${size}x${size}_${mode}`;
        
        // Сохраняем лучшее время
        if (!bestTimes[key] || time < bestTimes[key]) {
            bestTimes[key] = time;
            this.set('best_times', bestTimes, true);
        }
        
        // Сохраняем минимальное количество ходов
        if (!bestMoves[key] || moves < bestMoves[key]) {
            bestMoves[key] = moves;
            this.set('best_moves', bestMoves, true);
        }
        
        // Обновляем статистику игрока
        this.updatePlayerStats(moves, time);
        
        return {
            isNewBestTime: bestTimes[key] === time,
            isNewBestMoves: bestMoves[key] === moves
        };
    }

    /**
     * Обновление статистики игрока
     */
    static updatePlayerStats(moves, time) {
        const score = this.get('player_score', 0);
        const games = this.get('player_games', 0);
        const rating = this.get('player_rating', 1200);
        
        // Расчет нового рейтинга (упрощенный)
        const scoreIncrease = Math.max(100, 1000 - moves - time);
        const newScore = score + scoreIncrease;
        const newGames = games + 1;
        
        // Простой расчет рейтинга
        const performance = 1000 / (moves + time);
        const ratingChange = Math.round((performance - 0.5) * 20);
        const newRating = Math.max(0, rating + ratingChange);
        
        this.set('player_score', newScore, true);
        this.set('player_games', newGames, true);
        this.set('player_rating', newRating, true);
        
        // Проверка достижений
        this.checkAchievements(newScore, newGames);
        
        return {
            score: newScore,
            games: newGames,
            rating: newRating,
            scoreIncrease: scoreIncrease
        };
    }

    /**
     * Проверка достижений
     */
    static checkAchievements(score, games) {
        const achievements = this.get('achievements', []);
        const newAchievements = [];
        
        const achievementRules = [
            { id: 'first_game', condition: games === 1, name: 'Первая игра' },
            { id: 'ten_games', condition: games === 10, name: '10 игр' },
            { id: 'hundred_games', condition: games === 100, name: '100 игр' },
            { id: 'score_1000', condition: score >= 1000, name: '1000 очков' },
            { id: 'score_5000', condition: score >= 5000, name: '5000 очков' },
            { id: 'score_10000', condition: score >= 10000, name: '10000 очков' },
            { id: 'perfect_3x3', condition: this.getBestMoves(3, 'single') === 8, name: 'Идеальная 3x3' },
            { id: 'perfect_4x4', condition: this.getBestMoves(4, 'single') === 15, name: 'Идеальная 4x4' },
            { id: 'speed_runner', condition: this.getBestTime(4, 'single') < 60, name: 'Спидраннер' },
            { id: 'pvp_winner', condition: this.get('pvp_wins', 0) >= 10, name: 'PvP чемпион' }
        ];
        
        achievementRules.forEach(rule => {
            if (rule.condition && !achievements.includes(rule.id)) {
                achievements.push(rule.id);
                newAchievements.push(rule.name);
            }
        });
        
        if (newAchievements.length > 0) {
            this.set('achievements', achievements, true);
            return newAchievements;
        }
        
        return [];
    }

    /**
     * Получение лучшего времени
     */
    static getBestTime(size, mode) {
        const bestTimes = this.get('best_times', {});
        const key = `${size}x${size}_${mode}`;
        return bestTimes[key] || null;
    }

    /**
     * Получение лучшего количества ходов
     */
    static getBestMoves(size, mode) {
        const bestMoves = this.get('best_moves', {});
        const key = `${size}x${size}_${mode}`;
        return bestMoves[key] || null;
    }

    /**
     * Получение статистики игрока
     */
    static getPlayerStats() {
        const settings = this.getAllSettings();
        const level = Helpers.calculateLevel(settings.playerScore);
        const progress = Helpers.calculateProgress(settings.playerScore);
        
        return {
            name: settings.playerName,
            avatar: settings.playerAvatar,
            rating: settings.playerRating,
            score: settings.playerScore,
            games: settings.playerGames,
            level: level,
            progress: progress,
            achievements: settings.achievements.length,
            bestTimes: settings.bestTimes,
            bestMoves: settings.bestMoves
        };
    }

    /**
     * Экспорт данных
     */
    static exportData() {
        const data = {
            version: this.VERSION,
            timestamp: Date.now(),
            settings: this.getAllSettings()
        };
        
        return JSON.stringify(data, null, 2);
    }

    /**
     * Импорт данных
     */
    static importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            // Проверка версии
            if (data.version !== this.VERSION) {
                console.warn('Importing data from different version');
            }
            
            // Сохраняем настройки
            this.saveAllSettings(data.settings);
            return true;
        } catch (error) {
            console.error('Import data error:', error);
            return false;
        }
    }

    /**
     * Проверка доступности localStorage
     */
    static isAvailable() {
        try {
            const testKey = this.PREFIX + 'test';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Показ ошибки хранилища
     */
    static showStorageError() {
        if (!this.isAvailable()) {
            Helpers.showNotification(
                'LocalStorage недоступен. Некоторые функции могут не работать.',
                'warning',
                5000
            );
        }
    }

    /**
     * Получение размера хранилища
     */
    static getStorageSize() {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            total += key.length + value.length;
        }
        return total;
    }
}

// Инициализация
Storage.showStorageError();

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}