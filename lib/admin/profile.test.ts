import { describe, expect, it } from "vitest";
import {
  emptyProfileValues,
  parseRating,
  profileSchema,
  toProfileBody,
  toProfileValues,
  whatsappChatUrl,
} from "./profile";

const errorPaths = (values: Partial<typeof emptyProfileValues>) => {
  const result = profileSchema.safeParse({ ...emptyProfileValues, ...values });
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
};

describe("parseRating", () => {
  it("acepta coma o punto con un decimal", () => {
    expect(parseRating("4,5")).toBe(4.5);
    expect(parseRating("4.5")).toBe(4.5);
    expect(parseRating(" 5 ")).toBe(5);
  });

  it("rechaza lo que está fuera de 1 a 5 o tiene más de un decimal", () => {
    expect(parseRating("0,9")).toBeNull();
    expect(parseRating("5,1")).toBeNull();
    expect(parseRating("4,55")).toBeNull();
    expect(parseRating("cuatro")).toBeNull();
  });
});

describe("profileSchema", () => {
  it("una ficha vacía es válida", () => {
    expect(errorPaths({})).toEqual([]);
  });

  it("la puntuación o las reseñas piden la fecha", () => {
    expect(errorPaths({ googleRatingInitial: "4,5" })).toEqual(["googleDataTakenOn"]);
    expect(errorPaths({ googleReviewsInitial: "120" })).toEqual(["googleDataTakenOn"]);
    expect(errorPaths({ googleRatingInitial: "4,5", googleDataTakenOn: "2026-10-01" })).toEqual([]);
  });

  it("la fecha sola no va", () => {
    expect(errorPaths({ googleDataTakenOn: "2026-10-01" })).toEqual(["googleDataTakenOn"]);
  });

  it("valida el celular y la cantidad de reseñas", () => {
    expect(errorPaths({ contactPhone: "hola" })).toEqual(["contactPhone"]);
    expect(errorPaths({ googleReviewsInitial: "12,5", googleDataTakenOn: "2026-10-01" })).toEqual([
      "googleReviewsInitial",
    ]);
  });
});

describe("toProfileBody y toProfileValues", () => {
  it("lo vacío se manda como null", () => {
    expect(toProfileBody(emptyProfileValues)).toEqual({
      contactName: null,
      contactPhone: null,
      address: null,
      googleRatingInitial: null,
      googleReviewsInitial: null,
      googleDataTakenOn: null,
      notes: null,
    });
  });

  it("convierte los números", () => {
    const body = toProfileBody({
      ...emptyProfileValues,
      googleRatingInitial: "4,5",
      googleReviewsInitial: "120",
      googleDataTakenOn: "2026-10-01",
    });
    expect(body).toMatchObject({ googleRatingInitial: 4.5, googleReviewsInitial: 120 });
  });

  it("muestra la puntuación con coma y un decimal", () => {
    const values = toProfileValues({
      contactName: "Ana",
      contactPhone: "+5491123456789",
      address: null,
      googleRatingInitial: 4,
      googleReviewsInitial: 0,
      googleDataTakenOn: "2026-10-01",
      notes: null,
    });
    expect(values).toMatchObject({
      contactName: "Ana",
      address: "",
      googleRatingInitial: "4,0",
      googleReviewsInitial: "0",
    });
  });
});

describe("whatsappChatUrl", () => {
  it("arma el link de wa.me sin el +", () => {
    expect(whatsappChatUrl("+5491123456789")).toBe("https://wa.me/5491123456789");
  });
});
