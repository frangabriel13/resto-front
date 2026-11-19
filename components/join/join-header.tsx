import Image from "next/image";
import Link from "next/link";
import { RoundBackIcon, roundBackClass } from "@/components/merchant-page/round-back-link";
import { initials } from "@/lib/text";

export type JoinMerchant = { name: string; logoUrl: string | null };

type Back = { href: string } | { onClick: () => void };

// Sobre la franja del color del comercio: "volver", el logo y el nombre, alineados con la hoja.
export function JoinHeader({ merchant, back }: { merchant: JoinMerchant; back: Back }) {
  return (
    <header className="text-primary-foreground">
      <div className="mx-auto flex w-full max-w-md items-center gap-3 p-4">
        {"href" in back ? (
          <Link href={back.href} aria-label="Volver" className={roundBackClass}>
            <RoundBackIcon />
          </Link>
        ) : (
          <button type="button" onClick={back.onClick} aria-label="Volver" className={roundBackClass}>
            <RoundBackIcon />
          </button>
        )}
        <Logo {...merchant} />
        <p className="flex min-w-0 flex-col">
          <span className="truncate text-[0.9375rem] leading-tight font-semibold">{merchant.name}</span>
          <span className="text-xs text-primary-foreground/85">Club de premios</span>
        </p>
      </div>
    </header>
  );
}

function Logo({ name, logoUrl }: JoinMerchant) {
  if (!logoUrl) {
    return (
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-[0.6875rem] bg-primary-foreground/16 text-sm font-semibold"
      >
        {initials(name)}
      </span>
    );
  }
  return (
    // `unoptimized`: se sirve tal cual desde el bucket de imágenes.
    <Image
      src={logoUrl}
      alt=""
      width={40}
      height={40}
      unoptimized
      loading="eager"
      className="size-10 shrink-0 rounded-[0.6875rem] bg-white object-contain"
    />
  );
}
