// src/components/TestComponent.tsx
import React from 'react';

export const TestComponent: React.FC = () => {
  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-blue-400 mb-4">
        🎮 Stalcraft Craft Calculator
      </h1>
      <p className="text-gray-300 mb-4">
        Проект успешно запущен! Можно начинать разработку.
      </p>
      <div className="space-y-2">
        <div className="flex items-center p-3 bg-slate-700 rounded">
          <div className="w-8 h-8 bg-amber-500 rounded mr-3"></div>
          <div>
            <div className="font-medium">Предмет 022k</div>
            <div className="text-sm text-gray-400">Сверло • 1,628 руб.</div>
          </div>
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition">
          Рассчитать крафт
        </button>
      </div>
    </div>
  );
};