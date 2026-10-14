@AGENTS.md

# resto-front

Frontend Next.js de FullSync Club: tarjeta del cliente, panel del comercio y panel admin. El contexto general del producto (reglas de negocio, flujos, UX) está en `../CLAUDE.md`; acá va solo lo específico de este repo.

## Comandos

```bash
pnpm dev     # http://localhost:3000
pnpm build
pnpm lint    # ESLint
```

## Stack y convenciones del repo

- **Next 16** con App Router y Turbopack, **Tailwind 4**. Sin carpeta `src/`: las rutas viven en `app/` y el alias `@/*` apunta a la raíz.
- `next.config.ts` trae `cacheComponents` y `partialPrefetching` activados (vienen de `create-next-app`). Antes de escribir fetching, caché o componentes de servidor, leer la guía correspondiente en `node_modules/next/dist/docs/` (ver `AGENTS.md`).
- shadcn/ui todavía no está instalado.
- **pnpm** bloquea los scripts de instalación de las dependencias. La lista de permitidos está en `allowBuilds` de `pnpm-workspace.yaml`.

## Conexión con la API

- La API (`../resto-api`) corre en `http://localhost:3001`.
- El front hace proxy de `/api/*` a la API con `rewrites` de Next, para que las cookies de sesión sean first-party. **Pendiente de configurar.**
- Los tipos de request/response se generan desde el OpenAPI de la API con `openapi-typescript`; no se escriben a mano. **Pendiente:** la API todavía no expone OpenAPI.
- Los esquemas zod de los formularios viven en este repo.
