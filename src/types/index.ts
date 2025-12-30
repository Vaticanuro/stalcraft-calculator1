// src/types/index.ts
// Реэкспортируем все типы для удобного импорта

export * from './core';
export * from './items';
export * from './craft';
export * from './loading';

// Можно добавить составные типы
export interface CraftTreeItem {
    itemId: string;
    name: string;      // Русское название (заполнится при загрузке)
    amount: number;
    source: 'craft' | 'auction' | 'inventory';
    children: CraftTreeItem[];
}