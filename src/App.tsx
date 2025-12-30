import './App.css' // Импортируем стили

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Stalcraft Calculator</h1>
      
      <div className="calculator">
        <div className="input-group">
          <label className="input-label">Цена предмета:</label>
          <input 
            type="number" 
            className="input-field"
            placeholder="Введите цену"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Комиссия аукциона (%):</label>
          <input 
            type="number" 
            className="input-field"
            defaultValue="10"
            placeholder="Например: 10"
          />
        </div>

        <button className="calculate-button">
          Рассчитать
        </button>

        <div className="result-container">
          <h3 className="result-title">Итоговая стоимость:</h3>
          <p className="result-amount">0 ₽</p>
        </div>
      </div>
    </div>
  )
}

export default App