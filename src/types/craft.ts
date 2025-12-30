import { Translation } from './core';

// Навык (Perk)
export interface Perk {
    id: string;  // "ammunition", "pyrotechnics"
    name: Translation;
    desc: Translation;
}

// Компонент крафта
export interface CraftingComponent {
    item: string;  // ID предмета
    amount: number;
}

// Требования для крафта
export interface CraftRequirements {
    perks: Record<string, number>; // { "ammunition": 1 }
    features: string[];            // ["workbench", "precise_tools"]
}

// Рецепт
export interface Recipe {
    bench: 'workbench' | 'kitchen_table' | 'laboratory_table' | string;
    category: Translation;
    subcategory: Translation;
    result: CraftingComponent[];
    ingredients: CraftingComponent[];
    energy: number;
    requirements: CraftRequirements;
}