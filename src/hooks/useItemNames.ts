// src/hooks/useItemNames.ts
import { useState, useEffect, useCallback } from 'react';
import { itemNameService } from '../services/ItemNameService';
import { CachedItem, LoadPriority } from '../types';

export function useItemNames() {
    const [initialized, setInitialized] = useState(false);
    
    // Инициализация при монтировании
    useEffect(() => {
        itemNameService.initialize()
            .then(() => setInitialized(true))
            .catch(console.error);
    }, []);
    
    // Получить информацию о предмете
    const getItem = useCallback(async (
        itemId: string, 
        priority: LoadPriority = LoadPriority.MEDIUM
    ): Promise<CachedItem> => {
        return itemNameService.getItem(itemId, priority);
    }, []);
    
    // Получить несколько предметов
    const getItems = useCallback(async (
        itemIds: string[], 
        priority: LoadPriority = LoadPriority.MEDIUM
    ): Promise<CachedItem[]> => {
        return itemNameService.getItems(itemIds, priority);
    }, []);
    
    // Получить только название (синхронно, если есть в кеше)
    const getName = useCallback((itemId: string): string => {
        const cached = itemNameService['cache'].get(itemId); // Доступ к приватному полю
        return cached?.name || itemId;
    }, []);
    
    // Предзагрузка предметов (например, при наведении)
    const preloadItems = useCallback((itemIds: string[]) => {
        itemIds.forEach(id => {
            itemNameService.getItem(id, LoadPriority.BACKGROUND)
                .catch(() => {/* Игнорируем ошибки фоновой загрузки */});
        });
    }, []);
    
    return {
        initialized,
        getItem,
        getItems,
        getName,
        preloadItems,
        // Для отладки
        stats: itemNameService.getStats()
    };
}