/**
 * Менеджер аудио и звуковых эффектов
 */
class AudioManager {
    static instance = null;
    
    constructor() {
        if (AudioManager.instance) {
            return AudioManager.instance;
        }
        
        this.sounds = {};
        this.music = null;
        this.currentMusic = null;
        this.settings = Storage.getAllSettings();
        this.isInitialized = false;
        this.context = null;
        
        // Предзагрузка звуков
        this.predefinedSounds = {
            move: { url: this.generateMoveSound(), volume: 0.3 },
            click: { url: this.generateClickSound(), volume: 0.4 },
            win: { url: this.generateWinSound(), volume: 0.6 },
            error: { url: this.generateErrorSound(), volume: 0.4 },
            shuffle: { url: this.generateShuffleSound(), volume: 0.5 },
            hint: { url: this.generateHintSound(), volume: 0.4 },
            levelUp: { url: this.generateLevelUpSound(), volume: 0.7 }
        };
        
        AudioManager.instance = this;
    }
    
    /**
     * Инициализация аудио
     */
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Создаем звуки
            await this.createSounds();
            this.isInitialized = true;
            console.log('AudioManager initialized');
        } catch (error) {
            console.error('AudioManager initialization error:', error);
        }
    }
    
    /**
     * Создание звуков
     */
    async createSounds() {
        for (const [name, config] of Object.entries(this.predefinedSounds)) {
            this.sounds[name] = await this.createSound(config.url, config.volume);
        }
        
        // Создаем контекст для генерации звуков
        this.createAudioContext();
    }
    
    /**
     * Создание аудио контекста
     */
    createAudioContext() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported');
        }
    }
    
    /**
     * Создание звука из Data URL
     */
    createSound(dataUrl, volume = 1.0) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.volume = volume * this.settings.soundVolume;
            audio.preload = 'auto';
            
            audio.oncanplaythrough = () => {
                resolve(audio);
            };
            
            audio.onerror = () => {
                console.warn(`Failed to load sound: ${dataUrl}`);
                resolve(null);
            };
            
            audio.src = dataUrl;
        });
    }
    
    /**
     * Воспроизведение звука
     */
    play(name, options = {}) {
        if (!this.settings.soundEnabled) return;
        if (!this.isInitialized) return;
        
        const sound = this.sounds[name];
        if (!sound) {
            console.warn(`Sound not found: ${name}`);
            return;
        }
        
        try {
            const volume = options.volume || 1.0;
            sound.volume = volume * this.settings.soundVolume;
            sound.currentTime = 0;
            
            const playPromise = sound.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Audio play error:', error);
                    // Автоматическое возобновление контекста
                    if (this.context && this.context.state === 'suspended') {
                        this.context.resume();
                    }
                });
            }
        } catch (error) {
            console.log('Audio play error:', error);
        }
    }
    
    /**
     * Воспроизведение музыки
     */
    playMusic(name) {
        if (!this.settings.musicEnabled) return;
        
        // Останавливаем текущую музыку
        if (this.currentMusic) {
            this.stopMusic();
        }
        
        // Здесь можно добавить загрузку фоновой музыки
        // Для примера создаем простой генератор музыки
        if (this.context) {
            this.currentMusic = this.generateBackgroundMusic();
        }
    }
    
    /**
     * Остановка музыки
     */
    stopMusic() {
        if (this.currentMusic) {
            if (this.currentMusic.stop) {
                this.currentMusic.stop();
            }
            this.currentMusic = null;
        }
    }
    
    /**
     * Обновление настроек
     */
    updateSettings(newSettings = null) {
        if (newSettings) {
            this.settings = { ...this.settings, ...newSettings };
        } else {
            this.settings = Storage.getAllSettings();
        }
        
        // Обновляем громкость всех звуков
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.volume = sound.volume * (this.settings.soundVolume / 0.7);
            }
        });
        
        // Управление музыкой
        if (!this.settings.musicEnabled && this.currentMusic) {
            this.stopMusic();
        } else if (this.settings.musicEnabled && !this.currentMusic) {
            this.playMusic('background');
        }
    }
    
    /**
     * Генерация звука перемещения
     */
    generateMoveSound() {
        // Генерируем простой звуковой сигнал
        return 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAA=';
    }
    
    /**
     * Генерация звука клика
     */
    generateClickSound() {
        return 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAA=';
    }
    
    /**
     * Генерация звука победы
     */
    generateWinSound() {
        return 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAA=';
    }
    
    /**
     * Генерация звука ошибки
     */
    generateErrorSound() {
        return 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAA=';
    }
    
    /**
     * Генерация звука перемешивания
     */
    generateShuffleSound() {
        return 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAA=';
    }
    
    /**
     * Генерация звука подсказки
     */
    generateHintSound() {
        return 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAA=';
    }
    
    /**
     * Генерация звука повышения уровня
     */
    generateLevelUpSound() {
        return 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAA=';
    }
    
    /**
     * Генерация фоновой музыки
     */
    generateBackgroundMusic() {
        if (!this.context) return null;
        
        try {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, this.context.currentTime);
            
            gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
            
            oscillator.start();
            return oscillator;
        } catch (error) {
            console.warn('Failed to generate background music:', error);
            return null;
        }
    }
    
    /**
     * Виброотклик (если поддерживается)
     */
    vibrate(pattern = [100, 50, 100]) {
        if (!this.settings.vibrationEnabled) return;
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }
    
    /**
     * Получение инстанса
     */
    static getInstance() {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }
    
    /**
     * Быстрый доступ к методам
     */
    static play(name, options) {
        const instance = AudioManager.getInstance();
        instance.play(name, options);
    }
    
    static updateSettings(settings) {
        const instance = AudioManager.getInstance();
        instance.updateSettings(settings);
    }
    
    static vibrate(pattern) {
        const instance = AudioManager.getInstance();
        instance.vibrate(pattern);
    }
    
    static async initialize() {
        const instance = AudioManager.getInstance();
        await instance.initialize();
    }
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
    AudioManager.initialize();
});

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}