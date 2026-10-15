import { describe, expect, it } from "vitest";
import { previewStamps, toCreateRewardRuleBody, toRewardRuleValues } from "./schemas";

describe("previewStamps", () => {
  it("usa el número si está entre 1 y 50", () => {
    expect(previewStamps("8")).toBe(8);
    expect(previewStamps("50")).toBe(50);
  });

  it("cae en 1 mientras el valor está a medio escribir o fuera de rango", () => {
    expect(previewStamps("")).toBe(1);
    expect(previewStamps("0")).toBe(1);
    expect(previewStamps("500")).toBe(1);
    expect(previewStamps("2.5")).toBe(1);
  });
});

describe("conversión del formulario", () => {
  it("sin premio configurado, propone 8 sellos", () => {
    expect(toRewardRuleValues(undefined)).toEqual({
      stampsRequired: "8",
      rewardDescription: "",
      conditions: "",
    });
  });

  it("manda las condiciones vacías como null", () => {
    expect(
      toCreateRewardRuleBody({ stampsRequired: "10", rewardDescription: "Un café", conditions: "" }),
    ).toEqual({ stampsRequired: 10, rewardDescription: "Un café", conditions: null });
  });
});
