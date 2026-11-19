"use client";

import { LogOutIcon } from "lucide-react";
import { AccountRowContent, accountRowButtonClass } from "./account-row";
import { useLogout } from "./use-logout";

export function LogoutRow() {
  const { pending, logout } = useLogout();
  return (
    <button type="button" className={accountRowButtonClass} disabled={pending} onClick={logout}>
      <AccountRowContent icon={LogOutIcon} label="Cerrar sesión" detail="Para entrar con otro celular" chevron />
    </button>
  );
}
