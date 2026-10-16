import type { components } from "@/lib/api/schema";

export type CustomerDetail = components["schemas"]["CustomerDetail"];
export type CustomerHistoryEntry = CustomerDetail["history"][number];
