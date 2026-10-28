import { createContext, useContext, useMemo, useReducer } from 'react';

// Estado y acciones van en contextos distintos: los componentes que solo
// añaden productos (las tarjetas) no se re-renderizan cuando cambia el carrito.
const CartStateContext = createContext(null);
const CartActionsContext = createContext(null);

function cartReducer(items, action) {
  switch (action.type) {
    case 'add': {
      const existing = items.find((i) => i.id === action.item.id);
      if (existing) {
        return items.map((i) => (i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...items, { ...action.item, qty: 1 }];
    }
    case 'remove':
      return items.filter((i) => i.id !== action.id);
    case 'clear':
      return [];
    default:
      throw new Error(`Acción desconocida: ${action.type}`);
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const state = useMemo(
    () => ({
      items,
      totalItems: items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: items.reduce((sum, i) => sum + i.qty * i.price, 0),
    }),
    [items]
  );

  const actions = useMemo(
    () => ({
      addItem: (item) => dispatch({ type: 'add', item }),
      removeItem: (id) => dispatch({ type: 'remove', id }),
      clearCart: () => dispatch({ type: 'clear' }),
    }),
    []
  );

  return (
    <CartActionsContext.Provider value={actions}>
      <CartStateContext.Provider value={state}>{children}</CartStateContext.Provider>
    </CartActionsContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartStateContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}

export function useCartActions() {
  const ctx = useContext(CartActionsContext);
  if (!ctx) throw new Error('useCartActions debe usarse dentro de <CartProvider>');
  return ctx;
}
