@AGENTS.md

# resto-front

Frontend Next.js de FullSync Club: tarjeta del cliente, panel del comercio y panel admin. El contexto general del producto (reglas de negocio, flujos, UX) está en `../CLAUDE.md`; acá va solo lo específico de este repo.

## Comandos

```bash
pnpm dev        # http://localhost:3000
pnpm build
pnpm lint       # ESLint
pnpm typecheck  # next typegen + tsc (los tipos de rutas como LayoutProps los genera Next)
pnpm gen:api    # regenera lib/api/schema.d.ts desde el OpenAPI (necesita la API corriendo en :3001)
```

## Stack y convenciones del repo

- **Next 16** con App Router y Turbopack, **Tailwind 4**. Sin carpeta `src/`: las rutas viven en `app/` y el alias `@/*` apunta a la raíz.
- `next.config.ts` trae `cacheComponents` y `partialPrefetching` activados (vienen de `create-next-app`). Antes de escribir fetching, caché o componentes de servidor, leer la guía correspondiente en `node_modules/next/dist/docs/` (ver `AGENTS.md`).
- **shadcn/ui** con el preset `base-nova` (primitivas de Base UI, no Radix), color base `neutral` e íconos `lucide-react`. Agregar componentes con `pnpm dlx shadcn@latest add <componente>`; quedan en `components/ui/`. `cn` viene del paquete `cn` (reemplaza a clsx + tailwind-merge) y se reexporta desde `lib/utils.ts`.
- **Tema:** tokens de shadcn en `app/globals.css` (variables CSS en `:root`). Los colores de cada comercio se aplicarán pisando `--primary` y afines en el contenedor de su tarjeta, no tocando el tema global. Sin modo oscuro por ahora (el bloque `.dark` queda sin usar).
- **Tipografía:** Geist y Geist Mono con `next/font` (`--font-geist-sans`, `--font-geist-mono`), mapeadas a `font-sans`, `font-heading` y `font-mono`.
- **pnpm** bloquea los scripts de instalación de las dependencias. La lista de permitidos está en `allowBuilds` de `pnpm-workspace.yaml`.

## Conexión con la API

- La API (`../resto-api`) corre en `http://localhost:3001`.
- El front hace proxy de `/api/*` a la API con `rewrites` de Next (`next.config.ts`), para que las cookies de sesión sean first-party: `/api/auth/staff/login` → `${API_URL}/auth/staff/login`. La API no lleva prefijo `/api`.
- `API_URL` (ver `.env.example`): el proxy la lee al hacer el build y el cliente del servidor al correr. Si falta, se usa `http://localhost:3001`. En el deploy hay que setearla.
- Los tipos de request/response se generan desde el OpenAPI de la API (`/docs/json`) con `pnpm gen:api` en `lib/api/schema.d.ts`; no se escriben a mano. El archivo generado se commitea (el build no necesita la API). Cuando cambia un endpoint, regenerarlo.
- **Clientes** (`openapi-fetch`, tipados con ese schema):
  - `api` de `@/lib/api/client`: para Client Components. Pasa por el proxy `/api`, así las cookies viajan solas y los `Set-Cookie` llegan al navegador.
  - `getServerApi()` de `@/lib/api/server`: para Server Components y Server Functions. Va directo a `API_URL` y reenvía las cookies de la request. Se llama por request (lee `cookies()` primero, como pide `cacheComponents`; usarlo dentro de `<Suspense>`). Los `Set-Cookie` que responda la API **no** llegan al navegador: login, logout y todo lo que toque la sesión va por `api`.
  - Los errores llegan como `ApiError` (`@/lib/api/errors`); qué mostrar se decide por `code`. `isApiError()` descarta respuestas que no vienen de la API (por ejemplo, un 502 con la API caída).
- Los esquemas zod de los formularios viven en este repo.
