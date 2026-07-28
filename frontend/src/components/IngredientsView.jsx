import React from 'react';

function IngredientsView({ 
  ingredients, 
  selectedIngredient, 
  setSelectedIngredient, 
  newIngredient, 
  setNewIngredient, 
  handleCreateIngredient, 
  newConversion, 
  setNewConversion, 
  handleAddConversion 
}) {
  return (
    <div className="page-container">
      <div className="glass-card">
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
          Catalogador de Ingredientes
        </h2>
        <div className="ingredients-manager">
          {/* Catalog list */}
          <div>
            <h3 className="form-label" style={{ marginBottom: '10px' }}>Ingredientes del Catálogo</h3>
            <div className="catalog-list">
              {ingredients.map(ing => (
                <div 
                  className={`catalog-item ${selectedIngredient?.id === ing.id ? 'selected' : ''}`} 
                  key={ing.id}
                  onClick={() => setSelectedIngredient(ing)}
                >
                  <span className="catalog-item-name">{ing.nombre}</span>
                  <span className="catalog-item-badge">base: {ing.unidad_base}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Forms column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Create ingredient form */}
            <form onSubmit={handleCreateIngredient} className="glass-card" style={{ padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '14px' }}>➕ Crear Nuevo Ingrediente</h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label className="form-label">Nombre</label>
                  <input 
                    type="text" 
                    placeholder="Ej: manteca, zanahoria" 
                    className="form-input"
                    value={newIngredient.nombre}
                    onChange={(e) => setNewIngredient({ ...newIngredient, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Unidad Base</label>
                  <select 
                    className="form-select"
                    value={newIngredient.unidad_base}
                    onChange={(e) => setNewIngredient({ ...newIngredient, unidad_base: e.target.value })}
                  >
                    <option value="g">gramos (g)</option>
                    <option value="ml">mililitros (ml)</option>
                    <option value="unidad">unidad</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '10px 16px' }}>Crear</button>
              </div>
            </form>

            {/* Add conversion factors */}
            {selectedIngredient ? (
              <div className="glass-card" style={{ padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '14px', textTransform: 'capitalize' }}>
                  ⚖️ Conversiones para "{selectedIngredient.nombre}"
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <span className="form-label">Regla de conversión activa:</span>
                  <div style={{ fontSize: '13px', marginTop: '4px', color: 'var(--text-secondary)' }}>
                    • 1 {selectedIngredient.unidad_base} = 1 {selectedIngredient.unidad_base} (Unidad base predeterminada)
                    {selectedIngredient.conversions?.map(c => (
                      <div key={c.id}>
                        • 1 {c.unidad_origen} = {c.factor_a_base} {selectedIngredient.unidad_base}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddConversion} style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                    Agregar Factor de Conversión
                  </h4>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Unidad Origen</label>
                      <input 
                        type="text" 
                        placeholder="Ej: kg, taza, l" 
                        className="form-input"
                        value={newConversion.unidad_origen}
                        onChange={(e) => setNewConversion({ ...newConversion, unidad_origen: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Equivale en {selectedIngredient.unidad_base} a</label>
                      <input 
                        type="number" 
                        step="any"
                        placeholder="Ej: 1000, 250" 
                        className="form-input"
                        value={newConversion.factor_a_base}
                        onChange={(e) => setNewConversion({ ...newConversion, factor_a_base: e.target.value })}
                        required
                      />
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: '10px 16px' }}>Añadir</button>
                  </div>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '14px', border: '1px dashed var(--border-glass)', borderRadius: 'var(--border-radius-lg)' }}>
                Selecciona un ingrediente del catálogo de la izquierda para ver y gestionar sus equivalencias de conversión.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IngredientsView;
