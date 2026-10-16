import { SearchXIcon } from "lucide-react";
import Image from "next/image";
import icon from "@/public/icon.png";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 border-t-4 border-brand px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand">
        <SearchXIcon className="size-7" />
      </span>
      <h1 className="font-heading text-2xl font-semibold text-primary">No encontramos esta página</h1>
      <p className="max-w-xs text-muted-foreground">Puede que el enlace esté mal escrito o que ya no exista.</p>
      <Image src={icon} alt="Clubsy" className="mt-8 size-8 opacity-60" />
    </main>
  );
}
