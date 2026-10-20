import "server-only";
import { getServerApi } from "@/lib/api/server";
import type { StaffMember } from "./types";

export async function getTeam(): Promise<StaffMember[]> {
  const api = await getServerApi();
  const { data, response } = await api.GET("/panel/staff");
  if (!data) throw new Error(`GET /panel/staff respondió ${response.status}`);
  return data;
}
