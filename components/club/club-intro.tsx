import { QrCodeIcon } from "lucide-react";
import type { ClubPiece } from "@/lib/customer/types";
import { StampCardPreview } from "./stamp-card-preview";

type RewardRule = NonNullable<ClubPiece["rewardRule"]>;

// Lo que se ve antes de los datos: el premio, cómo se suman los sellos y las condiciones del comercio.
export function ClubIntro({ rewardRule }: { rewardRule: RewardRule }) {
  return (
    <div className="flex flex-col">
      <h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight">Sumate al club</h1>
      <div className="mt-4">
        <StampCardPreview
          stampsRequired={rewardRule.stampsRequired}
          rewardDescription={rewardRule.rewardDescription}
        />
      </div>

      <p className="mt-3.5 flex items-center gap-3 text-sm leading-normal text-neutral-700">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink/8 text-ink">
          <QrCodeIcon aria-hidden strokeWidth={1.7} className="size-4.5" />
        </span>
        En cada compra mostrás el QR de tu tarjeta y el local te suma un sello.
      </p>

      {rewardRule.conditions && (
        <div className="mt-4 flex flex-col gap-1 rounded-[0.625rem] bg-neutral-100 px-4 py-3.5">
          <h2 className="text-[0.8125rem] font-semibold">Condiciones</h2>
          <p className="text-[0.8125rem] leading-normal break-words whitespace-pre-line text-neutral-600">
            {rewardRule.conditions}
          </p>
        </div>
      )}
    </div>
  );
}
