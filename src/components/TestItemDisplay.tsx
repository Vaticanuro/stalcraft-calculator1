// src/components/TestItemDisplay.tsx
import React, { useState, useEffect } from 'react';
import { useItemNames } from '../hooks/useItemNames';

const TEST_ITEMS = ['022k', 'z22k', 'gmmn', 'unknown'];

export const TestItemDisplay: React.FC = () => {
    const { getName, getItem, initialized } = useItemNames();
    const [details, setDetails] = useState<Record<string, any>>({});
    
    useEffect(() => {
        // Загружаем детали для тестовых предметов
        TEST_ITEMS.forEach(async (id) => {
            try {
                const item = await getItem(id);
                setDetails(prev => ({ ...prev, [id]: item }));
            } catch (error) {
                setDetails(prev => ({ 
                    ...prev, 
                    [id]: { error: (error as Error).message } 
                }));
            }
        });
    }, [getItem]);
    
    if (!initialized) {
        return <div>Загрузка сервиса предметов...</div>;
    }
    
    return (
        <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Тест загрузки предметов</h2>
            <div className="space-y-3">
                {TEST_ITEMS.map(id => (
                    <div key={id} className="flex items-center space-x-3 p-2 border-b">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                            {details[id]?.icon ? (
                                <img 
                                    src={details[id].icon} 
                                    alt={id} 
                                    className="w-6 h-6"
                                />
                            ) : '?'}
                        </div>
                        <div>
                            <div className="font-medium">
                                {details[id]?.name || getName(id)}
                            </div>
                            <div className="text-sm text-gray-500">
                                ID: {id} • {details[id]?.category || '...'}
                                {details[id]?.basePrice && ` • ${details[id].basePrice} руб.`}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};