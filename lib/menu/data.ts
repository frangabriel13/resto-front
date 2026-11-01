import "server-only";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/admin/session";
import type { AdminMerchant } from "@/lib/admin/types";
import { getServerApi } from "@/lib/api/server";
import type { Menu } from "./types";

export async function getPanelMenu(): Promise<Menu> {
  const api = await getServerApi();
  const { data, response } = await api.GET("/panel/menu");
  if (!data) throw new Error(`GET /panel/menu respondió ${response.status}`);
  return data;
}

export async function getAdminMenu(id: string): Promise<{ merchant: AdminMerchant; menu: Menu }> {
  await requireAdminSession();
  const api = await getServerApi();
  const [merchant, menu] = await Promise.all([
    api.GET("/admin/merchants/{id}", { params: { path: { id } } }),
    api.GET("/admin/merchants/{merchantId}/menu", { params: { path: { merchantId: id } } }),
  ]);
  // Un id inexistente o con formato inválido es un 404 para quien navega.
  if ([400, 404].includes(merchant.response.status)) notFound();
  if (!merchant.data || !menu.data) throw new Error(`No se pudo cargar la carta del comercio ${id}`);
  return { merchant: merchant.data, menu: menu.data };
}
