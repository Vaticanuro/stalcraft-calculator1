import { 
    LoadPriority, 
    LoadState, 
    CachedItem, 
    ItemDetail,
    BaseItem
} from '../types';

class ItemNameService {
    private cache = new Map<string, CachedItem>();
    private queue = new Map<LoadPriority, Array<{
        itemId: string;
        resolve: (value: CachedItem) => void;
        reject: (error: Error) => void;
    }>>();
    private maxConcurrent = 3;
    private activeRequests = 0;

    constructor() {
        // Инициализируем очереди
        for (let p = LoadPriority.CRITICAL; p <= LoadPriority.BACKGROUND; p++) {
            this.queue.set(p, []);
        }
    }

    // Основной метод: получить информацию о предмете
    async getItem(itemId: string, priority: LoadPriority = LoadPriority.MEDIUM): Promise<CachedItem> {
        // 1. Проверяем кеш
        const cached = this.cache.get(itemId);
        if (cached?.loadState === 'loaded') {
            cached.lastAccessed = Date.now();
            return cached;
        }

        // 2. Если уже грузится, ждём
        if (cached?.loadState === 'loading') {
            return this.waitForLoading(itemId);
        }

        // 3. Создаём новую задачу загрузки
        return new Promise((resolve, reject) => {
            const queue = this.queue.get(priority);
            if (!queue) {
                reject(new Error(`Invalid priority: ${priority}`));
                return;
            }

            queue.push({ itemId, resolve, reject });
            
            // Создаём запись в кеше со статусом "loading"
            this.cache.set(itemId, {
                id: itemId,
                name: `Загрузка... (${itemId})`,
                icon: '/icons/unknown.png',
                color: 'DEFAULT',
                category: 'unknown',
                loadState: 'loading',
                lastAccessed: Date.now()
            });

            // Запускаем обработку очереди
            this.processQueue();
        });
    }

    // Пакетная загрузка
    async getItems(itemIds: string[], priority: LoadPriority): Promise<CachedItem[]> {
        return Promise.all(
            itemIds.map(id => this.getItem(id, priority))
        );
    }

    // Получить название (синхронно, если есть в кеше)
    getName(itemId: string): string {
        return this.cache.get(itemId)?.name || itemId;
    }

    // Инициализация сервиса
    async initialize(): Promise<void> {
        try {
            console.log('ItemNameService: начата инициализация');
            
            // Здесь позже будет загрузка listing.json
            // Пока просто создаём заглушки для часто используемых предметов
            
            const commonItems = [
                { id: '022k', name: 'Сверло', icon: '/icons/misc/drill.png', color: 'RANK_VETERAN' },
                { id: 'z22k', name: 'Металлолом', icon: '/icons/misc/scrap.png', color: 'DEFAULT' },
                { id: 'okp24', name: 'Патроны 9мм', icon: '/icons/ammo/9mm.png', color: 'RANK_NEWBIE' }
            ];

            commonItems.forEach(item => {
                this.cache.set(item.id, {
                    ...item,
                    category: 'misc',
                    loadState: 'loaded',
                    lastAccessed: Date.now()
                });
            });

            console.log(`ItemNameService: инициализировано ${commonItems.length} предметов`);
            
        } catch (error) {
            console.error('ItemNameService: ошибка инициализации', error);
        }
    }

    // Внутренние методы
    private async processQueue(): Promise<void> {
        if (this.activeRequests >= this.maxConcurrent) return;

        // Находим задачу с наивысшим приоритетом
        let task = null;
        for (let p = LoadPriority.CRITICAL; p <= LoadPriority.BACKGROUND && !task; p++) {
            const queue = this.queue.get(p);
            if (queue && queue.length > 0) {
                task = queue.shift();
            }
        }

        if (!task) return;

        this.activeRequests++;

        try {
            // Симуляция загрузки (позже заменим на реальный запрос)
            await this.simulateLoad(task.itemId);
            
            // Обновляем кеш
            const cachedItem = this.cache.get(task.itemId);
            if (cachedItem) {
                cachedItem.loadState = 'loaded';
                cachedItem.name = `Предмет ${task.itemId}`; // Заглушка
                cachedItem.lastAccessed = Date.now();
            }

            task.resolve(cachedItem || {
                id: task.itemId,
                name: `Предмет ${task.itemId}`,
                icon: '/icons/unknown.png',
                color: 'DEFAULT',
                category: 'unknown',
                loadState: 'loaded',
                lastAccessed: Date.now()
            });

        } catch (error) {
            const cachedItem = this.cache.get(task.itemId);
            if (cachedItem) {
                cachedItem.loadState = 'error';
                cachedItem.name = `Ошибка: ${task.itemId}`;
            }
            task.reject(error as Error);
        } finally {
            this.activeRequests--;
            // Продолжаем обработку очереди
            setTimeout(() => this.processQueue(), 0);
        }
    }

    private async simulateLoad(itemId: string): Promise<void> {
        // Симуляция сетевой задержки
        return new Promise(resolve => {
            setTimeout(resolve, 100 + Math.random() * 400);
        });
    }

    private async waitForLoading(itemId: string): Promise<CachedItem> {
        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
                const cached = this.cache.get(itemId);
                if (cached?.loadState === 'loaded') {
                    clearInterval(checkInterval);
                    resolve(cached);
                } else if (cached?.loadState === 'error') {
                    clearInterval(checkInterval);
                    reject(new Error(`Loading failed for ${itemId}`));
                }
            }, 50);

            setTimeout(() => {
                clearInterval(checkInterval);
                reject(new Error(`Timeout waiting for ${itemId}`));
            }, 5000);
        });
    }

    // Статистика
    getStats() {
        const loaded = Array.from(this.cache.values())
            .filter(item => item.loadState === 'loaded').length;
        
        return {
            total: this.cache.size,
            loaded,
            loading: Array.from(this.cache.values())
                .filter(item => item.loadState === 'loading').length,
            errors: Array.from(this.cache.values())
                .filter(item => item.loadState === 'error').length
        };
    }
}

// Экспортируем синглтон
export const itemNameService = new ItemNameService();