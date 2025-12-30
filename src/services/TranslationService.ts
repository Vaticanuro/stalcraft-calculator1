import { TranslationCache, ItemDisplayInfo } from '../types/translation';
import { Recipe } from '../types/recipes';

// services/TranslationService.ts
class TranslationService {
    private cache: TranslationCache = {
        items: new Map(),
        recipes: new Map(),
        perks: new Map()
    };
    
    private currentLanguage: 'ru' | 'en' | 'es' | 'fr' = 'ru';
    
    // Основной метод: получить название по ID
    getItemName(itemId: string): string {
        return this.cache.items.get(itemId)?.name || itemId; // fallback на ID
    }
    
    // Получить полную информацию о предмете для отображения
    getItemDisplayInfo(itemId: string): ItemDisplayInfo {
        const translation = this.cache.items.get(itemId);
        
        return {
            id: itemId,
            name: translation?.name || itemId,
            icon: translation?.iconPath || '/icons/unknown.png',
            color: translation?.color || 'DEFAULT',
            category: translation?.category || 'unknown'
        };
    }
    
    // Инициализация: загрузка всех переводов
    async initialize(language: 'ru' | 'en' | 'es' | 'fr'): Promise<void> {
        this.currentLanguage = language;
        
        // 1. Загружаем listing.json
        const listing = await this.loadListing();
        
        // 2. Для каждого элемента загружаем детальный файл
        const itemDetails = await Promise.all(
            listing.map(item => this.loadItemDetails(item.data))
        );
        
        // 3. Заполняем кеш
        itemDetails.forEach(detail => {
            this.cache.items.set(detail.id, {
                id: detail.id,
                name: detail.name.lines[this.currentLanguage],
                iconPath: detail.icon,
                color: detail.color,
                category: detail.category
            });
        });
        
        // 4. Загружаем перки из hideout_recipes.json
        const perks = await this.loadPerks();
        perks.forEach(perk => {
            this.cache.perks.set(
                perk.id, 
                perk.name.lines[this.currentLanguage]
            );
        });
    }
    
    // Утилита: создание читаемого ключа для рецепта
    generateRecipeKey(recipe: Recipe): string {
        // Пример: "workbench_ammo_9mm_result_okp24"
        return `${recipe.bench}_${recipe.category.key}_${recipe.subcategory.key}_result_${recipe.result[0].item}`;
    }
    private async loadListing(): Promise<any[]> {
    // Заглушка - вернём пустой массив
    return [];
}

private async loadItemDetails(dataPath: string): Promise<any> {
    // Заглушка
    return {
        id: 'temp',
        name: { lines: { ru: 'Временный', en: 'Temporary' } },
        icon: '/icons/unknown.png',
        color: 'DEFAULT',
        category: 'unknown'
    };
}

private async loadPerks(): Promise<any[]> {
    // Заглушка
    return [];
}
}