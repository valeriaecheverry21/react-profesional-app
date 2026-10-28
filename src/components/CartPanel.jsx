import { useCart, useCartActions } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useRenderLog } from '../hooks/useRenderLog';

export function CartPanel() {
  useRenderLog('CartPanel');
  const { isCartOpen } = useUI();
  if (!isCartOpen) return null;
  return <CartContents />;
}

function CartContents() {
  useRenderLog('CartContents');
  const { items, totalPrice } = useCart();
  const { removeItem, clearCart } = useCartActions();

  return (
    <aside className="panel">
      <h2>Carrito</h2>
      {items.length === 0 ? (
        <p>Está vacío.</p>
      ) : (
        <>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                {item.name} × {item.qty} — ${item.price * item.qty}{' '}
                <button onClick={() => removeItem(item.id)}>Quitar</button>
              </li>
            ))}
          </ul>
          <p>
            <strong>Total: ${totalPrice}</strong> <button onClick={clearCart}>Vaciar</button>
          </p>
        </>
      )}
    </aside>
  );
}
