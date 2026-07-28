import React, { useState, useEffect } from 'react';

function RecipeFormModal({ type, recipeData, onClose, onSave, loading }) {
  const [nombre, setNombre] = useState('');
  const [porcionesBase, setPorcionesBase] = useState(4);
  const [tipoComida, setTipoComida] = useState('ambos');
  const [tiempoPrep, setTiempoPrep] = useState('');
  const [instrucciones, setInstrucciones] = useState('');
  const [ingredients, setIngredients] = useState([{ nombre: '', cantidad: '', unidad: '' }]);

  useEffect(() => {
    if (type === 'edit' && recipeData) {
      setNombre(recipeData.nombre || '');
      setPorcionesBase(recipeData.porciones_base || 4);
      setTipoComida(recipeData.tipo_comida || 'ambos');
      setTiempoPrep(recipeData.tiempo_preparacion_min || '');
      setInstrucciones(recipeData.instrucciones || '');
      
      const mapped = recipeData.ingredients?.map(ri => ({
        nombre: ri.ingredient?.nombre || '',
        cantidad: ri.cantidad || '',
        unidad: ri.unidad || ''
      }));
      setIngredients(mapped && mapped.length > 0 ? mapped : [{ nombre: '', cantidad: '', unidad: '' }]);
    }
  }, [type, recipeData]);

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addIngredientRow = () => {
    setIngredients([...ingredients, { nombre: '', cantidad: '', unidad: '' }]);
  };

  const removeIngredientRow = (index) => {
    const updated = ingredients.filter((_, idx) => idx !== index);
    setIngredients(updated.length > 0 ? updated : [{ nombre: '', cantidad: '', unidad: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validIngredients = ingredients.filter(i => i.nombre.trim() && i.cantidad && i.unidad.trim());
    if (validIngredients.length === 0) {
      alert('Debes agregar al menos un ingrediente completo a la receta');
      return;
    }

    onSave(e, {
      nombre,
      porciones_base: parseInt(porcionesBase, 10),
      tipo_comida: tipoComida,
      tiempo_preparacion_min: tiempoPrep ? parseInt(tiempoPrep, 10) : null,
      instrucciones,
      ingredients: validIngredients.map(i => ({
        nombre: i.nombre.trim(),
        cantidad: parseFloat(i.cantidad),
        unidad: i.unidad.trim()
      }))
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{type === 'edit' ? 'Editar Receta' : 'Nueva Receta'}</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nombre de la Receta</label>
              <input
                type="text"
                placeholder="Ej: Pastel de Papa"
                className="form-input"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Porciones Base</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={porcionesBase}
                  onChange={(e) => setPorcionesBase(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo de Comida</label>
                <select
                  className="form-select"
                  value={tipoComida}
                  onChange={(e) => setTipoComida(e.target.value)}
                >
                  <option value="almuerzo">Almuerzo</option>
                  <option value="cena">Cena</option>
                  <option value="ambos">Ambos</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tiempo Prep. (min)</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ej: 30"
                  className="form-input"
                  value={tiempoPrep}
                  onChange={(e) => setTiempoPrep(e.target.value)}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="form-label">Ingredientes</span>
                <button type="button" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={addIngredientRow}>
                  ➕ Agregar Fila
                </button>
              </div>
              
              <div className="nested-ingredients-list">
                {ingredients.map((ing, idx) => (
                  <div className="nested-ingredient-row" key={idx}>
                    <input
                      type="text"
                      placeholder="Ingrediente (ej: papa)"
                      className="form-input"
                      value={ing.nombre}
                      onChange={(e) => handleIngredientChange(idx, 'nombre', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      step="any"
                      min="0.0001"
                      placeholder="Cantidad"
                      className="form-input"
                      value={ing.cantidad}
                      onChange={(e) => handleIngredientChange(idx, 'cantidad', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Unidad (ej: g, kg)"
                      className="form-input"
                      value={ing.unidad}
                      onChange={(e) => handleIngredientChange(idx, 'unidad', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn-icon"
                      style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                      onClick={() => removeIngredientRow(idx)}
                      title="Eliminar fila"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
              <label className="form-label">Instrucciones de Preparación</label>
              <textarea
                rows="5"
                placeholder="1. Lavar los ingredientes...&#10;2. Hervir y cortar..."
                className="form-textarea"
                value={instrucciones}
                onChange={(e) => setInstrucciones(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Receta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecipeFormModal;
