import { StampGrid } from "./stamp-grid";

// Cómo ve el cliente su tarjeta vacía, con el premio al final.
export function StampPreview({
  stampsRequired,
  rewardDescription,
}: {
  stampsRequired: number;
  rewardDescription: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-primary p-4 text-primary-foreground">
      <StampGrid stampsRequired={stampsRequired} />
      <p className="text-sm">
        Con <span className="font-semibold">{stampsRequired}</span>{" "}
        {stampsRequired === 1 ? "sello" : "sellos"}:{" "}
        <span className="font-semibold">{rewardDescription || "…"}</span>
      </p>
    </div>
  );
}
