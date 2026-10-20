import type { components } from "@/lib/api/schema";

export type ActivityPage = components["schemas"]["ActivityPage"];
export type ActivityItem = ActivityPage["items"][number];
export type Stats = components["schemas"]["Stats"];
