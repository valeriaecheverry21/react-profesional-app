import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useRenderLog } from '../hooks/useRenderLog';

// Header no consume ningún contexto: cada hijo se suscribe solo a lo que usa.
export function Header() {
  useRenderLog('Header');
  return (
    <header className="header">
      <strong>Rick & Morty Store</strong>
      <nav className="header-actions">
        <UserBadge />
        <CartBadge />
        <ThemeToggle />
      </nav>
    </header>
  );
}

function UserBadge() {
  useRenderLog('UserBadge');
  const { user } = useAuth();
  return <span>{user ? `Hola, ${user.name}` : 'Invitado'}</span>;
}

function CartBadge() {
  useRenderLog('CartBadge');
  const { totalItems } = useCart();
  const { toggleCart } = useUI();
  return <button onClick={toggleCart}>Carrito ({totalItems})</button>;
}

function ThemeToggle() {
  useRenderLog('ThemeToggle');
  const { theme, toggleTheme } = useUI();
  return <button onClick={toggleTheme}>{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</button>;
}
