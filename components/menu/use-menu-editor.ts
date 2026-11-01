"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import type { ApiResult } from "@/lib/api/call-api";
import { adminMenuClient, panelMenuClient, type MenuClient } from "@/lib/menu/client";
import type { Menu } from "@/lib/menu/types";

type Request = (client: MenuClient) => Promise<ApiResult<Menu>>;

export type MenuEditorState = ReturnType<typeof useMenuEditor>;

// Cada cambio devuelve la carta entera: se muestra esa, sin volver a pedir la página.
export function useMenuEditor(initial: Menu, merchantId: string | undefined, readOnly: boolean) {
  const client = useMemo(() => (merchantId ? adminMenuClient(merchantId) : panelMenuClient), [merchantId]);
  const [menu, setMenu] = useState(initial);
  const [shownInitial, setShownInitial] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  if (shownInitial !== initial) {
    setShownInitial(initial);
    setMenu(initial);
  }

  // `cacheComponents` deja la página oculta al navegar: que no quede "enviando".
  useLayoutEffect(() => () => setPending(false), []);

  // Para los botones de cada fila: el error se muestra en el aviso general.
  async function run(request: Request) {
    setPending(true);
    setError(undefined);
    const result = await request(client);
    setPending(false);
    if (result.ok) setMenu(result.data);
    else setError(result.message);
  }

  // Para los diálogos: el error lo muestra el formulario.
  async function save(request: Request) {
    setError(undefined);
    const result = await request(client);
    if (result.ok) setMenu(result.data);
    return result;
  }

  return { menu, pending, error, readOnly, run, save };
}
