import { GiftIcon } from "lucide-react";

// Vista previa de cómo ve el cliente su tarjeta vacía: un casillero por sello y el premio al final.
export function StampPreview({
  stampsRequired,
  rewardDescription,
}: {
  stampsRequired: number;
  rewardDescription: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-primary p-4 text-primary-foreground">
      <ol aria-label={`Tarjeta de ${stampsRequired} sellos`} className="flex flex-wrap gap-2">
        {Array.from({ length: stampsRequired }, (_, i) => {
          const last = i === stampsRequired - 1;
          return (
            <li
              key={i}
              className={
                last
                  ? "flex size-9 items-center justify-center rounded-full bg-brand text-brand-foreground"
                  : "flex size-9 items-center justify-center rounded-full border-2 border-dashed border-primary-foreground/40 text-xs text-primary-foreground/60"
              }
            >
              {last ? <GiftIcon className="size-4" /> : i + 1}
            </li>
          );
        })}
      </ol>
      <p className="text-sm">
        Con <span className="font-semibold">{stampsRequired}</span>{" "}
        {stampsRequired === 1 ? "sello" : "sellos"}:{" "}
        <span className="font-semibold">{rewardDescription || "…"}</span>
      </p>
    </div>
  );
}
