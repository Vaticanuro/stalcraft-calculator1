// src/types/items.ts
import { Translation, ItemColor, ItemStatus } from './core';

// Базовый предмет из listing.json
export interface BaseItem {
    id: string;           // "022k", "z22k"
    data: string;         // "/items/misc/022k.json"
    icon: string;         // "/icons/misc/022k.png"
    name: Translation;
    color: ItemColor;
    status: ItemStatus;
}

// Информационные блоки из детального файла предмета
export type InfoBlock = ListInfoBlock | TextInfoBlock | object;

interface BaseInfoBlock {
    type: string;
    title: Translation;
}

interface ListInfoBlock extends BaseInfoBlock {
    type: 'list';
    elements: InfoElement[];
}

interface TextInfoBlock extends BaseInfoBlock {
    type: 'text';
    text: Translation;
}

export type InfoElement = 
    | KeyValueElement 
    | NumericElement 
    | UsageElement 
    | object;

interface KeyValueElement {
    type: 'key-value';
    key: Translation;
    value: Translation;
}

interface NumericElement {
    type: 'numeric';
    name: Translation;
    value: number;
    formatted: {
        value: Translation;
        nameColor: string;
        valueColor: string;
    };
}

// Важный элемент - показывает, что предмет используется в крафтах
interface UsageElement {
    type: 'usage';
    name: Translation;
}

// Полная информация о предмете (из файла вида 022k.json)
export interface ItemDetail extends BaseItem {
    category: string;     // "misc", "medicine" и т.д.
    infoBlocks: InfoBlock[];
    // Дополнительные поля, которые могут пригодиться
    basePrice?: number;   // Если есть в infoBlocks
    weight?: number;      // Если есть в infoBlocks
}