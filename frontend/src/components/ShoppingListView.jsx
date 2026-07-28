import React from 'react';

function ShoppingListView({ currentPlan, shoppingList, checkedShoppingItems, toggleShoppingItem, fetchShoppingList, setActiveTab }) {
  if (!currentPlan) {
    return (
      <div className="glass-card empty-state" style={{ maxWidth: '500px', margin: '60px auto' }}>
        <div className="empty-state-icon">🛒</div>
        <h2>Sin Plan Seleccionado</h2>
        <p>Por favor crea un plan semanal primero para calcular tu lista de compras.</p>
        <button className="btn-primary" style={{ marginTop: '12px' }} onClick={() => setActiveTab('plan')}>
          Ir a Plan Semanal
        </button>
      </div>
    );
  }

  const hasItems = shoppingList.items.length > 0 || shoppingList.no_convertibles.length > 0;

  return (
    <div className="glass-card">
      <div className="plan-header" style={{ marginBottom: '24px' }}>
        <div className="plan-info">
          <span className="plan-title">Lista de Compras</span>
          <span className="plan-date-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            Plan: {currentPlan.nombre || 'Semana'}
          </span>
        </div>
        <button className="btn-secondary" onClick={() => fetchShoppingList(currentPlan.id)}>
          🔄 Actualizar
        </button>
      </div>

      {!hasItems ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>Tu lista de compras está vacía</h3>
          <p>Asigna recetas a tu plan semanal para ver los ingredientes requeridos.</p>
        </div>
      ) : (
        <div className="shopping-list-container">
          <div>
            <h3 className="shopping-list-title">🥫 Convertibles (Sumados)</h3>
            <div className="shopping-list-items">
              {shoppingList.items.map((item, idx) => {
                const key = `item_${item.ingredient}_${item.unidad}`;
                const isChecked = checkedShoppingItems.includes(key);
                return (
                  <div className={`shopping-item ${isChecked ? 'checked' : ''}`} key={idx}>
                    <input
                      type="checkbox"
                      className="shopping-checkbox"
                      checked={isChecked}
                      onChange={() => toggleShoppingItem(key)}
                    />
                    <span className="shopping-item-name">{item.ingredient}</span>
                    <span className="shopping-item-qty">{item.cantidad} {item.unidad}</span>
                  </div>
                );
              })}
              {shoppingList.items.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic', padding: '12px' }}>
                  No hay ingredientes convertibles.
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="shopping-list-title">⚠️ Sin conversión (Medidas originales)</h3>
            <div className="shopping-list-items">
              {shoppingList.no_convertibles.map((item, idx) => {
                const key = `no_conv_${item.ingredient}_${item.unidad}`;
                const isChecked = checkedShoppingItems.includes(key);
                return (
                  <div className={`shopping-item ${isChecked ? 'checked' : ''}`} key={idx}>
                    <input
                      type="checkbox"
                      className="shopping-checkbox"
                      checked={isChecked}
                      onChange={() => toggleShoppingItem(key)}
                    />
                    <span className="shopping-item-name">{item.ingredient}</span>
                    <span className="shopping-item-qty">{item.cantidad} {item.unidad}</span>
                  </div>
                );
              })}
              {shoppingList.no_convertibles.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic', padding: '12px' }}>
                  No hay ingredientes marcados como no convertibles.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingListView;
