// src/types/craft.ts
import { Translation } from './core';

// Навык (Perk) - для требований к крафту
export interface Perk {
    id: string;  // "ammunition", "pyrotechnics"
    name: Translation;
    desc: Translation;
}

// Компонент крафта (ингредиент или результат)
export interface CraftingComponent {
    item: string;  // ID предмета
    amount: number;
}

// Требования для крафта
export interface CraftRequirements {
    perks: Record<string, number>; // { "ammunition": 1 }
    features: string[];            // ["workbench", "precise_tools"]
}

// Рецепт крафта
export interface Recipe {
    // Идентификатор рецепта (генерируем сами)
    id?: string;
    bench: 'workbench' | 'kitchen_table' | 'laboratory_table';
    category: Translation;
    subcategory: Translation;
    result: CraftingComponent[];
    ingredients: CraftingComponent[];
    energy: number;
    requirements: CraftRequirements;
}