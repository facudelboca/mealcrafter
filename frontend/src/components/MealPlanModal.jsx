import React from 'react';

function MealPlanModal({ isOpen, onClose, onSubmit, loading }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Crear Plan Semanal</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Nombre del Plan (Opcional)</label>
              <input 
                type="text" 
                name="nombre" 
                placeholder="Ej: Semana de Invierno, Dieta Keto" 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de Inicio (Lunes sugerido)</label>
              <input 
                type="date" 
                name="fecha_inicio" 
                className="form-input" 
                required 
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Plan Semanal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MealPlanModal;
