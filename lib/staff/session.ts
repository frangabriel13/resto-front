import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getServerApi } from "@/lib/api/server";
import {
  currentMerchant,
  staffRedirect,
  type StaffAccount,
  type StaffMerchant,
} from "./access";
import { staffRoutes, type StaffRoute } from "./routes";

export const getStaffAccount = cache(async (): Promise<StaffAccount | null> => {
  const api = await getServerApi();
  const { data, response } = await api.GET("/auth/staff/me");
  if (response.status === 401) return null;
  if (!data) throw new Error(`GET /auth/staff/me respondió ${response.status}`);
  return data;
});

type SessionRoute = Exclude<StaffRoute, typeof staffRoutes.login>;

// Redirige si a la sesión le corresponde otro paso. Fuera del login, siempre hay cuenta.
export async function ensureStaffRoute(route: typeof staffRoutes.login): Promise<null>;
export async function ensureStaffRoute(route: SessionRoute): Promise<StaffAccount>;
export async function ensureStaffRoute(route: StaffRoute) {
  const account = await getStaffAccount();
  const target = staffRedirect(account, route);
  if (target) redirect(target);
  return account;
}

export type PanelSession = { account: StaffAccount; merchant: StaffMerchant };

export async function requirePanelSession(): Promise<PanelSession> {
  const account = await ensureStaffRoute(staffRoutes.home);
  const merchant = currentMerchant(account);
  if (!merchant) redirect(staffRoutes.selectMerchant);
  return { account, merchant };
}

export async function requireOwnerSession(): Promise<PanelSession> {
  const session = await requirePanelSession();
  if (session.merchant.role !== "OWNER") redirect(staffRoutes.home);
  return session;
}
