// src/types/loading.ts

// Приоритеты загрузки
export enum LoadPriority {
    CRITICAL = 0,    // Текущий расчет + базовые ресурсы
    HIGH = 1,        // Часто используемые предметы
    MEDIUM = 2,      // Предметы из активных категорий
    LOW = 3,         // Все остальные
    BACKGROUND = 4   // Фоновая предзагрузка
}

// Состояние загрузки предмета
export type LoadState = 
    | 'not_loaded'    // Еще не запрашивали
    | 'loading'       // В процессе загрузки
    | 'loaded'        // Успешно загружено
    | 'error';        // Ошибка загрузки

// Задача загрузки
export interface LoadTask {
    itemId: string;
    priority: LoadPriority;
    resolve: (value: ItemDetail | null) => void;
    reject: (error: Error) => void;
    timestamp: number;
}

// Кешированный предмет (только то, что нужно для UI)
export interface CachedItem {
    id: string;
    name: string;           // Русское название
    icon: string;
    color: ItemColor;
    category: string;
    weight?: number;
    basePrice?: number;
    loadState: LoadState;
    lastAccessed: number;   // Для LRU кеша
}