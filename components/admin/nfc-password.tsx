"use client";

import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { copyText } from "@/lib/clipboard";

type Pending = "show" | "copy" | null;

// Se pide recién al tocar "Mostrar" o "Copiar" (cada pedido queda auditado) y no se guarda en
// ningún lado: al salir de la página se borra del estado.
export function NfcPassword({ merchantId, pieceId }: { merchantId: string; pieceId: string }) {
  const [password, setPassword] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const [pending, setPending] = useState<Pending>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>();

  // `cacheComponents` deja la página oculta en el DOM al navegar.
  useLayoutEffect(
    () => () => {
      setPassword(null);
      setShown(false);
      setPending(null);
    },
    [],
  );

  async function reveal(): Promise<string> {
    if (password) return password;
    const result = await callApi(
      api.POST("/admin/merchants/{merchantId}/pieces/{pieceId}/nfc-password/reveal", {
        params: { path: { merchantId, pieceId } },
      }),
    );
    if (!result.ok) throw new Error(result.message);
    setPassword(result.data.password);
    return result.data.password;
  }

  async function run(action: Exclude<Pending, null>, task: () => Promise<void>) {
    setPending(action);
    setError(undefined);
    try {
      await task();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo obtener la contraseña.");
    } finally {
      setPending(null);
    }
  }

  function toggle() {
    if (shown) {
      setShown(false);
      return;
    }
    void run("show", async () => {
      await reveal();
      setShown(true);
    });
  }

  function copy() {
    void run("copy", async () => {
      await copyText(reveal());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">Contraseña NFC (protege el chip contra escritura)</span>
      <div className="flex flex-wrap items-center gap-2">
        <code
          aria-label={shown ? "Contraseña NFC" : "Contraseña NFC oculta"}
          className="rounded-md bg-muted px-2 py-1.5 font-mono text-sm tracking-widest"
        >
          {shown && password ? password : "••••••••"}
        </code>
        <Button type="button" variant="outline" size="sm" onClick={toggle} disabled={pending !== null}>
          {pending === "show" ? <Spinner /> : shown ? <EyeOffIcon /> : <EyeIcon />}
          {shown ? "Ocultar" : "Mostrar"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={copy} disabled={pending !== null}>
          {pending === "copy" ? <Spinner /> : copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copiada" : "Copiar"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
