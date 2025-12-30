// Базовый интерфейс перевода (только русский)
export interface Translation {
    type: 'translation' | 'text';
    key?: string;
    args?: Record<string, unknown>;
    lines: {
        ru: string;
        en?: string; // опционально на будущее
    };
}

// Цвета рангов предметов
export type ItemColor = 
    | 'DEFAULT'
    | 'RANK_NEWBIE'
    | 'RANK_STALKER'
    | 'RANK_VETERAN'
    | 'RANK_MASTER'
    | 'RANK_LEGEND'
    | string;

// Статус предмета
export interface ItemStatus {
    state: 'NON_DROP' | 'DROP' | string;
}

// Базовые настройки приложения
export interface AppConfig {
    apiBase: string;
    defaultRegion: string;
    debug: boolean;
    cacheTTL: {
        auction: number;    // секунды
        items: number;      // секунды
    };
}