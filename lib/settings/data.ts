import "server-only";
import { getServerApi } from "@/lib/api/server";
import type { SettingsView } from "./types";

export async function getSettings(): Promise<SettingsView> {
  const api = await getServerApi();
  const { data, response } = await api.GET("/panel/settings");
  if (!data) throw new Error(`GET /panel/settings respondió ${response.status}`);
  return data;
}
