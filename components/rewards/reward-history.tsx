import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { RewardRule } from "@/lib/rewards/types";
import { stampCount } from "@/lib/text";

export function RewardHistory({ rules }: { rules: RewardRule[] }) {
  return (
    <ol className="flex flex-col divide-y">
      {rules.map((rule) => (
        <li key={rule.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">
              {stampCount(rule.stampsRequired)}:{" "}
              {rule.rewardDescription}
            </span>
            {rule.active && <Badge variant="secondary">Actual</Badge>}
          </div>
          {rule.conditions && <p className="text-sm text-muted-foreground">{rule.conditions}</p>}
          <p className="text-xs text-muted-foreground">
            Versión {rule.version} · desde el {formatDate(rule.createdAt)}
          </p>
        </li>
      ))}
    </ol>
  );
}
