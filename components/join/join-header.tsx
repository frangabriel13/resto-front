import Link from "next/link";
import { MerchantIdentity, type IdentityMerchant } from "@/components/club/merchant-identity";
import { RoundBackIcon, roundBackClass } from "@/components/merchant-page/round-back-link";

export type JoinMerchant = IdentityMerchant;

type Back = { href: string } | { onClick: () => void };

// Sobre la franja del color del comercio: "volver", el logo y el nombre, alineados con la hoja.
export function JoinHeader({ merchant, back }: { merchant: JoinMerchant; back: Back }) {
  return (
    <header>
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
        <MerchantIdentity merchant={merchant} />
      </div>
    </header>
  );
}
