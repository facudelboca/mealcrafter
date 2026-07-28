import React from 'react';

function ClonePlanModal({ isOpen, onClose, onSubmit, loading, planName }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Duplicar Plan Semanal</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Duplicando "<strong>{planName}</strong>". Se copiarán todas las comidas y comensales.
            </p>
            <div className="form-group">
              <label className="form-label">Nombre del Nuevo Plan</label>
              <input 
                type="text" 
                name="nombre" 
                placeholder="Ej: Semana de Invierno - Copia" 
                className="form-input"
                defaultValue={`${planName} - Copia`}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de Inicio para el nuevo Plan</label>
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
              {loading ? 'Duplicando...' : 'Confirmar Duplicación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClonePlanModal;
