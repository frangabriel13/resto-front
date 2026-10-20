import { describe, expect, it } from "vitest";
import { cooldownMinutes, isGoogleReviewUrl, optionalColor, optionalGoogleReviewUrl } from "./fields";

describe("isGoogleReviewUrl", () => {
  it("acepta links https de Google", () => {
    for (const url of [
      "https://g.page/r/abc/review",
      "https://maps.app.goo.gl/xyz",
      "https://goo.gl/maps/xyz",
      "https://www.google.com/maps/place/x",
      "https://search.google.com/local/writereview?placeid=1",
      "https://www.google.com.ar/maps",
    ]) {
      expect(isGoogleReviewUrl(url), url).toBe(true);
    }
  });

  it("rechaza otros sitios, http y parecidos", () => {
    for (const url of [
      "http://g.page/r/abc",
      "https://example.com",
      "https://google.com.evil.com",
      "https://notgoogle.com",
      "no es un link",
    ]) {
      expect(isGoogleReviewUrl(url), url).toBe(false);
    }
  });
});

describe("campos opcionales", () => {
  it("vacío vale como sin cargar", () => {
    expect(optionalGoogleReviewUrl.safeParse("").success).toBe(true);
    expect(optionalColor.safeParse("").success).toBe(true);
  });

  it("valida el formato", () => {
    expect(optionalColor.safeParse("#FC5D00").success).toBe(true);
    expect(optionalColor.safeParse("naranja").success).toBe(false);
    expect(optionalGoogleReviewUrl.safeParse("https://example.com").success).toBe(false);
  });
});

describe("cooldownMinutes", () => {
  it("de 0 a 1440 minutos enteros", () => {
    expect(cooldownMinutes.safeParse("0").success).toBe(true);
    expect(cooldownMinutes.safeParse("1440").success).toBe(true);
    expect(cooldownMinutes.safeParse("1441").success).toBe(false);
    expect(cooldownMinutes.safeParse("1.5").success).toBe(false);
    expect(cooldownMinutes.safeParse("").success).toBe(false);
  });
});
