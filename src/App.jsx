import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { UIProvider, useUI } from './context/UIContext';
import { Header } from './components/Header';
import { ProfilePanel } from './components/ProfilePanel';
import { CartPanel } from './components/CartPanel';
import { SearchBoard } from './components/SearchBoard';
import './App.css';

// Aplica el tema. Recibe el contenido como children, así que cuando cambia
// el tema React no vuelve a renderizar ese contenido por este motivo.
function ThemeShell({ children }) {
  const { theme } = useUI();
  return <div className={`app theme-${theme}`}>{children}</div>;
}

function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <CartProvider>
          <ThemeShell>
            <Header />
            <ProfilePanel />
            <CartPanel />
            <SearchBoard />
          </ThemeShell>
        </CartProvider>
      </AuthProvider>
    </UIProvider>
  );
}

export default App;
