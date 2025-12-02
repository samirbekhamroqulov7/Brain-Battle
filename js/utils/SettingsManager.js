/**
 * Менеджер настроек приложения
 */
class SettingsManager {
    static instance = null;
    
    constructor() {
        if (SettingsManager.instance) {
            return SettingsManager.instance;
        }
        
        this.settings = Storage.getAllSettings();
        this.listeners = [];
        this.isDarkMode = this.settings.darkMode;
        
        // Применяем начальные настройки
        this.applySettings();
        
        SettingsManager.instance = this;
    }
    
    /**
     * Получение настроек
     */
    get(key = null) {
        if (key) {
            return this.settings[key];
        }
        return { ...this.settings };
    }
    
    /**
     * Установка настроек
     */
    set(key, value, saveToStorage = true) {
        const oldValue = this.settings[key];
        this.settings[key] = value;
        
        // Сохраняем в хранилище
        if (saveToStorage) {
            const storageKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            Storage.set(storageKey, value);
        }
        
        // Уведомляем слушателей
        this.notifyListeners(key, value, oldValue);
        
        // Применяем настройку
        this.applySetting(key, value);
        
        return true;
    }
    
    /**
     * Массовое обновление настроек
     */
    update(newSettings, saveToStorage = true) {
        const changes = {};
        
        Object.entries(newSettings).forEach(([key, value]) => {
            const oldValue = this.settings[key];
            if (JSON.stringify(oldValue) !== JSON.stringify(value)) {
                this.settings[key] = value;
                changes[key] = { old: oldValue, new: value };
                
                // Применяем настройку
                this.applySetting(key, value);
            }
        });
        
        // Сохраняем в хранилище
        if (saveToStorage && Object.keys(changes).length > 0) {
            Storage.saveAllSettings(this.settings);
        }
        
        // Уведомляем слушателей
        Object.entries(changes).forEach(([key, change]) => {
            this.notifyListeners(key, change.new, change.old);
        });
        
        return changes;
    }
    
    /**
     * Сброс настроек к значениям по умолчанию
     */
    reset() {
        const defaultSettings = {
            soundEnabled: true,
            soundVolume: 0.7,
            musicEnabled: true,
            swipeEnabled: true,
            vibrationEnabled: true,
            language: 'ru',
            darkMode: false,
            animations: true
        };
        
        this.update(defaultSettings);
        
        // Очищаем временные данные
        Storage.clear();
        
        return defaultSettings;
    }
    
    /**
     * Применение всех настроек
     */
    applySettings() {
        Object.entries(this.settings).forEach(([key, value]) => {
            this.applySetting(key, value);
        });
    }
    
    /**
     * Применение конкретной настройки
     */
    applySetting(key, value) {
        switch (key) {
            case 'darkMode':
                this.applyDarkMode(value);
                break;
                
            case 'language':
                this.applyLanguage(value);
                break;
                
            case 'soundEnabled':
            case 'soundVolume':
            case 'musicEnabled':
                this.applyAudioSettings();
                break;
                
            case 'animations':
                this.applyAnimations(value);
                break;
        }
    }
    
    /**
     * Применение темной темы
     */
    applyDarkMode(enabled) {
        this.isDarkMode = enabled;
        
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Сохраняем в localStorage
        localStorage.setItem('theme', enabled ? 'dark' : 'light');
    }
    
    /**
     * Применение языка
     */
    applyLanguage(language) {
        document.documentElement.lang = language;
        
        // Здесь можно добавить загрузку языковых файлов
        // и обновление текстов на странице
        console.log(`Language changed to: ${language}`);
    }
    
    /**
     * Применение аудио настроек
     */
    applyAudioSettings() {
        AudioManager.updateSettings(this.settings);
        
        // Обновляем индикатор звука
        this.updateSoundIndicator();
    }
    
    /**
     * Применение настроек анимаций
     */
    applyAnimations(enabled) {
        const style = document.createElement('style');
        style.id = 'animation-settings';
        
        if (!enabled) {
            style.textContent = `
                * {
                    animation-duration: 0.001s !important;
                    animation-delay: 0s !important;
                    transition-duration: 0.001s !important;
                    transition-delay: 0s !important;
                }
            `;
        }
        
        // Удаляем старый стиль
        const oldStyle = document.getElementById('animation-settings');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        // Добавляем новый стиль
        if (!enabled) {
            document.head.appendChild(style);
        }
    }
    
    /**
     * Обновление индикатора звука
     */
    updateSoundIndicator() {
        const indicator = document.getElementById('soundIndicator');
        if (!indicator) return;
        
        const icon = indicator.querySelector('i');
        if (icon) {
            if (!this.settings.soundEnabled) {
                icon.className = 'fas fa-volume-mute';
                indicator.title = 'Звук: Выключен';
                indicator.classList.add('muted');
            } else {
                icon.className = 'fas fa-volume-up';
                indicator.title = `Звук: ${Math.round(this.settings.soundVolume * 100)}%`;
                indicator.classList.remove('muted');
            }
        }
    }
    
    /**
     * Добавление слушателя изменений настроек
     */
    addListener(callback) {
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
    notifyListeners(key, newValue, oldValue) {
        this.listeners.forEach(callback => {
            try {
                callback(key, newValue, oldValue);
            } catch (error) {
                console.error('Settings listener error:', error);
            }
        });
    }
    
    /**
     * Экспорт настроек
     */
    export() {
        const data = {
            version: '1.0.0',
            timestamp: Date.now(),
            settings: this.settings
        };
        
        return JSON.stringify(data, null, 2);
    }
    
    /**
     * Импорт настроек
     */
    import(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            if (!data.settings || typeof data.settings !== 'object') {
                throw new Error('Invalid settings format');
            }
            
            this.update(data.settings, true);
            return true;
        } catch (error) {
            console.error('Import settings error:', error);
            return false;
        }
    }
    
    /**
     * Проверка первой загрузки
     */
    checkFirstLaunch() {
        if (this.settings.firstLaunch) {
            this.set('firstLaunch', false);
            
            // Показываем обучение или приветствие
            setTimeout(() => {
                Helpers.showNotification(
                    'Добро пожаловать в Brain Battle!',
                    'info',
                    5000
                );
            }, 1000);
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Проверка обновления версии
     */
    checkVersionUpdate() {
        const storedVersion = this.settings.appVersion;
        const currentVersion = '1.0.0';
        
        if (storedVersion !== currentVersion) {
            this.set('appVersion', currentVersion);
            this.set('lastUpdate', Date.now());
            
            // Показываем уведомление об обновлении
            Helpers.showNotification(
                `Приложение обновлено до версии ${currentVersion}!`,
                'info',
                5000
            );
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Получение инстанса
     */
    static getInstance() {
        if (!SettingsManager.instance) {
            SettingsManager.instance = new SettingsManager();
        }
        return SettingsManager.instance;
    }
}

// Создаем инстанс при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const settings = SettingsManager.getInstance();
    settings.checkFirstLaunch();
    settings.checkVersionUpdate();
});

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
}