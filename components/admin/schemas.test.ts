import { describe, expect, it } from "vitest";
import { newMerchantDefaults, newMerchantSchema, toCreateMerchantBody } from "./schemas";

describe("newMerchantSchema", () => {
  it("alcanza con el nombre", () => {
    expect(newMerchantSchema.safeParse({ ...newMerchantDefaults, name: "Café" }).success).toBe(true);
  });

  it("un slug escrito se valida con su mensaje", () => {
    const result = newMerchantSchema.safeParse({ ...newMerchantDefaults, name: "Café", slug: "ca" });
    expect(result.error?.issues).toEqual([
      expect.objectContaining({ path: ["slug"], message: "Tiene que tener al menos 3 caracteres." }),
    ]);
  });
});

describe("toCreateMerchantBody", () => {
  it("sin slug ni minutos los decide la API", () => {
    const body = toCreateMerchantBody({ ...newMerchantDefaults, name: "Café" });
    expect(body.slug).toBeUndefined();
    expect(body.stampCooldownMinutes).toBeUndefined();
    expect(body).toMatchObject({ name: "Café", logoUrl: null, googleReviewUrl: null });
  });

  it("manda lo que se cargó", () => {
    const body = toCreateMerchantBody({
      ...newMerchantDefaults,
      name: "Café",
      slug: "cafe-centro",
      stampCooldownMinutes: "30",
      profile: { ...newMerchantDefaults.profile, contactName: "Ana" },
    });
    expect(body).toMatchObject({
      slug: "cafe-centro",
      stampCooldownMinutes: 30,
      profile: { contactName: "Ana", address: null },
    });
  });
});
