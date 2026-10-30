"use client";

import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { exportFilename } from "@/lib/customers/export";
import { downloadBlob } from "@/lib/download";

// El mismo CSV que baja el dueño, para guardarlo antes de borrar (queda auditado).
export function ExportMerchantCustomers({ merchantId }: { merchantId: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function exportCsv() {
    setPending(true);
    setError(undefined);
    const result = await callApi(
      api.GET("/admin/merchants/{id}/export", { params: { path: { id: merchantId } }, parseAs: "blob" }),
    );
    setPending(false);
    if (!result.ok) return setError(result.message);
    downloadBlob(result.data, exportFilename(result.response?.headers.get("content-disposition") ?? null));
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" variant="outline" className="h-10 self-start" disabled={pending} onClick={exportCsv}>
        {pending ? <Spinner /> : <DownloadIcon />}
        Descargar clientes (CSV)
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
