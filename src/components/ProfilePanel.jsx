import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRenderLog } from '../hooks/useRenderLog';

export function ProfilePanel() {
  useRenderLog('ProfilePanel');
  const { user, login, rename, logout } = useAuth();
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (user) rename(trimmed);
    else login(trimmed);
    setName('');
  };

  return (
    <section className="panel">
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={user ? 'Nuevo nombre' : 'Tu nombre'}
        />
        <button type="submit">{user ? 'Cambiar nombre' : 'Iniciar sesión'}</button>
        {user && (
          <button type="button" onClick={logout}>
            Cerrar sesión
          </button>
        )}
      </form>
    </section>
  );
}
