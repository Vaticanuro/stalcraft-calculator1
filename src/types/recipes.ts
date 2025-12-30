// Файл: types/recipes.ts
// --- Навык (Perk) ---
export interface Perk {
    id: string; // "ammunition", "pyrotechnics" и т.д.
    name: Translation;
    desc: Translation;
}

// --- Ингредиент или результат крафта ---
export interface CraftingComponent {
    item: string; // ID предмета
    amount: number;
}

// --- Требования для крафта ---
export interface CraftRequirements {
    perks: Record<string, number>; // { "ammunition": 5 }
    features: string[]; // ["workbench", "precise_tools"]
}

// --- Рецепт (Recipe) ---
export interface Recipe {
    bench: 'workbench' | 'kitchen_table' | 'laboratory_table'; // и другие
    category: Translation;
    subcategory: Translation;
    result: CraftingComponent[];
    ingredients: CraftingComponent[];
    energy: number;
    requirements: CraftRequirements;
}