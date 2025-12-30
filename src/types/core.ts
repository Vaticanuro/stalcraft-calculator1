// src/types/core.ts

// Базовый интерфейс перевода (используется везде)
export interface Translation {
    type: 'translation' | 'text';
    key?: string;
    args?: Record<string, unknown>;
    lines: {
        ru: string;  // Только русский - упрощаем!
        en?: string; // Оставим опционально на будущее
    };
}

// Цвета рангов предметов (из listing.json)
export type ItemColor = 
    | 'DEFAULT'
    | 'RANK_NEWBIE'
    | 'RANK_STALKER'
    | 'RANK_VETERAN'
    | 'RANK_MASTER'
    | 'RANK_LEGEND'
    | string; // На случай новых рангов

// Статус предмета (можно выбросить или нет)
export type ItemStatus = {
    state: 'NON_DROP' | 'DROP' | string;
};