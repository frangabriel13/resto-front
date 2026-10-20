import { CircleCheckIcon } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// La contraseña temporal se muestra una sola vez. Sin contraseña: la persona ya tenía cuenta.
export function TemporaryPasswordNotice({
  title,
  password,
  existingAccountText = "Ya tenía cuenta en Clubsy: entra con su contraseña de siempre.",
}: {
  title: string;
  password: string | null;
  existingAccountText?: string;
}) {
  return (
    <Alert className="border-emerald-200 bg-emerald-50">
      <CircleCheckIcon className="text-emerald-700" />
      <AlertTitle className="break-words">{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        {password ? (
          <>
            <p>Pasale esta contraseña temporal. La va a tener que cambiar al entrar. No se vuelve a mostrar.</p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded-md border bg-background px-2 py-1.5 font-mono text-base text-foreground">
                {password}
              </code>
              <CopyButton value={password} label="Copiar contraseña" />
            </div>
          </>
        ) : (
          <p>{existingAccountText}</p>
        )}
      </AlertDescription>
    </Alert>
  );
}
