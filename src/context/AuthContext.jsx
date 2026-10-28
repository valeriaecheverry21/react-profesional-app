import { createContext, useContext, useMemo, useReducer } from 'react';

const AuthContext = createContext(null);

const initialState = { user: null };

function authReducer(state, action) {
  switch (action.type) {
    case 'login':
      return { user: { name: action.name } };
    case 'rename':
      return state.user ? { user: { ...state.user, name: action.name } } : state;
    case 'logout':
      return initialState;
    default:
      throw new Error(`Acción desconocida: ${action.type}`);
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // dispatch es estable, así que las acciones se crean una sola vez.
  const actions = useMemo(
    () => ({
      login: (name) => dispatch({ type: 'login', name }),
      rename: (name) => dispatch({ type: 'rename', name }),
      logout: () => dispatch({ type: 'logout' }),
    }),
    []
  );

  // El value solo cambia cuando cambia el usuario.
  const value = useMemo(() => ({ user: state.user, ...actions }), [state.user, actions]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
