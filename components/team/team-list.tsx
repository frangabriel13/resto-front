import { Badge } from "@/components/ui/badge";
import type { MerchantStatus } from "@/lib/merchants/status";
import { roleLabels } from "@/lib/staff/labels";
import { memberStatus, sortTeam } from "@/lib/team/members";
import type { StaffMember } from "@/lib/team/types";
import { cn } from "@/lib/utils";
import { MemberActions } from "./member-actions";

const toneClasses = {
  ok: "bg-emerald-50 text-emerald-800",
  pending: "bg-brand/15 text-primary",
  off: "bg-muted text-muted-foreground",
};

export function TeamList({ members, status }: { members: StaffMember[]; status: MerchantStatus }) {
  return (
    <ul className="flex flex-col divide-y">
      {sortTeam(members).map((member) => {
        const state = memberStatus(member);
        return (
          <li key={member.staffUserId} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className={cn("flex min-w-0 flex-col", !member.active && "opacity-70")}>
                <span className="font-medium break-words text-primary">{member.name}</span>
                <span className="text-sm break-all text-muted-foreground">{member.email}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {member.role === "OWNER" && <Badge variant="secondary">{roleLabels.OWNER}</Badge>}
                <Badge className={toneClasses[state.tone]}>{state.label}</Badge>
              </div>
            </div>
            <MemberActions member={member} status={status} />
          </li>
        );
      })}
    </ul>
  );
}
