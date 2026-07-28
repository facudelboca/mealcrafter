import React, { useState, useRef, useEffect } from 'react';

function RecipeSelect({ value, onChange, recipes }) {
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
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          maxWidth: '85%'
        }}>
          {selectedRecipe ? selectedRecipe.nombre : '-- Vacío --'}
        </span>
        <span style={{ fontSize: '10px', opacity: 0.7 }}>▼</span>
      </div>

      {/* Floating Dropdown List */}
      {isOpen && (
        <div 
          className="glass-card" 
          style={{ 
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 100,
            padding: '8px',
            background: '#1f2937',
            maxHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.6)',
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
              background: '#111827'
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
