import { describe, expect, it } from "vitest";
import { merchantNotice } from "./merchant-notice";

describe("merchantNotice", () => {
  it("no avisa nada con el club activo", () => {
    expect(merchantNotice({ status: "ACTIVE", role: "OWNER", hasActiveRule: true })).toBeNull();
  });

  it("en preparación sin premio, al dueño lo lleva a configurarlo", () => {
    expect(merchantNotice({ status: "DRAFT", role: "OWNER", hasActiveRule: false })).toEqual({
      text: "Tu club está en preparación: todavía no recibe clientes.",
      rewardLink: true,
    });
  });

  it("en preparación sin premio, al empleado le explica que falta el dueño", () => {
    expect(merchantNotice({ status: "DRAFT", role: "EMPLOYEE", hasActiveRule: false })).toMatchObject({
      text: expect.stringContaining("falta que el dueño configure el premio"),
      rewardLink: false,
    });
  });

  it("en preparación con premio, avisa que falta que Clubsy lo active (para dueño y empleado)", () => {
    for (const role of ["OWNER", "EMPLOYEE"] as const) {
      expect(merchantNotice({ status: "DRAFT", role, hasActiveRule: true })).toMatchObject({
        text: expect.stringContaining("Falta que Clubsy lo active"),
        rewardLink: false,
      });
    }
  });

  it("avisa pausado y finalizado", () => {
    expect(merchantNotice({ status: "PAUSED", role: "OWNER", hasActiveRule: true })?.text).toMatch(/pausado/);
    expect(merchantNotice({ status: "ENDED", role: "OWNER", hasActiveRule: true })?.text).toMatch(/finalizó/);
  });
});
