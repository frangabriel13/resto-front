"use client";

import { ErrorScreen } from "@/components/errors/error-screen";
import "./globals.css";

// Reemplaza al layout raíz cuando el error es de ahí: arma su propio documento.
export default function GlobalError(props: React.ComponentProps<typeof ErrorScreen>) {
  return (
    <html lang="es-AR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <title>Algo salió mal · Clubsy</title>
        <ErrorScreen {...props} />
      </body>
    </html>
  );
}
