import React from 'react';
import RecipeSelect from './RecipeSelect.jsx';

const getTodayName = () => {
  const weekday = new Date().toLocaleDateString('es-AR', { weekday: 'long' }).toLowerCase();
  return weekday
    .replace('miércoles', 'miercoles')
    .replace('sábado', 'sabado')
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // strip accents
};

function MealPlanView({ 
  currentPlan, 
  recipes, 
  handleUpdateEntry, 
  setMealPlanModal,
  allPlans,
  handleSwitchPlan,
  setClonePlanModal,
  handleDeletePlan
}) {
  if (!currentPlan) {
    return (
      <div className="glass-card empty-state" style={{ maxWidth: '500px', margin: '60px auto' }}>
        <div className="empty-state-icon">📅</div>
        <h2>Planificador Semanal Vacío</h2>
        <p>Crea un plan semanal para organizar tus comidas y calcular la lista de compras automáticamente.</p>
        <button className="btn-primary" style={{ marginTop: '12px' }} onClick={() => setMealPlanModal({ isOpen: true })}>
          Crear Mi Primer Plan
        </button>
      </div>
    );
  }

  const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  const meals = ['almuerzo', 'cena'];
  const todayName = getTodayName();

  return (
    <div className="glass-card">
      <div className="plan-header">
        <div className="plan-info">
          <span className="plan-title">{currentPlan.nombre || 'Plan Semanal'}</span>
          <span className="plan-date-badge">
            Inicia: {new Date(currentPlan.fecha_inicio).toLocaleDateString('es-AR', { timeZone: 'UTC' })}
          </span>
        </div>
        
        <div className="plan-selector-container" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {allPlans && allPlans.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Historial:</span>
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: '220px', padding: '8px 12px' }}
                value={currentPlan.id}
                onChange={(e) => handleSwitchPlan(parseInt(e.target.value, 10))}
              >
                {allPlans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre || 'Plan'} ({new Date(p.fecha_inicio).toLocaleDateString('es-AR', { timeZone: 'UTC' })})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button 
            className="btn-secondary" 
            style={{ padding: '8px 14px', fontSize: '13px' }}
            onClick={() => setClonePlanModal({ isOpen: true, planToClone: currentPlan })}
            title="Duplicar este plan para otra semana"
          >
            👥 Duplicar
          </button>

          <button 
            className="btn-icon" 
            style={{ padding: '8px 12px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', background: 'transparent' }}
            onClick={() => handleDeletePlan(currentPlan.id)}
            title="Eliminar este plan"
          >
            🗑️
          </button>

          <button className="btn-primary" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={() => setMealPlanModal({ isOpen: true })}>
            ➕ Nuevo Plan
          </button>
        </div>
      </div>
      
      <div className="plan-grid-wrapper">
        <div className="plan-grid">
          {days.map(dayName => {
            const isToday = dayName === todayName;
            const dayEntries = currentPlan.entries.filter(e => e.dia === dayName);
            
            return (
              <div className={`day-column ${isToday ? 'today-highlight' : ''}`} key={dayName}>
                <div className="day-name" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  {dayName} 
                  {isToday && <span className="today-badge">Hoy</span>}
                </div>
                {meals.map(mealType => {
                  const entry = dayEntries.find(e => e.tipo_comida === mealType) || { id: null, recipe_id: null, comensales: 0 };
                  const isAssigned = !!entry.recipe_id;

                  return (
                    <div className={`meal-slot ${isAssigned ? 'has-recipe' : ''}`} key={mealType}>
                      <div className="meal-badge">{mealType}</div>
                      
                      <RecipeSelect
                        value={entry.recipe_id || ''}
                        onChange={(val) => handleUpdateEntry(entry.id, val, entry.comensales)}
                        recipes={recipes}
                        alignUp={mealType === 'cena'}
                      />

                      {isAssigned && (
                        <div className="meal-diners">
                          <span className="meal-diners-label">Comensales:</span>
                          <div className="meal-diners-control">
                            <button 
                              className="meal-diners-btn" 
                              onClick={() => handleUpdateEntry(entry.id, entry.recipe_id, Math.max(1, entry.comensales - 1))}
                            >
                              -
                            </button>
                            <span className="meal-diners-val">{entry.comensales}</span>
                            <button 
                              className="meal-diners-btn" 
                              onClick={() => handleUpdateEntry(entry.id, entry.recipe_id, entry.comensales + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MealPlanView;
