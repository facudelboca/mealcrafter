import React, { useState } from 'react';

function AuthView({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { email, password, nombre };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        onLoginSuccess(data.user);
      } else {
        setError(data.error || 'Ocurrió un error en el servidor');
      }
    } catch (err) {
      console.error('Auth request error:', err);
      setError('Error de conexión con el servidor. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '24px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="plan-title" style={{ fontSize: '28px', marginBottom: '8px' }}>MealCrafter</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Planificá tus menús semanales de forma simple y saludable
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-container)',
          padding: '4px',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--border-glass)'
        }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '8px 16px',
              background: isLogin ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--border-radius-sm)',
              color: isLogin ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: isLogin ? 'var(--shadow-premium)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '8px 16px',
              background: !isLogin ? 'var(--bg-card)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--border-radius-sm)',
              color: !isLogin ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: !isLogin ? 'var(--shadow-premium)' : 'none',
              transition: 'var(--transition-smooth)'
            }}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Registrarse
          </button>
        </div>

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
            justifyContent: 'center',
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre"
                className="form-input"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
              marginTop: '8px'
            }}
          >
            {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthView;
