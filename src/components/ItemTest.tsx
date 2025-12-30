import React, { useState, useEffect } from 'react';
import { useItemNames } from '../hooks/useItemNames';
import { LoadPriority } from '../types';

const TEST_ITEMS = ['022k', 'z22k', 'unknown_item', 'test_123'];

export const ItemTest: React.FC = () => {
    const { getName, getItem, initialized, stats } = useItemNames();
    const [details, setDetails] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);

    const loadAllItems = async () => {
        setLoading(true);
        const newDetails: Record<string, any> = {};
        
        for (const itemId of TEST_ITEMS) {
            try {
                const item = await getItem(itemId, LoadPriority.HIGH);
                newDetails[itemId] = item;
            } catch (error) {
                newDetails[itemId] = { error: (error as Error).message };
            }
        }
        
        setDetails(newDetails);
        setLoading(false);
    };

    useEffect(() => {
        if (initialized) {
            loadAllItems();
        }
    }, [initialized]);

    if (!initialized) {
        return (
            <div className="p-4 bg-gray-800 rounded-lg">
                <div className="animate-pulse">Загрузка сервиса предметов...</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-800 rounded-lg shadow-xl max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-400">
                    🧪 Тест системы загрузки предметов
                </h2>
                <div className="text-sm text-gray-400">
                    Загружено: {stats.loaded}/{stats.total}
                </div>
            </div>

            <div className="space-y-4 mb-6">
                {TEST_ITEMS.map(itemId => (
                    <div key={itemId} className="flex items-center p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition">
                        <div className={`w-10 h-10 rounded mr-4 flex items-center justify-center
                            ${details[itemId]?.color === 'RANK_VETERAN' ? 'bg-amber-500' : 'bg-gray-600'}`}>
                            {details[itemId]?.icon ? '🖼️' : '?'}
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-lg">
                                {details[itemId]?.name || getName(itemId)}
                            </div>
                            <div className="text-sm text-gray-400">
                                ID: {itemId} • 
                                Статус: {details[itemId]?.loadState || 'not_loaded'} • 
                                {details[itemId]?.category && ` Категория: ${details[itemId].category}`}
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded text-sm
                            ${details[itemId]?.loadState === 'loaded' ? 'bg-green-500' :
                              details[itemId]?.loadState === 'loading' ? 'bg-yellow-500' :
                              'bg-red-500'}`}>
                            {details[itemId]?.loadState === 'loaded' ? '✓' :
                             details[itemId]?.loadState === 'loading' ? '⟳' : '✗'}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 mb-6">
                <div className="text-center p-3 bg-slate-900 rounded">
                    <div className="text-lg font-bold text-green-400">{stats.loaded}</div>
                    <div>Загружено</div>
                </div>
                <div className="text-center p-3 bg-slate-900 rounded">
                    <div className="text-lg font-bold text-yellow-400">
                        {stats.loading}
                    </div>
                    <div>В процессе</div>
                </div>
                <div className="text-center p-3 bg-slate-900 rounded">
                    <div className="text-lg font-bold text-red-400">{stats.errors}</div>
                    <div>Ошибок</div>
                </div>
            </div>

            <button 
                onClick={loadAllItems}
                disabled={loading}
                className={`w-full py-3 rounded font-medium transition
                    ${loading 
                        ? 'bg-gray-700 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {loading ? 'Загрузка...' : '🔄 Перезагрузить все предметы'}
            </button>

            <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-gray-500">
                <p>Это тестовая система приоритетной загрузки. В реальном приложении:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Будет загрузка из GitHub (listing.json и файлы предметов)</li>
                    <li>Реальная информация о предметах (вес, цена, иконки)</li>
                    <li>LRU-кеш для управления памятью</li>
                    <li>Backend-прокси для запросов</li>
                </ul>
            </div>
        </div>
    );
};