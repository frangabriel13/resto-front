import { SmartphoneIcon } from "lucide-react";
import { phoneEnding } from "@/lib/customer/clubs";
import type { Customer } from "@/lib/customer/types";
import { AccountRowContent } from "./account-row";
import { DeleteAccount } from "./delete-account";
import { LogoutRow } from "./logout-row";

export function AccountDetails({ customer }: { customer: Customer }) {
  return (
    <section aria-labelledby="tu-cuenta" className="mt-7 flex flex-col border-t border-neutral-100 pt-5">
      <h2 id="tu-cuenta" className="mb-1.5 text-[1.0625rem] font-semibold">
        Tu cuenta
      </h2>
      <div className="flex min-h-14.5 items-center gap-3">
        <AccountRowContent
          icon={SmartphoneIcon}
          label={customer.name}
          detail={`Celular terminado en ${phoneEnding(customer.phoneE164)}`}
        />
      </div>
      <LogoutRow />
      <DeleteAccount />
    </section>
  );
}
