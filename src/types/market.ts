// Файл: types/market.ts
// --- Данные с аукциона (история цен) ---
export interface AuctionPricePoint {
    amount: number;    // Количество предметов в лоте
    price: number;     // Общая цена лота
    time: string;      // ISO 8601 timestamp
}

export interface AuctionHistoryResponse {
    total: number;
    prices: AuctionPricePoint[];
}

// --- Расширенный предмет с рыночными данными ---
export interface ItemWithMarketData extends ItemDetail {
    // Последние данные с аукциона
    marketHistory?: AuctionPricePoint[];
    // Рассчитанные метрики
    marketMetrics?: {
        averagePricePerUnit: number;
        lastPrice: number;
        volatility: number;
    };
}