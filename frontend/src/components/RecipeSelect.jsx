import React, { useState, useRef, useEffect } from 'react';

function RecipeSelect({ value, onChange, recipes, alignUp }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedRecipe = recipes.find(r => r.id === parseInt(value, 10));

  const filteredRecipes = recipes.filter(r => 
    r.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="recipe-select-container" ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Button */}
      <div 
        className="meal-recipe-select" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        <span style={{ 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
          lineHeight: '1.2',
          textAlign: 'left',
          flex: 1,
          marginRight: '4px'
        }}>
          {selectedRecipe ? selectedRecipe.nombre : '-- Vacío --'}
        </span>
        <span style={{ fontSize: '10px', opacity: 0.7, flexShrink: 0 }}>▼</span>
      </div>

      {/* Floating Dropdown List */}
      {isOpen && (
        <div 
          className="glass-card" 
          style={{ 
            position: 'absolute',
            [alignUp ? 'bottom' : 'top']: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 100,
            padding: '8px',
            background: 'var(--bg-card)',
            maxHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: 'var(--shadow-premium)',
            borderColor: 'var(--primary)'
          }}
        >
          {/* Search Box */}
          <input 
            type="text" 
            placeholder="🔍 Buscar receta..." 
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()} // Prevent closing dropdown on clicking input
            autoFocus
            style={{ 
              padding: '6px 10px', 
              fontSize: '13px',
              background: 'var(--bg-app)',
              color: 'var(--text-primary)'
            }}
          />

          {/* Options List */}
          <div 
            className="options-scroll-list" 
            style={{ 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '2px',
              flex: 1
            }}
          >
            {/* Unassign option */}
            <div 
              className="catalog-item"
              onClick={() => {
                onChange('');
                setIsOpen(false);
                setSearchTerm('');
              }}
              style={{ 
                padding: '8px 10px', 
                fontSize: '13px',
                borderRadius: '6px',
                border: 'none',
                background: !value ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
              }}
            >
              -- Vacío --
            </div>

            {filteredRecipes.map(r => (
              <div 
                className="catalog-item"
                key={r.id}
                onClick={() => {
                  onChange(r.id.toString());
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                style={{ 
                  padding: '8px 10px', 
                  fontSize: '13px',
                  borderRadius: '6px',
                  border: 'none',
                  textTransform: 'none',
                  background: parseInt(value, 10) === r.id ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
                }}
              >
                {r.nombre}
              </div>
            ))}

            {filteredRecipes.length === 0 && (
              <div style={{ padding: '8px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                No hay resultados
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeSelect;
