import { useState, useEffect, useCallback } from 'react';
import { itemNameService } from '../services/ItemNameService';
import { CachedItem, LoadPriority } from '../types';

export function useItemNames() {
    const [initialized, setInitialized] = useState(false);
    const [stats, setStats] = useState(itemNameService.getStats());

    // Инициализация при монтировании
    useEffect(() => {
        itemNameService.initialize()
            .then(() => setInitialized(true))
            .catch(console.error);
    }, []);

    // Обновляем статистику периодически
    useEffect(() => {
        if (!initialized) return;

        const interval = setInterval(() => {
            setStats(itemNameService.getStats());
        }, 2000);

        return () => clearInterval(interval);
    }, [initialized]);

    const getItem = useCallback(async (
        itemId: string, 
        priority: LoadPriority = LoadPriority.MEDIUM
    ): Promise<CachedItem> => {
        return itemNameService.getItem(itemId, priority);
    }, []);

    const getName = useCallback((itemId: string): string => {
        return itemNameService.getName(itemId);
    }, []);

    const preloadItems = useCallback((itemIds: string[]) => {
        itemIds.forEach(id => {
            itemNameService.getItem(id, LoadPriority.BACKGROUND)
                .catch(() => { /* Игнорируем ошибки фоновой загрузки */ });
        });
    }, []);

    return {
        initialized,
        getItem,
        getName,
        preloadItems,
        stats
    };
}