import React from 'react';

function RecipeDetailModal({ isOpen, recipe, onClose }) {
  if (!isOpen || !recipe) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{recipe.nombre}</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span className="tag-badge">Categoría: {recipe.tipo_comida}</span>
            <span className="tag-badge" style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', borderColor: 'rgba(99,102,241,0.2)' }}>
              Porciones base: {recipe.porciones_base}
            </span>
            {recipe.tiempo_preparacion_min && (
              <span className="tag-badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', borderColor: 'var(--border-glass)' }}>
                Preparación: {recipe.tiempo_preparacion_min} min
              </span>
            )}
          </div>

          <div style={{ marginTop: '16px' }}>
            <h3 className="form-label" style={{ marginBottom: '8px' }}>Ingredientes Requeridos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recipe.ingredients?.map((ri, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.15)', padding: '10px 14px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{ri.ingredient?.nombre}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{ri.cantidad} {ri.unidad}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <h3 className="form-label" style={{ marginBottom: '8px' }}>Instrucciones de Preparación</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', whiteSpace: 'pre-line', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
              {recipe.instrucciones}
            </p>
          </div>
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
