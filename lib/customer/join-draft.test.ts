import { describe, expect, it } from "vitest";
import { joinDraftKey, parseJoinDraft } from "./join-draft";

const draft = {
  details: { name: "Lucía", phone: "11 2345 6789", marketingConsent: false },
  resendAt: 1_000_060_000,
  savedAt: 1_000_000_000,
};

describe("parseJoinDraft", () => {
  it("devuelve el borrador guardado hace menos de 10 minutos", () => {
    expect(parseJoinDraft(JSON.stringify(draft), draft.savedAt + 9 * 60_000)).toEqual(draft);
  });

  it("descarta el borrador vencido, roto o incompleto", () => {
    expect(parseJoinDraft(JSON.stringify(draft), draft.savedAt + 11 * 60_000)).toBeNull();
    expect(parseJoinDraft("{no es json", draft.savedAt)).toBeNull();
    expect(parseJoinDraft(JSON.stringify({ ...draft, details: { name: "Lucía" } }), draft.savedAt)).toBeNull();
    expect(parseJoinDraft(null, draft.savedAt)).toBeNull();
  });

  it("guarda un borrador por pieza", () => {
    expect(joinDraftKey("abc123")).toBe("clubsy:alta:abc123");
  });
});
