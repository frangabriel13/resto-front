import { describe, expect, it } from "vitest";
import { isGoogleReviewUrl } from "./fields";
import { parsePlaceId, reviewUrlFromPlaceId } from "./place-id";

const id = "ChIJN1t_tDeuEmsRUsoyG83frY4";

describe("parsePlaceId", () => {
  it("acepta el ID solo, con espacios alrededor", () => {
    expect(parsePlaceId(` ${id} `)).toBe(id);
  });

  it("saca el ID de un link de reseñas o de la API de Google", () => {
    expect(parsePlaceId(`https://search.google.com/local/writereview?placeid=${id}`)).toBe(id);
    expect(parsePlaceId(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}`)).toBe(id);
  });

  it("rechaza lo que no tiene formato de Place ID", () => {
    for (const value of ["", "ChIJ corto", "ChIJ con espacios en el medio xx", "abc", `${id}!`, "https://g.page/r/abc"]) {
      expect(parsePlaceId(value), value).toBeNull();
    }
  });

  it("rechaza un ID que haría el link más largo que 500 caracteres", () => {
    expect(parsePlaceId("a".repeat(448))).toBe("a".repeat(448));
    expect(parsePlaceId("a".repeat(449))).toBeNull();
  });
});

describe("reviewUrlFromPlaceId", () => {
  it("arma un link de reseñas que la API acepta", () => {
    const url = reviewUrlFromPlaceId(id);
    expect(url).toBe(`https://search.google.com/local/writereview?placeid=${id}`);
    expect(isGoogleReviewUrl(url)).toBe(true);
    expect(reviewUrlFromPlaceId("a".repeat(448))).toHaveLength(500);
  });
});
