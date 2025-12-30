// src/services/ItemNameService.ts
import { 
    LoadPriority, 
    LoadState, 
    LoadTask, 
    CachedItem,
    ItemDetail,
    BaseItem
} from '../types';

export class ItemNameService {
    private cache = new Map<string, CachedItem>();
    private queue = new Map<LoadPriority, LoadTask[]>();
    private activeRequests = 0;
    private maxConcurrent = 3; // Ограничение параллельных запросов
    
    // Статистика для отладки
    private stats = {
        totalRequests: 0,
        cacheHits: 0,
        queueSize: 0
    };

    constructor() {
        // Инициализируем очереди для каждого приоритета
        for (let p = LoadPriority.CRITICAL; p <= LoadPriority.BACKGROUND; p++) {
            this.queue.set(p, []);
        }
    }

    // Основной метод: получить информацию о предмете
    async getItem(itemId: string, priority: LoadPriority = LoadPriority.MEDIUM): Promise<CachedItem> {
        // 1. Проверяем кеш
        const cached = this.cache.get(itemId);
        if (cached && cached.loadState === 'loaded') {
            cached.lastAccessed = Date.now();
            this.stats.cacheHits++;
            return cached;
        }

        // 2. Если уже грузится, ждём завершения
        if (cached?.loadState === 'loading') {
            return this.waitForLoading(itemId);
        }

        // 3. Создаём задачу на загрузку
        return new Promise((resolve, reject) => {
            const task: LoadTask = {
                itemId,
                priority,
                resolve: (detail: ItemDetail | null) => {
                    if (detail) {
                        const cachedItem = this.detailToCached(detail);
                        this.cache.set(itemId, cachedItem);
                        resolve(cachedItem);
                    } else {
                        reject(new Error(`Failed to load item ${itemId}`));
                    }
                },
                reject,
                timestamp: Date.now()
            };

            // Добавляем в очередь согласно приоритету
            this.queue.get(priority)!.push(task);
            this.stats.queueSize++;
            
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

    // Пакетная загрузка нескольких предметов
    async getItems(itemIds: string[], priority: LoadPriority): Promise<CachedItem[]> {
        return Promise.all(
            itemIds.map(id => this.getItem(id, priority))
        );
    }

    // Предзагрузка часто используемых предметов
    async preloadCommonItems(): Promise<void> {
        const commonItems = [
            '022k', // Сверло
            'z22k', // Частый ингредиент
            'gmmn', // Ещё один частый предмет
            'okp24' // Патроны 9мм
        ];
        
        await this.getItems(commonItems, LoadPriority.HIGH);
        console.log('Предзагружены частые предметы:', commonItems);
    }

    // Инициализация из listing.json
    async initialize(): Promise<void> {
        try {
            // Загружаем listing.json через наш прокси
            const response = await fetch('/api/github/listing');
            const items: BaseItem[] = await response.json();
            
            // Сразу создаём базовые записи в кеше (без деталей)
            items.forEach(item => {
                if (!this.cache.has(item.id)) {
                    this.cache.set(item.id, {
                        id: item.id,
                        name: item.name.lines.ru || item.id,
                        icon: item.icon,
                        color: item.color,
                        category: this.extractCategoryFromPath(item.data),
                        loadState: 'not_loaded',
                        lastAccessed: 0
                    });
                }
            });
            
            console.log(`Инициализирован кеш для ${items.length} предметов`);
            
            // Предзагружаем частые предметы
            await this.preloadCommonItems();
            
        } catch (error) {
            console.error('Ошибка инициализации ItemNameService:', error);
        }
    }

    // Внутренние методы
    private async processQueue(): Promise<void> {
        if (this.activeRequests >= this.maxConcurrent) return;
        
        // Находим задачу с наивысшим приоритетом
        let task: LoadTask | undefined;
        for (let p = LoadPriority.CRITICAL; p <= LoadPriority.BACKGROUND; p++) {
            const queue = this.queue.get(p)!;
            if (queue.length > 0) {
                task = queue.shift();
                this.stats.queueSize--;
                break;
            }
        }
        
        if (!task) return;
        
        this.activeRequests++;
        this.stats.totalRequests++;
        
        try {
            // Загружаем детали предмета
            const detail = await this.loadItemDetails(task.itemId);
            task.resolve(detail);
        } catch (error) {
            task.reject(error as Error);
            
            // Обновляем статус в кеше
            const cached = this.cache.get(task.itemId);
            if (cached) {
                cached.loadState = 'error';
                cached.name = `Ошибка: ${task.itemId}`;
            }
        } finally {
            this.activeRequests--;
            // Продолжаем обработку очереди
            setTimeout(() => this.processQueue(), 0);
        }
    }
    
    private async loadItemDetails(itemId: string): Promise<ItemDetail | null> {
        // Загружаем через наш backend-прокси
        const response = await fetch(`/api/github/item/${itemId}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    }
    
    private detailToCached(detail: ItemDetail): CachedItem {
        // Извлекаем вес и цену из infoBlocks
        let weight: number | undefined;
        let basePrice: number | undefined;
        
        detail.infoBlocks.forEach(block => {
            if (block.type === 'list') {
                block.elements.forEach(element => {
                    if (element.type === 'numeric' && element.name.lines.ru.includes('Вес')) {
                        weight = element.value;
                    }
                    if (element.type === 'key-value' && element.key.lines.ru.includes('Базовая цена')) {
                        // Парсим "1 628 руб." -> 1628
                        const match = element.value.lines.ru.match(/(\d[\d\s]*)/);
                        if (match) {
                            basePrice = parseInt(match[1].replace(/\s/g, ''));
                        }
                    }
                });
            }
        });
        
        return {
            id: detail.id,
            name: detail.name.lines.ru,
            icon: detail.icon,
            color: detail.color,
            category: detail.category,
            weight,
            basePrice,
            loadState: 'loaded',
            lastAccessed: Date.now()
        };
    }
    
    private extractCategoryFromPath(dataPath: string): string {
        // "/items/misc/022k.json" -> "misc"
        const match = dataPath.match(/\/items\/([^\/]+)/);
        return match ? match[1] : 'unknown';
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
            
            // Таймаут 10 секунд
            setTimeout(() => {
                clearInterval(checkInterval);
                reject(new Error(`Timeout waiting for ${itemId}`));
            }, 10000);
        });
    }
    
    // Утилиты для отладки
    getStats() {
        return {
            ...this.stats,
            cacheSize: this.cache.size,
            cachedItems: Array.from(this.cache.values())
                .filter(item => item.loadState === 'loaded')
                .length
        };
    }
    
    clearCache(): void {
        this.cache.clear();
        this.stats.cacheHits = 0;
        this.stats.totalRequests = 0;
    }
}

// Синглтон экземпляр
export const itemNameService = new ItemNameService();