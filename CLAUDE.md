@AGENTS.md

# resto-front

Frontend Next.js de Clubsy: tarjeta del cliente, panel del comercio y panel admin. El contexto general del producto (reglas de negocio, flujos, UX) está en `../CLAUDE.md`; acá va solo lo específico de este repo.

## Comandos

```bash
pnpm dev        # http://localhost:3002 (el 3000 lo usa otro proyecto)
pnpm build
pnpm lint       # ESLint
pnpm typecheck  # next typegen + tsc (los tipos de rutas como LayoutProps los genera Next)
pnpm test       # Vitest (archivos *.test.ts junto al código)
pnpm gen:api    # regenera lib/api/schema.d.ts desde el OpenAPI (necesita la API corriendo en :3001)
```

## Stack y convenciones del repo

- **Next 16** con App Router y Turbopack, **Tailwind 4**. Sin carpeta `src/`: las rutas viven en `app/` y el alias `@/*` apunta a la raíz.
- `next.config.ts` trae `cacheComponents` y `partialPrefetching` activados (vienen de `create-next-app`). Antes de escribir fetching, caché o componentes de servidor, leer la guía correspondiente en `node_modules/next/dist/docs/` (ver `AGENTS.md`).
- **shadcn/ui** con el preset `radix-nova` (primitivas de Radix, paquete `radix-ui`), color base `neutral` e íconos `lucide-react`. Agregar componentes con `pnpm dlx shadcn@latest add <componente>`; quedan en `components/ui/`. `cn` viene del paquete `cn` (reemplaza a clsx + tailwind-merge) y se reexporta desde `lib/utils.ts`.
- **Tema:** tokens de shadcn en `app/globals.css` (variables CSS en `:root`). `primary` es el azul de Clubsy y `brand` (`bg-brand`, `text-brand`) el naranja; el anillo de foco también es naranja. Los colores de cada comercio se aplicarán pisando `--primary` y afines en el contenedor de su tarjeta, no tocando el tema global. Sin modo oscuro: no hay variables `.dark` y la variante `dark:` queda atada a una clase que nunca se aplica.
- **Tipografía:** Geist y Geist Mono con `next/font` (`--font-geist-sans`, `--font-geist-mono`), mapeadas a `font-sans`, `font-heading` y `font-mono`.
- **pnpm** bloquea los scripts de instalación de las dependencias. La lista de permitidos está en `allowBuilds` de `pnpm-workspace.yaml`.

## Organización

- `app/`: rutas finas, solo arman la página. **Cada página pone en su propio `<Suspense>` todo lo que pide datos** (sesión, API, `params`) y deja afuera lo fijo, como el título. El `<Suspense>` del layout no alcanza: al navegar entre secciones el layout no se vuelve a dibujar, y `pnpm dev` avisa "uncached data during prerendering or a navigation" (ver `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`). Las secciones solo del dueño usan `<OwnerOnly>` (`components/panel/owner-only.tsx`) dentro de ese `<Suspense>`.
- `components/ui/`: componentes de shadcn (generados, se tocan lo mínimo). `components/form/`: piezas de formulario reutilizables (`TextField`, `TextareaField`, `ColorField`, `FormAlert`, `SubmitButton`); los campos generan su `id` con `useId`, así dos formularios con campos del mismo nombre conviven en una página. `components/auth/`: lo compartido entre el acceso de staff y el de admin (marco con logo, tarjeta, formulario de credenciales, menú de cuenta con cerrar sesión). `components/<funcionalidad>/`: componentes y esquemas zod de cada funcionalidad (por ejemplo, `components/staff/`, `components/admin/`).
- `components/section-card.tsx`: tarjeta con título y descripción para agrupar cada sección de una página (panel y admin).
- Fechas: `formatDate` de `lib/format.ts`, siempre en hora de Argentina.
- `lib/<funcionalidad>/`: lógica sin UI y testeable (por ejemplo, `lib/staff/access.ts`, `lib/merchants/slug.ts`). Los tipos que usan componentes del navegador van en archivos sin `server-only` (por ejemplo, `lib/admin/types.ts`).
- **Formularios:** `react-hook-form` + `zodResolver` con `TextField`. Las llamadas a la API van por `callApi` (`@/lib/api/call-api`), que devuelve `{ ok, data }` o `{ ok: false, message }` con el mensaje de la API o uno de conexión; el error general se muestra con `form.setError("root")` y `FormAlert`.

## Panel del comercio (staff)

- Rutas en `lib/staff/routes.ts`. `staffNextStep` decide el paso que le toca a la sesión: ingresar → cambiar la contraseña temporal → elegir comercio → panel.
- Las pantallas de acceso (`app/panel/(auth)/`) llaman a `ensureStaffRoute(ruta)` (`lib/staff/session.ts`), que lee `/auth/staff/me` y redirige si a la sesión le toca otro paso. Elegir comercio sigue disponible con el circuito completo, para cambiar de comercio.
- El panel (`app/panel/(dashboard)/`) tiene un layout con barra superior (comercio actual y menú de cuenta), barra lateral en escritorio, barra inferior en el celular y aviso según el estado del comercio. Las páginas obtienen la sesión con `requirePanelSession()` o, si son solo del dueño, `requireOwnerSession()` (un empleado vuelve a Inicio). `getStaffAccount` usa `cache` de React: una sola llamada a la API por carga.
- **Premio** (`/panel/premio`, solo dueño): cada cambio crea una versión nueva de la regla (`POST /panel/reward-rules`) y se muestra el historial. Con el club pausado o finalizado queda en solo lectura. La vista previa de la tarjeta es `StampPreview` (`components/rewards/`).
- Las secciones del menú están en `components/panel/nav-items.ts` y sus rutas en `panelRoutes` (`lib/staff/routes.ts`). Una sección nueva reemplaza su página "Próximamente" (`ComingSoon`).
- Cerrar sesión recarga la página completa (`window.location.assign`) para no dejar estado de la sesión anterior en el navegador.

## Estado conservado entre navegaciones

Con `cacheComponents`, Next no desmonta la página anterior al navegar: la oculta y conserva su estado (`useState`, valores de formularios). Al volver, aparece como estaba. Ver `node_modules/next/dist/docs/01-app/02-guides/preserving-ui-state.md`.

- Después de un envío exitoso, vaciar el formulario (`form.reset()`), sobre todo si tiene contraseñas.
- Estados de "enviando" que quedan colgados al navegar: resetearlos al ocultarse (`useLayoutEffect(() => () => reset(), [])`), como en `MerchantPicker`.
- En pruebas con Playwright, usar selectores que ignoren lo oculto (`getByRole`), porque el DOM de la página anterior sigue presente.

## Panel admin (FullSync)

- `app/admin/(auth)/ingresar` y `app/admin/(dashboard)/`: lista de comercios, alta y detalle (estado, datos y marca, piezas con su QR, dueño). Sesión de admin aparte (cookie `fs_admin`, 12 horas): `requireAdminSession()` en `lib/admin/session.ts`; los datos se piden con `lib/admin/data.ts`.
- Después de cada cambio, `router.refresh()` vuelve a pedir los datos de la página.
- Los cambios de estado que ofrece la UI (`lib/merchants/status.ts`) copian las transiciones de la API; si cambian allá, actualizarlas acá.
- La URL de cada pieza es `${PUBLIC_SITE_URL}/p/<publicCode>` (ver `.env.example`): es la que se graba en el chip NFC y en el QR, así que en producción tiene que ser el dominio definitivo. El QR se genera en el servidor como SVG (`qrcode`, `lib/pieces/qr.ts`).
- La contraseña temporal del dueño se muestra una sola vez y no reaparece al volver a la página.

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
