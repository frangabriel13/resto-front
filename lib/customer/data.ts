import "server-only";
import { getServerApi } from "@/lib/api/server";
import type { CardLookup, CustomerSession, PublicPiece } from "./types";

// `null` si el código no existe.
export async function getPublicPiece(code: string): Promise<PublicPiece | null> {
  const api = await getServerApi();
  const { data, response } = await api.GET("/public/pieces/{code}", {
    params: { path: { code } },
  });
  if (response.status === 404 || response.status === 400) return null;
  if (!data) throw new Error(`GET /public/pieces respondió ${response.status}`);
  return data;
}

// `null` si no hay sesión de cliente.
export async function getCustomerSession(): Promise<CustomerSession | null> {
  const api = await getServerApi();
  const [me, memberships] = await Promise.all([api.GET("/me"), api.GET("/me/memberships")]);
  if (me.response.status === 401) return null;
  if (!me.data || !memberships.data) {
    throw new Error(`GET /me respondió ${me.response.status}`);
  }
  return { customer: me.data, memberships: memberships.data };
}

export async function getMembershipCard(slug: string): Promise<CardLookup> {
  const session = await getCustomerSession();
  if (!session) return { status: "no-session" };
  const membership = session.memberships.find((m) => m.merchant.slug === slug);
  if (!membership) return { status: "not-member", customer: session.customer };

  const api = await getServerApi();
  const { data, response } = await api.GET("/me/memberships/{id}", {
    params: { path: { id: membership.id } },
  });
  if (!data) throw new Error(`GET /me/memberships/${membership.id} respondió ${response.status}`);
  return { status: "ok", customer: session.customer, card: data };
}
