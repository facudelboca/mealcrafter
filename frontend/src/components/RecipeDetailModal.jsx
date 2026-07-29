import React, { useState, useEffect } from 'react';

function RecipeDetailModal({ isOpen, recipe, onClose }) {
  if (!isOpen || !recipe) return null;

  const [activeTab, setActiveTab] = useState('ingredients');
  const [portions, setPortions] = useState(recipe.porciones_base);

  useEffect(() => {
    if (recipe) {
      setPortions(recipe.porciones_base);
      setActiveTab('ingredients');
    }
  }, [recipe]);

  const scaleFactor = portions / recipe.porciones_base;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{recipe.nombre}</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span className="tag-badge" style={{ background: 'var(--accent-glow)', color: 'var(--accent)', borderColor: 'rgba(99,102,241,0.2)' }}>
              Porciones base: {recipe.porciones_base}
            </span>
            {recipe.tiempo_preparacion_min && (
              <span className="tag-badge" style={{ background: 'var(--bg-container)', color: 'var(--text-primary)', borderColor: 'var(--border-glass)' }}>
                Preparación: {recipe.tiempo_preparacion_min} min
              </span>
            )}
          </div>

          {/* Diners scaler widget */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '12px 16px', background: 'var(--bg-container)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Ajustar comensales para esta vista:</span>
            <div className="meal-diners-control" style={{ margin: 0 }}>
              <button className="meal-diners-btn" onClick={() => setPortions(Math.max(1, portions - 1))}>-</button>
              <span className="meal-diners-val" style={{ minWidth: '32px', textAlign: 'center', fontWeight: '600' }}>{portions}</span>
              <button className="meal-diners-btn" onClick={() => setPortions(portions + 1)}>+</button>
            </div>
          </div>

          {/* Tabs header */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', marginBottom: '16px' }}>
            <button 
              type="button"
              style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none', color: activeTab === 'ingredients' ? 'var(--primary)' : 'var(--text-secondary)', borderBottom: activeTab === 'ingredients' ? '2px solid var(--primary)' : 'none', fontWeight: '600', cursor: 'pointer', outline: 'none' }}
              onClick={() => setActiveTab('ingredients')}
            >
              🥫 Ingredientes ({recipe.ingredients?.length || 0})
            </button>
            <button 
              type="button"
              style={{ flex: 1, padding: '12px', background: 'transparent', border: 'none', color: activeTab === 'instructions' ? 'var(--primary)' : 'var(--text-secondary)', borderBottom: activeTab === 'instructions' ? '2px solid var(--primary)' : 'none', fontWeight: '600', cursor: 'pointer', outline: 'none' }}
              onClick={() => setActiveTab('instructions')}
            >
              📖 Preparación
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'ingredients' ? (
            <div>
              <h3 className="form-label" style={{ marginBottom: '8px' }}>Ingredientes Necesarios</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recipe.ingredients?.map((ri, idx) => {
                  const scaledQty = Number((parseFloat(ri.cantidad) * scaleFactor).toFixed(2));
                  return (
                    <div key={idx} style={{ background: 'var(--bg-container)', border: '1px solid var(--border-glass)', padding: '10px 14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ fontWeight: '500', textTransform: 'capitalize', color: 'var(--text-primary)' }}>{ri.ingredient?.nombre}</span>
                      <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{scaledQty} {ri.unidad}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="form-label" style={{ marginBottom: '8px' }}>Instrucciones de Preparación</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', whiteSpace: 'pre-line', background: 'var(--bg-container)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '8px' }}>
                {recipe.instrucciones}
              </p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetailModal;
