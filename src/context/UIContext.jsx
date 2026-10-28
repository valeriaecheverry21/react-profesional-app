import { createContext, useContext, useMemo, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [isCartOpen, setCartOpen] = useState(false);

  const value = useMemo(
    () => ({
      theme,
      isCartOpen,
      toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
      toggleCart: () => setCartOpen((open) => !open),
    }),
    [theme, isCartOpen]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI debe usarse dentro de <UIProvider>');
  return ctx;
}
