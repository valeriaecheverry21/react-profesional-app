import { useEffect } from 'react';

// Cuenta en consola cada commit del componente. Sirve para verificar la
// auditoría sin DevTools. En StrictMode el montaje se cuenta dos veces.
export function useRenderLog(name) {
  useEffect(() => {
    if (import.meta.env.DEV) console.count(`[render] ${name}`);
  });
}
