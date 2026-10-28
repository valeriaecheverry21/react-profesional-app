import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useRenderLog } from '../hooks/useRenderLog';
import { CharacterCard } from './CharacterCard';

const API_BASE = 'https://rickandmortyapi.com/api/character';

export function SearchBoard() {
  useRenderLog('SearchBoard');
  const [query, setQuery] = useState('');
  const [searchUrl, setSearchUrl] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchUrl(`${API_BASE}/?name=${encodeURIComponent(trimmed)}`);
  };

  const { data, status, error } = useFetch(searchUrl);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Buscador Rick & Morty</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar personaje (ej: Rick, Morty, Summer)..."
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            width: '300px',
            marginRight: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Buscar
        </button>
      </form>

      <div style={{ minHeight: '200px' }}>
        {status === 'idle' && (
          <div style={{ textAlign: 'center', color: '#666', padding: '3rem' }}>
            <p>Escribe un nombre y pulsa Buscar para empezar</p>
          </div>
        )}

        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div
              style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #007bff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <p style={{ marginTop: '1rem' }}>Buscando personajes...</p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ color: 'red', padding: '1rem', textAlign: 'center' }}>
            <h2>Error al buscar</h2>
            <p>{error}</p>
            <p>Intenta con otro nombre o verifica tu conexión.</p>
          </div>
        )}

        {status === 'success' && data && (
          <div>
            <h2>
              Resultados para "{query}" ({data.results?.length || 0} encontrados)
            </h2>
            {data.results && data.results.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>
                No se encontraron personajes con ese nombre.
              </p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '1rem',
                }}
              >
                {data.results?.map((character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}