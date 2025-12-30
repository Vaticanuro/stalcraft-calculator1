import { Translation, ItemColor, ItemStatus } from './core';

// Базовый предмет из listing.json
export interface BaseItem {
    id: string;           // "022k"
    data: string;         // "/items/misc/022k.json"
    icon: string;         // "/icons/misc/022k.png"
    name: Translation;
    color: ItemColor;
    status: ItemStatus;
}

// Элементы информационных блоков
export interface InfoElement {
    type: string;
    [key: string]: any;
}

// Информационный блок
export interface InfoBlock {
    type: string;
    title: Translation;
    elements?: InfoElement[];
    text?: Translation;
}

// Полная информация о предмете
export interface ItemDetail extends BaseItem {
    category: string;     // "misc", "medicine"
    infoBlocks: InfoBlock[];
    
    // Извлечённые данные (для удобства)
    weight?: number;
    basePrice?: number;
    isUsedInCrafts?: boolean;
}