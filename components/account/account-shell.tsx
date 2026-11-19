import Image from "next/image";
import { ClubsyCredit } from "@/components/merchant-page/clubsy-credit";
import icon from "@/public/icon.png";

// La única pantalla del cliente que es de Clubsy y no de un comercio: la franja con el azul de Clubsy
// (los colores por defecto del tema) y una hoja blanca, como el resto de las pantallas del cliente.
export function AccountShell({ subtitle, children }: { subtitle: string; children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col bg-primary">
      <header>
        <div className="mx-auto flex w-full max-w-md items-center gap-3 p-4 text-primary-foreground">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[0.6875rem] bg-white">
            <Image src={icon} alt="" className="size-6.5" loading="eager" />
          </span>
          <p className="flex min-w-0 flex-col">
            <span className="text-[0.9375rem] leading-tight font-semibold">Clubsy</span>
            <span className="text-xs text-primary-foreground/85">{subtitle}</span>
          </p>
        </div>
      </header>
      <div className="flex flex-1 flex-col rounded-t-[1.625rem] bg-background">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pt-5">
          {children}
          <footer className="mt-auto flex justify-center border-t border-neutral-100 pt-4 pb-5.5">
            <ClubsyCredit />
          </footer>
        </div>
      </div>
    </main>
  );
}
