// Lo que el cliente cargó en el alta mientras va a WhatsApp a buscar el código. Si el celular recarga
// la pestaña al volver (iOS lo hace cuando le falta memoria), el alta sigue en el paso del código en
// vez de empezar de cero. Nunca se guarda el código.
export type JoinDraft = {
  details: { name: string; phone: string; marketingConsent: boolean };
  resendAt: number;
  savedAt: number;
};

// El código vence a los 10 minutos: después, el borrador ya no sirve.
const maxAgeMs = 10 * 60 * 1000;

export function joinDraftKey(pieceCode: string): string {
  return `clubsy:alta:${pieceCode}`;
}

export function parseJoinDraft(raw: string | null, now: number): JoinDraft | null {
  if (!raw) return null;
  try {
    const draft = JSON.parse(raw) as Partial<JoinDraft>;
    const details = draft.details;
    if (
      typeof draft.savedAt !== "number" ||
      typeof draft.resendAt !== "number" ||
      typeof details?.name !== "string" ||
      typeof details.phone !== "string" ||
      typeof details.marketingConsent !== "boolean"
    ) {
      return null;
    }
    if (now - draft.savedAt > maxAgeMs) return null;
    return { details, resendAt: draft.resendAt, savedAt: draft.savedAt };
  } catch {
    return null;
  }
}
