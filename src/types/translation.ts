// types/translation.ts
export interface ItemNameCache {
    // Простая мапа: ID -> русское название
    items: Map<string, string>;
    // Кеш для иконок и другой мета-информации, если нужна
    meta: Map<string, { icon: string; color: string }>;
}

// services/ItemNameService.ts
class ItemNameService {
    private cache: Map<string, string> = new Map();
    private metaCache: Map<string, { icon: string; color: string }> = new Map();
    
    // Основной метод: получить русское название по ID
    getName(itemId: string): string {
        return this.cache.get(itemId) || `Предмет ${itemId}`; // Fallback
    }
    
    // Получить иконку и цвет для предмета
    getMeta(itemId: string) {
        return this.metaCache.get(itemId) || { 
            icon: '/icons/unknown.png', 
            color: 'default' 
        };
    }
    
    // Инициализация из listing.json и детальных файлов
    async initialize(): Promise<void> {
        // 1. Загружаем listing.json через ваш backend-прокси или напрямую
        const listingResponse = await fetch('/api/proxy/listing');
        const listing: BaseItem[] = await listingResponse.json();
        
        // 2. Параллельно загружаем детали для каждого предмета
        // (можно ограничить первые 100 для MVP)
        const itemDetails = await Promise.all(
            listing.slice(0, 100).map(item => 
                this.loadItemDetails(item.data)
                    .catch(() => null) // Игнорируем ошибки
            )
        );
        
        // 3. Заполняем кеши
        itemDetails.forEach(detail => {
            if (!detail) return;
            
            this.cache.set(detail.id, detail.name.lines.ru);
            this.metaCache.set(detail.id, {
                icon: detail.icon,
                color: detail.color
            });
        });
        
        console.log(`Загружено ${this.cache.size} русских названий`);
    }
    
    private async loadItemDetails(dataPath: string): Promise<ItemDetail> {
        const response = await fetch(`/api/proxy${dataPath}`);
        return response.json();
    }
}