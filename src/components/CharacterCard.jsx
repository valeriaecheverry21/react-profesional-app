import { memo } from 'react';
import { useCartActions } from '../context/CartContext';
import { useRenderLog } from '../hooks/useRenderLog';

// Precio ficticio derivado del id (la API no tiene precios).
const priceFor = (id) => (id % 20) + 5;

// memo evita re-renders cuando el padre cambia (p. ej. al escribir en el buscador).
// Solo lee las acciones del carrito, que son estables, así que añadir un item
// no vuelve a renderizar ninguna tarjeta.
export const CharacterCard = memo(function CharacterCard({ character }) {
  useRenderLog('CharacterCard');
  const { addItem } = useCartActions();
  const price = priceFor(character.id);

  return (
    <div className="card">
      <img src={character.image} alt={character.name} />
      <div className="card-body">
        <h3>{character.name}</h3>
        <p>
          <strong>Estado:</strong> {character.status}
        </p>
        <p>
          <strong>Especie:</strong> {character.species}
        </p>
        <p>
          <strong>Origen:</strong> {character.origin?.name}
        </p>
        <button onClick={() => addItem({ id: character.id, name: character.name, price })}>
          Añadir (${price})
        </button>
      </div>
    </div>
  );
});
