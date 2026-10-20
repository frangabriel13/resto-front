"use client";

import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { FormAlert } from "@/components/form/form-alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { exportFilename } from "@/lib/customers/export";

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement("a"), { href: url, download: filename });
  link.click();
  URL.revokeObjectURL(url);
}

// Se baja con fetch y no con un link: si falla (por ejemplo, la sesión venció), se ve el error
// en vez de descargar un archivo roto.
export function ExportCustomers() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function exportCsv() {
    setPending(true);
    setError(undefined);
    const result = await callApi(api.GET("/panel/export", { parseAs: "blob" }));
    setPending(false);
    if (!result.ok) return setError(result.message);
    download(result.data, exportFilename(result.response?.headers.get("content-disposition") ?? null));
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Planilla con todos tus clientes, sus sellos y canjes. La columna <strong>“Acepta comunicaciones”</strong> dice
        quiénes aceptaron recibir novedades: escribiles solo a ellos.
      </p>
      <FormAlert message={error} />
      <Button variant="outline" className="h-11 sm:w-fit" disabled={pending} onClick={exportCsv}>
        {pending ? <Spinner /> : <DownloadIcon />}
        Descargar clientes (CSV)
      </Button>
    </div>
  );
}
