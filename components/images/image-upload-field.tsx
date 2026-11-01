"use client";

import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
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
import type { ApiResult } from "@/lib/api/call-api";
import { ImageFileButton } from "./image-file-button";
import { ImagePreview, type ImageVariant } from "./image-preview";

type ImageUploadFieldProps = {
  label: string;
  description: string;
  variant: ImageVariant;
  currentUrl: string | null;
  readOnly: boolean;
  upload: (file: File) => Promise<ApiResult<unknown>>;
  remove: () => Promise<ApiResult<unknown>>;
};

// Se guarda al elegir el archivo: la API sube cada imagen por separado del resto de los datos.
export function ImageUploadField({ label, description, variant, currentUrl, readOnly, upload, remove }: ImageUploadFieldProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  // Lo que se ve hasta que `router.refresh()` trae la URL definitiva.
  const [optimistic, setOptimistic] = useState<{ url: string | null } | null>(null);
  const [shownCurrent, setShownCurrent] = useState(currentUrl);

  if (shownCurrent !== currentUrl) {
    setShownCurrent(currentUrl);
    setOptimistic(null);
  }

  const localUrl = optimistic?.url;
  useEffect(() => {
    if (!localUrl?.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(localUrl);
  }, [localUrl]);

  // `cacheComponents` deja la página oculta al navegar: que no quede "enviando".
  useLayoutEffect(() => () => setPending(false), []);

  async function run(next: { url: string | null }, request: () => Promise<ApiResult<unknown>>) {
    setPending(true);
    setError(undefined);
    setOptimistic(next);
    const result = await request();
    setPending(false);
    if (!result.ok) {
      setOptimistic(null);
      setError(result.message);
      return;
    }
    router.refresh();
  }

  const url = optimistic ? optimistic.url : currentUrl;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      <ImagePreview url={url} alt={label} variant={variant} />
      {!readOnly && (
        <div className="flex flex-wrap gap-2">
          <ImageFileButton
            label={label}
            text={url ? "Cambiar" : "Subir imagen"}
            disabled={pending}
            pending={pending}
            onError={setError}
            onPick={(file) => run({ url: URL.createObjectURL(file) }, () => upload(file))}
          />
          {url && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" disabled={pending}>
                  <Trash2Icon />
                  Sacar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Sacar esta imagen?</AlertDialogTitle>
                  <AlertDialogDescription>Deja de verse enseguida. Para volver a ponerla, hay que subirla de nuevo.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => run({ url: null }, remove)}>Sacar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
      <p className="text-sm text-muted-foreground">{description}</p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
