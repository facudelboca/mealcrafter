import React from 'react';

function RecipesView({ recipes, searchQuery, handleSearch, setRecipeModal, setRecipeDetailModal, setExternalImportModal, handleDeleteRecipe }) {
  return (
    <div className="page-container">
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon-svg">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Buscar recetas por nombre o ingrediente..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => setExternalImportModal({ isOpen: true })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Buscar en la Web
          </button>
          <button className="btn-primary" onClick={() => setRecipeModal({ isOpen: true, type: 'create', recipeData: null })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nueva Receta
          </button>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-state-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <h2>No se encontraron recetas</h2>
          <p>Intenta cambiar el criterio de búsqueda, importa una desde la web o crea una nueva receta en el catálogo.</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map(recipe => (
            <div className="glass-card recipe-card" key={recipe.id} onClick={() => setRecipeDetailModal({ isOpen: true, recipe })}>
              <div className="recipe-card-header">
                <h3 className="recipe-card-title">{recipe.nombre}</h3>
              </div>
              <div className="recipe-card-info">
                <span className="info-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  {recipe.porciones_base} porciones
                </span>
                {recipe.tiempo_preparacion_min && (
                  <span className="info-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {recipe.tiempo_preparacion_min} min
                  </span>
                )}
              </div>
              <div className="recipe-card-actions" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn-icon" 
                  title="Editar Receta"
                  onClick={() => setRecipeModal({ isOpen: true, type: 'edit', recipeData: recipe })}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button 
                  className="btn-icon" 
                  title="Eliminar Receta"
                  style={{ color: '#ef4444' }}
                  onClick={() => {
                    if (window.confirm(`¿Estás seguro de que deseas eliminar la receta "${recipe.nombre}"?`)) {
                      handleDeleteRecipe(recipe.id);
                    }
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipesView;
