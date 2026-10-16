"use client";

import { CameraOffIcon, CircleCheckIcon, CircleXIcon, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { panelRoutes } from "@/lib/staff/routes";
import type { StampResult } from "@/lib/stamps/types";
import type { CameraProblem } from "./qr-camera";

function ResultView({
  icon: Icon,
  tone,
  title,
  text,
  children,
}: {
  icon: LucideIcon;
  tone: "ok" | "problem";
  title: string;
  text?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border px-5 py-8 text-center">
      <Icon className={tone === "ok" ? "size-14 text-emerald-600" : "size-14 text-destructive"} />
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-semibold text-primary">{title}</h2>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      <div className="flex w-full flex-col gap-2">{children}</div>
    </div>
  );
}

export function DoneView({ result, onNext }: { result: StampResult; onNext: () => void }) {
  const { membership, replayed } = result;
  return (
    <ResultView
      icon={CircleCheckIcon}
      tone="ok"
      title={`Sello sumado a ${membership.customer.name ?? "el cliente"}`}
      text={
        membership.canRedeem
          ? "¡Completó la tarjeta! Ya puede canjear su premio."
          : `Tiene ${membership.balance} de ${membership.stampsRequired}.`
      }
    >
      {replayed && (
        <p className="text-sm text-muted-foreground">
          Este sello ya estaba registrado: no se sumó otro.
        </p>
      )}
      <Button size="lg" className="h-14 text-lg" autoFocus onClick={onNext}>
        Escanear otro
      </Button>
    </ResultView>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <ResultView icon={CircleXIcon} tone="problem" title="No se pudo sumar el sello" text={message}>
      <Button size="lg" className="h-12" autoFocus onClick={onRetry}>
        Escanear de nuevo
      </Button>
    </ResultView>
  );
}

const cameraProblems: Record<CameraProblem, { title: string; text: string }> = {
  permission: {
    title: "Sin permiso para usar la cámara",
    text: "Habilitá la cámara para este sitio en la configuración del navegador y volvé a intentar.",
  },
  "no-camera": {
    title: "No encontramos una cámara",
    text: "Este dispositivo no tiene una cámara disponible.",
  },
  insecure: {
    title: "La cámara no está disponible",
    text: "El navegador solo permite usar la cámara en una conexión segura (https).",
  },
  unavailable: {
    title: "No pudimos abrir la cámara",
    text: "Puede que otra aplicación la esté usando. Cerrala y volvé a intentar.",
  },
};

export function CameraProblemView({ problem, onRetry }: { problem: CameraProblem; onRetry: () => void }) {
  return (
    <ResultView icon={CameraOffIcon} tone="problem" {...cameraProblems[problem]}>
      <Button size="lg" className="h-12" onClick={onRetry}>
        Reintentar
      </Button>
      <Button asChild variant="outline" size="lg" className="h-12">
        <Link href={panelRoutes.customers}>Buscar al cliente por teléfono</Link>
      </Button>
    </ResultView>
  );
}
