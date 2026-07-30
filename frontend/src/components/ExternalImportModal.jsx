import React, { useState } from 'react';

function ExternalImportModal({ isOpen, onClose, onImportSuccess }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [importingId, setImportingId] = useState(null);
  const [previewRecipe, setPreviewRecipe] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const API_URL = import.meta.env.VITE_API_URL || '';

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setSuccessMsg('');
    setResults([]);
    setPreviewRecipe(null);

    try {
      const res = await fetch(`${API_URL}/api/external/search?q=${encodeURIComponent(query)}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data);
        if (data.length === 0) {
          setError('No se encontraron recetas en la web para esa búsqueda.');
        }
      } else {
        setError(data.error || 'Error al buscar recetas externas');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión al servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetail = async (externalId) => {
    setLoadingDetail(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${API_URL}/api/external/detail/${externalId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setPreviewRecipe({ ...data, idMeal: externalId });
      } else {
        setError(data.error || 'Error al cargar el detalle de la receta');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión al servidor.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleImport = async (externalId) => {
    setImportingId(externalId);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${API_URL}/api/external/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ externalId }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(`"${data.nombre}" importada con éxito!`);
        // Remove imported item from search list
        setResults(prev => prev.filter(item => item.id !== externalId));
        setPreviewRecipe(null);
        // Callback to refresh local catalog
        if (onImportSuccess) onImportSuccess(data);
      } else {
        setError(data.error || 'Error al importar la receta.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor.');
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '750px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', gap: '20px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            Importador de Recetas Web
          </h2>
          <button className="btn-icon" onClick={onClose} style={{ border: 'none', background: 'transparent' }} title="Cerrar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              padding: '12px 16px',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '13px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#34d399',
              padding: '12px 16px',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '13px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOADING PREVIEW SPINNER */}
          {loadingDetail && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: '12px', flex: 1 }}>
              <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Obteniendo y traduciendo detalles al español...</span>
            </div>
          )}

          {/* VIEW 1: DETAILED PREVIEW */}
          {!loadingDetail && previewRecipe && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.25s ease' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setPreviewRecipe(null)}
                style={{ width: 'fit-content', padding: '6px 12px', fontSize: '12px' }}
              >
                ← Volver a resultados
              </button>
              
              <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-container)' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {previewRecipe.nombre}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Categoría: {previewRecipe.tipo_comida} | Preparación: {previewRecipe.tiempo_preparacion_min} min | {previewRecipe.porciones_base} porciones
                  </span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-glass)' }} />

                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px' }}>
                    Ingredientes Traducidos:
                  </h4>
                  <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', paddingLeft: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {previewRecipe.ingredients.map((ing, idx) => (
                      <li key={idx}>
                        <strong style={{ color: 'var(--primary-color)' }}>{ing.cantidad} {ing.unidad}</strong> de {ing.nombre}
                      </li>
                    ))}
                  </ul>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-glass)' }} />

                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px' }}>
                    Instrucciones en Español:
                  </h4>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {previewRecipe.instrucciones}
                  </div>
                </div>

                <button
                  className="btn-primary"
                  style={{ marginTop: '10px', height: '42px', justifyContent: 'center', fontWeight: '600' }}
                  onClick={() => handleImport(previewRecipe.idMeal)}
                  disabled={importingId !== null}
                >
                  {importingId ? 'Importando receta...' : 'Importar al Catálogo'}
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: SEARCH RESULTS */}
          {!loadingDetail && !previewRecipe && (
            <>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Busca en la base de datos pública TheMealDB para previsualizar e importar recetas con un solo clic. ¡Podés buscar en español!
              </p>

              <form onSubmit={handleSearch} className="search-bar-container" style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                <div className="search-input-wrapper" style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Ej: pollo, carne, tarta, fideos, pasta..."
                    className="form-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={loading} style={{ height: '40px', padding: '10px 20px' }}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </button>
              </form>

              {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: '12px' }}>
                  <div className="spinner" style={{ width: '30px', height: '30px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Buscando recetas...</span>
                </div>
              )}

              {results.length > 0 && (
                <div className="external-recipes-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '16px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  paddingRight: '4px'
                }}>
                  {results.map(meal => (
                    <div className="glass-card" key={meal.id} style={{
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      background: 'var(--bg-container)',
                      borderRadius: 'var(--border-radius-md)'
                    }}>
                      {meal.imagen && (
                        <img
                          src={meal.imagen}
                          alt={meal.nombre}
                          style={{
                            width: '100%',
                            height: '110px',
                            objectFit: 'cover',
                            borderRadius: 'var(--border-radius-sm)',
                            border: '1px solid var(--border-glass)'
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px', lineBreak: 'anywhere' }}>
                          {meal.nombre}
                        </h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {meal.categoria} | {meal.origen}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn-secondary"
                          style={{ flex: 1, padding: '6px', fontSize: '11px', height: '30px', justifyContent: 'center' }}
                          onClick={() => handleShowDetail(meal.id)}
                        >
                          Ver Detalle
                        </button>
                        <button
                          className="btn-primary"
                          style={{ flex: 1, padding: '6px', fontSize: '11px', height: '30px', justifyContent: 'center' }}
                          onClick={() => handleImport(meal.id)}
                          disabled={importingId !== null}
                        >
                          {importingId === meal.id ? '...' : 'Importar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExternalImportModal;
