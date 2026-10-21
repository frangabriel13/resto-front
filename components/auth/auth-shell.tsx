import Image from "next/image";
import { LegalLinks } from "@/components/legal/legal-links";
import logo from "@/public/logo.png";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center border-t-4 border-brand px-4 pt-6 pb-10 sm:justify-center">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Image src={logo} alt="Clubsy" loading="eager" className="mx-auto h-auto w-40" />
        {children}
        <LegalLinks className="mt-6" />
      </div>
    </main>
  );
}
