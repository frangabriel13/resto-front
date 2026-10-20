import { describe, expect, it } from "vitest";
import { cooldownText } from "./cooldown";

describe("cooldownText", () => {
  it("explica la espera en horas y minutos", () => {
    expect(cooldownText(0)).toMatch(/Sin espera/);
    expect(cooldownText(45)).toMatch(/45 min\.$/);
    expect(cooldownText(60)).toMatch(/1 hora\.$/);
    expect(cooldownText(90)).toMatch(/1 hora y 30 min\.$/);
    expect(cooldownText(1440)).toMatch(/24 horas\.$/);
  });
});
