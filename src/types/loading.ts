// Импортируем необходимые типы
import { ItemDetail } from './items';

// Приоритеты загрузки
export enum LoadPriority {
    CRITICAL = 0,    // Текущий расчёт
    HIGH = 1,        // Часто используемые
    MEDIUM = 2,      // Активные категории
    LOW = 3,         // Все остальные
    BACKGROUND = 4   // Фоновая предзагрузка
}

// Состояние загрузки
export type LoadState = 
    | 'not_loaded'
    | 'loading'
    | 'loaded'
    | 'error';

// Кешированный предмет
export interface CachedItem {
    id: string;
    name: string;           // Русское название
    icon: string;
    color: string;
    category: string;
    weight?: number;
    basePrice?: number;
    isUsedInCrafts?: boolean;
    loadState: LoadState;
    lastAccessed: number;   // Для LRU кеша
}

// Задача загрузки
export interface LoadTask {
    itemId: string;
    priority: LoadPriority;
    resolve: (value: ItemDetail | null) => void;
    reject: (error: Error) => void;
    timestamp: number;
}