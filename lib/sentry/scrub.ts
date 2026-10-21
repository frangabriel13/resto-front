import type { Breadcrumb, ErrorEvent } from "@sentry/nextjs";

const allowedHeaders = new Set(["user-agent", "content-type"]);

// En la query viajan el token de restablecer la contraseña, los teléfonos que
// se buscan en el panel y la ruta de vuelta del ingreso.
export function stripQuery(url: string): string {
  return url.split(/[?#]/)[0];
}

// Segunda capa, por si algo se escapa de `dataCollection`.
export function scrubEvent(event: ErrorEvent): ErrorEvent {
  const { request, contexts } = event;
  if (request) {
    delete request.cookies;
    delete request.data;
    delete request.query_string;
    if (request.url) request.url = stripQuery(request.url);
    if (request.headers) {
      for (const name of Object.keys(request.headers)) {
        if (!allowedHeaders.has(name.toLowerCase())) delete request.headers[name];
      }
    }
  }
  // captureRequestError guarda la ruta pedida con su query.
  const nextjs = contexts?.nextjs;
  if (typeof nextjs?.request_path === "string") nextjs.request_path = stripQuery(nextjs.request_path);
  return event;
}

// Los logs de consola pueden traer datos de la pantalla; de los pedidos y las
// navegaciones se guarda solo la ruta.
export function scrubBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb | null {
  if (breadcrumb.category === "console") return null;
  const { data } = breadcrumb;
  if (data) {
    for (const key of ["url", "from", "to"]) {
      if (typeof data[key] === "string") data[key] = stripQuery(data[key]);
    }
  }
  return breadcrumb;
}
