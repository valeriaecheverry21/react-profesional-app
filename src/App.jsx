import { useState, useEffect } from 'react';
import { getUsers } from './services/api';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const data = await getUsers();
        if (!cancelled) {
          setUsers(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <h1>Cargando usuarios...</h1>;
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '1rem' }}>
        <h1>Error al cargar usuarios</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Usuarios ({users.length})</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map((user) => (
          <li
            key={user.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '0.5rem',
              background: '#fafafa',
            }}
          >
            <strong>{user.name}</strong> ({user.username})<br />
            <small>Email: {user.email}</small><br />
            <small>Tel: {user.phone}</small><br />
            <small>Web: {user.website}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;