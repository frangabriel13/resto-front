import "server-only";
import { io } from "next/cache";
import { getServerApi } from "@/lib/api/server";
import { dayInAR, type DayRange } from "./range";
import type { ActivityPage, Stats } from "./types";

export async function todayInAR(): Promise<string> {
  await io();
  return dayInAR(new Date());
}

// Sin rango, la API usa los últimos 30 días.
export async function getStats(range?: DayRange): Promise<Stats> {
  const api = await getServerApi();
  const { data, response } = await api.GET("/panel/stats", { params: { query: range ?? {} } });
  if (!data) throw new Error(`GET /panel/stats respondió ${response.status}`);
  return data;
}

export async function getActivity(range: DayRange): Promise<ActivityPage> {
  const api = await getServerApi();
  const { data, response } = await api.GET("/panel/activity", { params: { query: range } });
  if (!data) throw new Error(`GET /panel/activity respondió ${response.status}`);
  return data;
}
