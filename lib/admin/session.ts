import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { components } from "@/lib/api/schema";
import { getServerApi } from "@/lib/api/server";
import { adminRoutes } from "./routes";

export type AdminAccount = components["schemas"]["AdminAccount"];

export const getAdminAccount = cache(async (): Promise<AdminAccount | null> => {
  const api = await getServerApi();
  const { data, response } = await api.GET("/auth/admin/me");
  if (response.status === 401) return null;
  if (!data) throw new Error(`GET /auth/admin/me respondió ${response.status}`);
  return data;
});

export async function requireAdminSession(): Promise<AdminAccount> {
  const account = await getAdminAccount();
  if (!account) redirect(adminRoutes.login);
  return account;
}

export async function redirectIfAdminSession() {
  if (await getAdminAccount()) redirect(adminRoutes.merchants);
}
