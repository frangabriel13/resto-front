import { ArrowLeftRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AccountMenu } from "@/components/auth/account-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { roleLabels } from "@/lib/staff/labels";
import { staffRoutes } from "@/lib/staff/routes";
import type { PanelSession } from "@/lib/staff/session";
import icon from "@/public/icon.png";

export function PanelHeader({ account, merchant }: PanelSession) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background px-4 md:px-8">
      <Image src={icon} alt="Clubsy" className="size-8 md:hidden" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs text-muted-foreground">Comercio</span>
        <span className="truncate font-medium text-primary">{merchant.name}</span>
      </div>
      <AccountMenu
        kind="staff"
        name={account.user.name}
        email={account.user.email}
        detail={roleLabels[merchant.role]}
      >
        {account.merchants.length > 1 && (
          <DropdownMenuItem asChild className="h-11">
            <Link href={staffRoutes.selectMerchant}>
              <ArrowLeftRightIcon />
              Cambiar de comercio
            </Link>
          </DropdownMenuItem>
        )}
      </AccountMenu>
    </header>
  );
}
