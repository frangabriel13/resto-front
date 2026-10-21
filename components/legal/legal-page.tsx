import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FileWarningIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate } from "@/lib/format";
import { legalEntity, legalEntityLabels, legalStatus, missingEntityFields } from "@/lib/legal/document";
import logo from "@/public/logoLateral.png";
import { LegalLinks } from "./legal-links";

export function legalMetadata(title: string): Metadata {
  return { title, robots: legalStatus.draft ? { index: false, follow: false } : undefined };
}

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  const missing = missingEntityFields();
  return (
    <main className="flex flex-1 flex-col border-t-4 border-brand">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
        <Link href="/" aria-label="Clubsy" className="self-start">
          <Image src={logo} alt="Clubsy" loading="eager" className="h-auto w-32" />
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold text-primary">{title}</h1>
          {legalStatus.updatedAt && (
            <p className="text-sm text-muted-foreground">Última actualización: {formatDate(`${legalStatus.updatedAt}T12:00:00-03:00`)}</p>
          )}
        </div>
        {legalStatus.draft && (
          <Alert className="border-brand/40 bg-brand/10">
            <FileWarningIcon className="text-brand" />
            <AlertTitle>Borrador pendiente de revisión legal</AlertTitle>
            <AlertDescription>
              Este texto todavía no fue aprobado y puede cambiar.
              {missing.length > 0 && ` Falta completar: ${missing.join(", ")}.`}
            </AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col gap-8">{children}</div>
        <LegalLinks className="mt-4 justify-start" />
      </div>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 text-[0.95rem] leading-relaxed [&_li]:pl-1 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
      <h2 className="font-heading text-xl font-semibold text-primary">{title}</h2>
      {children}
    </section>
  );
}

// Lo que todavía tiene que definir o completar quien apruebe los textos.
export function Pending({ children }: { children: React.ReactNode }) {
  return <mark className="rounded bg-brand/15 px-1 text-foreground">[A definir: {children}]</mark>;
}

export function EntityField({ field }: { field: keyof typeof legalEntity }) {
  return legalEntity[field] ?? <Pending>{legalEntityLabels[field]}</Pending>;
}
