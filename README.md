# React Profesional App

Este proyecto es la base técnica inicializada con Vite + React 19 para el módulo profesional.

## Instalación local

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd react-profesional-app
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

## Ejecución

Para iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo con Vite
- `npm run build` - Genera la build de producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter (Oxlint)

## Tecnologías

- React 19
- Vite 8
- Oxlint
## Auditoría de Renders

### Punto de partida: un "Mega Contexto"

El diseño inicial guardaba todo en un único `AppContext` con el `value` creado en línea:

```jsx
<AppContext.Provider value={{ user, cart, theme, isCartOpen, login, addItem, toggleTheme /* ... */ }}>
```

Con esto, **cualquier** cambio (escribir el nombre, añadir al carrito, cambiar el tema) creaba un objeto nuevo y
React re-renderizaba **todos** los consumidores. Con las React DevTools ("Highlight updates when components render")
se veía cómo, al pulsar "Añadir" en un personaje, se iluminaban el `Header` completo, el `ProfilePanel` y las 20
tarjetas de `CharacterCard`, aunque ninguna de ellas muestra el carrito.

### Cambios aplicados

| Contexto | Archivo | Qué contiene | Optimización |
|---|---|---|---|
| `AuthContext` | `src/context/AuthContext.jsx` | usuario + `login` / `rename` / `logout` (reducer) | `value` en `useMemo([state.user, actions])`; acciones creadas una vez a partir de `dispatch` |
| `CartStateContext` | `src/context/CartContext.jsx` | `items`, `totalItems`, `totalPrice` | `useMemo([items])` |
| `CartActionsContext` | `src/context/CartContext.jsx` | `addItem` / `removeItem` / `clearCart` | `useMemo([])`: referencia estable para siempre |
| `UIContext` | `src/context/UIContext.jsx` | `theme`, `isCartOpen` + toggles | `useMemo([theme, isCartOpen])` |

Además:

- `Header` no consume contextos; cada pieza (`UserBadge`, `CartBadge`, `ThemeToggle`) se suscribe solo a lo que usa.
- `CharacterCard` está envuelto en `memo` y solo lee `useCartActions()`, que nunca cambia.
- Los Providers y `ThemeShell` reciben el contenido como `children`, así que un cambio de estado en ellos no
  re-renderiza ese contenido por sí mismo.

### Resultado: qué dejó de renderizarse

| Acción | Antes (Mega Contexto) | Después |
|---|---|---|
| Añadir un personaje al carrito | Header, UserBadge, ThemeToggle, ProfilePanel, SearchBoard, todas las `CharacterCard` | Solo `CartBadge` y `CartContents` (si el carrito está abierto) |
| Cambiar nombre de usuario | Todo el árbol, incluidas las tarjetas | Solo `UserBadge` y `ProfilePanel` |
| Abrir / cerrar carrito | Todo el árbol | `CartBadge`, `ThemeToggle`, `ThemeShell`, `CartPanel` |
| Escribir en el buscador | `SearchBoard` + todas las tarjetas | Solo `SearchBoard` (las tarjetas están memorizadas) |

**Componentes que dejaron de renderizarse sin necesidad:** `CharacterCard` (las 20 tarjetas, el componente más
pesado por las imágenes), `SearchBoard`, `ProfilePanel`, `Header` y `UserBadge` ante cambios del carrito;
y todo lo que no sea `UserBadge`/`ProfilePanel` ante cambios del usuario.

### Lo que no se optimizó a propósito

El tema (`theme`) cambia raramente y, cuando cambia, sus consumidores tienen que repintarse de todas formas, así que
no se separó en un contexto de estado y otro de acciones: el beneficio no compensaría la complejidad extra.

### Cómo verificarlo

1. `npm run dev` y abre las React DevTools → pestaña **Components** → ⚙️ → activa
   *Highlight updates when components render* (o graba una sesión en la pestaña **Profiler**).
2. Busca un personaje (p. ej. "Rick") y pulsa **Añadir**: solo debe iluminarse el contador del carrito.
3. Alternativa sin DevTools: la consola muestra `[render] NombreComponente: N` en cada render
   (hook `src/hooks/useRenderLog.js`, solo en desarrollo). En modo `StrictMode` el primer montaje se cuenta dos veces.
