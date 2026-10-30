import "server-only";
import { notFound } from "next/navigation";
import { getServerApi } from "@/lib/api/server";
import { requireAdminSession } from "./session";
import { merchantListQuery, type MerchantFilter } from "./status-filter";
import type { DeletionSummary } from "./archive";
import type { AdminMerchant, MerchantSummary, Piece } from "./types";

export async function getMerchants(filter: MerchantFilter | null): Promise<MerchantSummary[]> {
  await requireAdminSession();
  const api = await getServerApi();
  const { data, response } = await api.GET("/admin/merchants", {
    params: { query: merchantListQuery(filter) },
  });
  if (!data) throw new Error(`GET /admin/merchants respondió ${response.status}`);
  return data;
}

export async function getMerchantWithPieces(
  id: string,
): Promise<{ merchant: AdminMerchant; pieces: Piece[]; deletion: DeletionSummary }> {
  await requireAdminSession();
  const api = await getServerApi();
  const params = { params: { path: { id } } };
  const [merchant, pieces, deletion] = await Promise.all([
    api.GET("/admin/merchants/{id}", params),
    api.GET("/admin/merchants/{merchantId}/pieces", { params: { path: { merchantId: id } } }),
    api.GET("/admin/merchants/{id}/deletion-summary", params),
  ]);
  // Un id inexistente o con formato inválido es un 404 para quien navega.
  if ([400, 404].includes(merchant.response.status)) notFound();
  if (!merchant.data || !pieces.data || !deletion.data) {
    throw new Error(`No se pudo cargar el comercio ${id}`);
  }
  return { merchant: merchant.data, pieces: pieces.data, deletion: deletion.data };
}
