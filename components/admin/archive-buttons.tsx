"use client";

import { ArchiveIcon, ArchiveRestoreIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { archiveWarning } from "@/lib/admin/archive";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";

type Action = "archive" | "unarchive";

function useArchiveAction(merchantId: string, action: Action) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  // `cacheComponents` deja la página oculta al navegar: que no quede "enviando".
  useLayoutEffect(() => () => setPending(false), []);

  async function run() {
    setPending(true);
    setError(undefined);
    const path = action === "archive" ? "/admin/merchants/{id}/archive" : "/admin/merchants/{id}/unarchive";
    const result = await callApi(api.POST(path, { params: { path: { id: merchantId } } }));
    setPending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.refresh();
  }

  return { pending, error, run };
}

export function ArchiveButton({ merchantId, activePieces }: { merchantId: string; activePieces: number }) {
  const { pending, error, run } = useArchiveAction(merchantId, "archive");
  return (
    <div className="flex flex-col gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="h-10 self-start" disabled={pending}>
            {pending ? <Spinner /> : <ArchiveIcon />}
            Archivar
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Archivar el comercio?</AlertDialogTitle>
            <AlertDialogDescription>{archiveWarning(activePieces)}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={run}>Archivar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function UnarchiveButton({ merchantId }: { merchantId: string }) {
  const { pending, error, run } = useArchiveAction(merchantId, "unarchive");
  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" className="h-10 self-start" disabled={pending} onClick={run}>
        {pending ? <Spinner /> : <ArchiveRestoreIcon />}
        Desarchivar
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
