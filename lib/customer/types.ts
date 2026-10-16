import type { components } from "@/lib/api/schema";

export type PublicPiece = components["schemas"]["PublicPiece"];
export type ClubPiece = Extract<PublicPiece, { merchant: unknown }>;
export type MembershipSummary = components["schemas"]["MembershipSummary"];
export type Customer = components["schemas"]["Me"];
export type CustomerSession = { customer: Customer; memberships: MembershipSummary[] };
export type MembershipCard = components["schemas"]["MembershipCard"];
export type CardHistoryEntry = MembershipCard["history"][number];

export type CardLookup =
  | { status: "no-session" }
  | { status: "not-member"; customer: Customer }
  | { status: "ok"; customer: Customer; card: MembershipCard };
