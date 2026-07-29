import React from 'react';

const DEPARTMENT_MAP = {
  // Verdulería
  'papa': 'Verdulería 🥔',
  'cebolla': 'Verdulería 🥔',
  'ajo': 'Verdulería 🥔',
  'zanahoria': 'Verdulería 🥔',
  'tomate': 'Verdulería 🥔',
  'calabaza': 'Verdulería 🥔',
  'zapallito redondo': 'Verdulería 🥔',
  'espinaca': 'Verdulería 🥔',
  'lechuga': 'Verdulería 🥔',
  
  // Carnicería
  'carne vacuna': 'Carnicería 🥩',
  'asado de tira': 'Carnicería 🥩',
  'pollo troceado': 'Carnicería 🥩',
  'pechuga de pollo': 'Carnicería 🥩',
  'colita de cuadril': 'Carnicería 🥩',
  'chorizo colorado': 'Carnicería 🥩',
  'panceta': 'Carnicería 🥩',
  
  // Lácteos y Quesos
  'leche': 'Fiambrería y Lácteos 🧀',
  'crema de leche': 'Fiambrería y Lácteos 🧀',
  'queso cremoso': 'Fiambrería y Lácteos 🧀',
  'queso muzzarella': 'Fiambrería y Lácteos 🧀',
  'queso rallado': 'Fiambrería y Lácteos 🧀',
  'manteca': 'Fiambrería y Lácteos 🧀',
  'ricota': 'Fiambrería y Lácteos 🧀',
  'jamón cocido': 'Fiambrería y Lácteos 🧀',
  
  // Almacén y Secos
  'arroz': 'Almacén y Secos 🍝',
  'lentejas': 'Almacén y Secos 🍝',
  'harina de maíz': 'Almacén y Secos 🍝',
  'harina de trigo': 'Almacén y Secos 🍝',
  'tomate puré': 'Almacén y Secos 🍝',
  'salsa de tomate': 'Almacén y Secos 🍝',
  'sal': 'Almacén y Secos 🍝',
  'agua': 'Almacén y Secos 🍝',
  
  // Panadería y Masas
  'tapas de empanada': 'Panadería y Masas 🍞',
  'tapas de tarta': 'Panadería y Masas 🍞',
  'pan rallado': 'Panadería y Masas 🍞',
  'huevo': 'Granja 🥚',
};

const getDepartment = (name) => {
  const norm = name.trim().toLowerCase();
  return DEPARTMENT_MAP[norm] || 'Otros 🛒';
};

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

  // Grouping function
  const groupItems = (itemsList) => {
    const groups = {};
    itemsList.forEach(item => {
      const dept = getDepartment(item.ingredient);
      if (!groups[dept]) groups[dept] = [];
      groups[dept].push(item);
    });
    return groups;
  };

  const groupedConvertibles = groupItems(shoppingList.items);
  const groupedNoConvertibles = groupItems(shoppingList.no_convertibles);

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
          {/* Section: Convertibles */}
          <div>
            <h3 className="shopping-list-title">🥫 Convertibles (Agrupados por Sector)</h3>
            <div className="shopping-list-departments" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              {Object.keys(groupedConvertibles).map(dept => (
                <div key={dept} className="dept-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary)', marginBottom: '8px', borderBottom: '1px dashed var(--border-glass)', paddingBottom: '4px' }}>
                    {dept}
                  </h4>
                  <div className="shopping-list-items" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {groupedConvertibles[dept].map((item, idx) => {
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
                          <span className="shopping-item-name" style={{ textTransform: 'capitalize' }}>{item.ingredient}</span>
                          <span className="shopping-item-qty">{item.cantidad} {item.unidad}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {shoppingList.items.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic', padding: '12px' }}>
                  No hay ingredientes convertibles.
                </div>
              )}
            </div>
          </div>

          {/* Section: Non-Convertibles */}
          <div>
            <h3 className="shopping-list-title">⚠️ Sin conversión (Por Sector)</h3>
            <div className="shopping-list-departments" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              {Object.keys(groupedNoConvertibles).map(dept => (
                <div key={dept} className="dept-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b', marginBottom: '8px', borderBottom: '1px dashed var(--border-glass)', paddingBottom: '4px' }}>
                    {dept}
                  </h4>
                  <div className="shopping-list-items" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {groupedNoConvertibles[dept].map((item, idx) => {
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
                          <span className="shopping-item-name" style={{ textTransform: 'capitalize' }}>{item.ingredient}</span>
                          <span className="shopping-item-qty">{item.cantidad} {item.unidad}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
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
