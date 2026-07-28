import React from 'react';

function RecipesView({ recipes, searchQuery, handleSearch, setRecipeModal, setRecipeDetailModal }) {
  return (
    <div className="page-container">
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="🔍 Buscar recetas por nombre o ingrediente..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <button className="btn-primary" onClick={() => setRecipeModal({ isOpen: true, type: 'create', recipeData: null })}>
          ➕ Nueva Receta
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-state-icon">🥣</div>
          <h2>No se encontraron recetas</h2>
          <p>Intenta cambiar el criterio de búsqueda o crea una nueva receta en el catálogo.</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map(recipe => (
            <div className="glass-card recipe-card" key={recipe.id} onClick={() => setRecipeDetailModal({ isOpen: true, recipe })}>
              <div className="recipe-card-header">
                <h3 className="recipe-card-title">{recipe.nombre}</h3>
                <span className="tag-badge">{recipe.tipo_comida}</span>
              </div>
              <div className="recipe-card-info">
                <span>👤 {recipe.porciones_base} porciones</span>
                {recipe.tiempo_preparacion_min && (
                  <span>⏱️ {recipe.tiempo_preparacion_min} min</span>
                )}
              </div>
              <div className="recipe-card-actions" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="btn-icon" 
                  title="Editar Receta"
                  onClick={() => setRecipeModal({ isOpen: true, type: 'edit', recipeData: recipe })}
                >
                  ✏️
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
