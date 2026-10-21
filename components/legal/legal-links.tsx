import Link from "next/link";
import { cn } from "@/lib/utils";
import { legalRoutes } from "@/lib/legal/document";

export function LegalLinks({ className }: { className?: string }) {
  return (
    <nav aria-label="Legales" className={cn("flex justify-center gap-4 text-xs text-muted-foreground", className)}>
      <Link href={legalRoutes.terms} className="underline-offset-4 hover:underline">
        Términos y condiciones
      </Link>
      <Link href={legalRoutes.privacy} className="underline-offset-4 hover:underline">
        Privacidad
      </Link>
    </nav>
  );
}

// Debajo del botón que crea la cuenta o suma al cliente a un club. Abre en otra
// pestaña para no perder lo que ya cargó en el formulario.
export function LegalConsentNote() {
  const linkClass = "font-medium text-foreground underline underline-offset-4";
  return (
    <p className="text-center text-xs text-muted-foreground">
      Al continuar aceptás los{" "}
      <Link href={legalRoutes.terms} target="_blank" className={linkClass}>
        Términos y condiciones
      </Link>{" "}
      y la{" "}
      <Link href={legalRoutes.privacy} target="_blank" className={linkClass}>
        Política de privacidad
      </Link>
      .
    </p>
  );
}
