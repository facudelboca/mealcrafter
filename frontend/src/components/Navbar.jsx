import React from 'react';

function Navbar({ activeTab, setActiveTab, theme, toggleTheme, currentUser, onLogout }) {
  return (
    <header className="app-header">
      <a href="/" className="app-logo" onClick={(e) => { e.preventDefault(); setActiveTab('plan'); }}>
        <span>MealCrafter</span>
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme}
          title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--border-glass)', paddingLeft: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
              👋 {currentUser.nombre || currentUser.email}
            </span>
            <button 
              onClick={onLogout}
              className="btn-icon"
              title="Cerrar Sesión"
              style={{ width: '32px', height: '32px', borderRadius: '50%' }}
            >
              🚪
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
