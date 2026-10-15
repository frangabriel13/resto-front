import "server-only";
import { getServerApi } from "@/lib/api/server";
import { requireOwnerSession } from "@/lib/staff/session";
import type { RewardRule } from "./types";

// Ordenadas de la versión más nueva a la más vieja.
export async function getRewardRules(): Promise<RewardRule[]> {
  await requireOwnerSession();
  const api = await getServerApi();
  const { data, response } = await api.GET("/panel/reward-rules");
  if (!data) throw new Error(`GET /panel/reward-rules respondió ${response.status}`);
  return data;
}
