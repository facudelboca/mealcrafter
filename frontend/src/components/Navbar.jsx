import React from 'react';

function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="app-header">
      <a href="/" className="app-logo" onClick={(e) => { e.preventDefault(); setActiveTab('plan'); }}>
        <div className="app-logo-icon">🍳</div>
        <span>MealCrafter</span>
      </a>
      <nav className="app-nav">
        <button className={`nav-tab ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}>
          📅 Plan Semanal
        </button>
        <button className={`nav-tab ${activeTab === 'recipes' ? 'active' : ''}`} onClick={() => setActiveTab('recipes')}>
          🥣 Recetas
        </button>
        <button className={`nav-tab ${activeTab === 'shopping-list' ? 'active' : ''}`} onClick={() => setActiveTab('shopping-list')}>
          🛒 Lista de Compras
        </button>
        <button className={`nav-tab ${activeTab === 'ingredients' ? 'active' : ''}`} onClick={() => setActiveTab('ingredients')}>
          🍎 Ingredientes
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
