import "server-only";
import { notFound } from "next/navigation";
import { getServerApi } from "@/lib/api/server";
import { requirePanelSession } from "@/lib/staff/session";
import type { CustomerDetail } from "./types";

export async function getCustomerDetail(membershipId: string): Promise<CustomerDetail> {
  await requirePanelSession();
  const api = await getServerApi();
  const { data, response } = await api.GET("/panel/customers/{membershipId}", {
    params: { path: { membershipId } },
  });
  // Un id inexistente, con formato inválido o de otro comercio es un 404 para quien navega.
  if ([400, 404].includes(response.status)) notFound();
  if (!data) throw new Error(`GET /panel/customers/${membershipId} respondió ${response.status}`);
  return data;
}
