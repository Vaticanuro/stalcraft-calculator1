import { Translation } from './core';

export interface CraftTreeNode {
    itemId: string;
    quantity: number;
    children: CraftTreeNode[];
}

export interface TranslatedCraftTreeNode extends CraftTreeNode {
    itemName: string;
    icon?: string;
    color?: string;
    children: TranslatedCraftTreeNode[];

}

export interface CraftContext {
    // Определите структуру позже
}

export interface CraftCalculation {
    // Определите структуру позже
}

export interface Recipe {
    id: string;
    bench: string;
    category: Translation;
    subcategory: Translation;
    result: Array<{ item: string; amount: number }>;
    ingredients: Array<{ item: string; amount: number }>;
    energy: number;
    requirements: {
        perks: Record<string, number>;
        features: string[];
    };
}