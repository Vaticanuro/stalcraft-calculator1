import { ItemTest } from './components/ItemTest';
import './index.css';

function App() {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-slate-900 to-gray-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎮 Stalcraft Craft Calculator
          </h1>
          <p className="text-gray-400">
            Разработка системы приоритетной загрузки предметов
          </p>
        </header>
        
        <main>
          <ItemTest />
          
          <div className="mt-8 p-6 bg-slate-800 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">📋 Следующие шаги:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-700 rounded">
                <div className="text-green-400 font-bold mb-2">1. ✅ Готово</div>
                <p>TypeScript интерфейсы и ItemNameService</p>
              </div>
              <div className="p-4 bg-slate-700 rounded">
                <div className="text-yellow-400 font-bold mb-2">2. ⚙️ В процессе</div>
                <p>Backend-прокси для запросов к GitHub</p>
              </div>
              <div className="p-4 bg-slate-700 rounded">
                <div className="text-gray-400 font-bold mb-2">3. ⬜ Далее</div>
                <p>Zustand store и расчёт крафта</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;