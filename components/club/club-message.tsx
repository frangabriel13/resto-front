import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import icon from "@/public/icon.png";

// Pantalla de Clubsy sin datos del club: código inexistente, pieza inactiva, sin sesión, etc.
export function ClubMessage({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 border-t-4 border-brand px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand">
        <Icon className="size-7" />
      </span>
      <h1 className="font-heading text-2xl font-semibold text-primary">{title}</h1>
      <p className="max-w-xs text-muted-foreground">{text}</p>
      {action}
      <Image src={icon} alt="Clubsy" className="mt-8 size-8 opacity-60" />
    </main>
  );
}
