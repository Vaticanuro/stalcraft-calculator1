// Файл: types/calculations.ts
// --- Источник получения предмета ---
// Критически важно для оптимизации!
export type ItemSource = 'craft' | 'auction' | 'inventory' | 'vendor';

// --- Узел в дереве крафта ---
export interface CraftTreeNode {
    // Идентификатор предмета
    itemId: string;
    // Необходимое количество в этом узле
    quantityNeeded: number;
    // Как мы планируем его получить?
    resolvedSource: ItemSource;

    // РЕШЕНИЕ ПО ЦИКЛАМ:
    // Флаг, указывающий, что здесь обнаружена циклическая зависимость
    // (например, предмет А требует для крафта Б, а Б требует А)
    isCycle: boolean;
    // Если это цикл, мы не углубляемся дальше, а показываем предупреждение

    // РЕШЕНИЕ ПО АЛЬТЕРНАТИВАМ:
    // Если для предмета есть несколько рецептов, здесь будет выбран ОДИН,
    // оптимальный согласно алгоритму. Остальные варианты можно хранить
    // в отдельной структуре для сравнения.
    selectedRecipeId?: string; // Можно генерировать id рецепта

    // Вложенные узлы (ингредиенты)
    children: CraftTreeNode[];
}

// --- Полный расчёт стоимости ---
export interface CraftCalculation {
    // Исходный запрос
    targetItemId: string;
    targetQuantity: number;

    // Результат построения дерева
    craftTree: CraftTreeNode;

    // Итоговые агрегированные затраты
    totalCost: {
        // Сумма по всем узлам, где источник 'craft'
        energy: number;
        // Сводная таблица по всем предметам, которые нужно получить
        materials: Array<{
            itemId: string;
            totalAmount: number;
            source: ItemSource;
            cost: number; // в рублях, если покупка
        }>;
        // Общая оценочная стоимость в рублях
        estimatedTotalRubles: number;
    };

    // Требуемые навыки (максимальные уровни из всех рецептов)
    requiredPerks: Record<string, number>;

    // Информация о проблемах (циклы, недоступные рецепты)
    warnings: string[];
    errors: string[];
}

// --- Контекст для расчёта (настройки пользователя) ---
export interface CraftContext {
    // Навыки персонажа
    characterPerks: Record<string, number>;
    // Доступные станции в убежище
    availableFeatures: string[];
    // Предметы в инвентаре
    inventory: Record<string, number>;
    // Настройки: что предпочитать?
    optimizationGoal: 'minimizeCost' | 'minimizeEnergy' | 'minimizeTime';
    // Использовать ли данные аукциона?
    useAuctionPrices: boolean;
    // Регион для цен аукциона
    auctionRegion: string;
}