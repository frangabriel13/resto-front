import { ChevronRightIcon, GiftIcon, QrCodeIcon } from "lucide-react";
import Link from "next/link";
import { IdentityLogo } from "@/components/club/merchant-identity";
import { brandStyle } from "@/lib/brand/colors";
import { clubSummary } from "@/lib/customer/clubs";
import { customerRoutes } from "@/lib/customer/routes";
import type { MembershipSummary } from "@/lib/customer/types";
import { stampCount } from "@/lib/text";

// Con más sellos, los puntos ocuparían varias filas: el ticket pasa a una barra.
const maxDots = 14;

// Cada club como un ticket chico en sus propios colores, como una billetera de tarjetas.
export function MyClubs({ memberships }: { memberships: MembershipSummary[] }) {
  if (memberships.length === 0) return <NoClubs />;

  return (
    <ul className="flex flex-col gap-3">
      {memberships.map((membership) => (
        <li key={membership.id}>
          <ClubTicket membership={membership} />
        </li>
      ))}
    </ul>
  );
}

function ClubTicket({ membership }: { membership: MembershipSummary }) {
  const { merchant, stampsRequired } = membership;
  const filled = Math.min(membership.balance, stampsRequired);
  return (
    <Link
      href={customerRoutes.card(merchant.slug)}
      style={brandStyle(merchant)}
      className="flex flex-col gap-3.5 rounded-[0.875rem] bg-primary px-4 pt-4 pb-3.5 text-primary-foreground outline-none transition-transform focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98]"
    >
      <span className="flex items-center gap-3">
        <IdentityLogo name={merchant.name} logoUrl={merchant.logoUrl} />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[0.9375rem] leading-tight font-semibold wrap-anywhere">{merchant.name}</span>
          <span className="text-[0.8125rem] text-primary-foreground/85">{clubSummary(membership)}</span>
        </span>
        <ChevronRightIcon aria-hidden className="size-4 shrink-0 opacity-80" />
      </span>
      {stampsRequired > maxDots ? (
        <span aria-hidden className="h-2 overflow-hidden rounded-full border-[1.5px] border-dashed border-primary-foreground/55">
          <span
            className="block h-full rounded-full bg-primary-foreground"
            style={{ width: `${Math.round((filled / stampsRequired) * 100)}%` }}
          />
        </span>
      ) : (
        <span aria-hidden className="flex flex-wrap gap-1.5">
          {Array.from({ length: stampsRequired }, (_, index) => (
            <Dot key={index} kind={index === stampsRequired - 1 ? "prize" : index < filled ? "done" : "empty"} />
          ))}
        </span>
      )}
      <span className="sr-only">{`${filled} de ${stampCount(stampsRequired)}`}</span>
    </Link>
  );
}

function Dot({ kind }: { kind: "done" | "empty" | "prize" }) {
  if (kind === "empty") {
    return <span className="size-4.5 rounded-full border-[1.5px] border-dashed border-primary-foreground/55" />;
  }
  return (
    <span className="flex size-4.5 items-center justify-center rounded-full bg-primary-foreground text-primary">
      {kind === "prize" && <GiftIcon aria-hidden strokeWidth={2.6} className="size-2.75" />}
    </span>
  );
}

function NoClubs() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[0.875rem] border-[1.5px] border-dashed border-ink/30 px-5 py-6.5 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-ink/8 text-ink">
        <QrCodeIcon aria-hidden strokeWidth={1.7} className="size-5.5" />
      </span>
      <p className="mt-1 text-[0.9375rem] font-semibold">Todavía no estás en ningún club</p>
      <p className="text-[0.8125rem] leading-normal text-neutral-600">
        En un local con Clubsy, escaneá el QR del cartel o acercá el celular para sumarte.
      </p>
    </div>
  );
}
