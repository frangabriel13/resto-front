import { describe, expect, it } from "vitest";
import { destinationDetail, pieceSchema, toDestinationBody, toPieceValues, type PieceValues } from "./destination";

type Destination = PieceValues["destination"];
const base: Destination = { type: "CLUB", url: "", username: "", phone: "", message: "" };
const errorPaths = (values: Partial<Destination> & { label?: string }) => {
  const { label = "Mostrador", ...destination } = values;
  const result = pieceSchema.safeParse({ label, destination: { ...base, ...destination } });
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
};

describe("pieceSchema", () => {
  it("el club solo pide el nombre", () => {
    expect(errorPaths({})).toEqual([]);
    expect(errorPaths({ label: " " })).toEqual(["label"]);
  });

  it("solo valida los campos del destino elegido", () => {
    expect(errorPaths({ type: "GOOGLE_REVIEWS", url: "https://evil.com", username: "!!" })).toEqual([
      "destination.url",
    ]);
    expect(errorPaths({ type: "GOOGLE_REVIEWS", url: "https://g.page/r/abc/review" })).toEqual([]);
    expect(errorPaths({ type: "INSTAGRAM", username: "@cafe.de_la-esquina" })).toEqual(["destination.username"]);
    expect(errorPaths({ type: "INSTAGRAM", username: "@cafe.de_la_esquina" })).toEqual([]);
    expect(errorPaths({ type: "WHATSAPP", phone: "hola" })).toEqual(["destination.phone"]);
    expect(errorPaths({ type: "WHATSAPP", phone: "11 2345-6789" })).toEqual([]);
  });
});

describe("toPieceValues", () => {
  it("una pieza nueva arranca en el club y sugiere el link de reseñas del comercio", () => {
    expect(toPieceValues(null, "https://g.page/r/abc/review").destination).toMatchObject({
      type: "CLUB",
      url: "https://g.page/r/abc/review",
    });
  });

  it("carga los datos del destino de la pieza", () => {
    const values = toPieceValues(
      { label: "Caja", destination: { type: "WHATSAPP", phone: "+5491123456789", message: null } },
      null,
    );
    expect(values).toEqual({
      label: "Caja",
      destination: { type: "WHATSAPP", url: "", username: "", phone: "+5491123456789", message: "" },
    });
  });
});

describe("toDestinationBody", () => {
  it("manda solo los campos del destino elegido", () => {
    const filled = { ...base, url: "https://g.page/x", username: "cafe", phone: "1123456789" };
    const body = (type: Destination["type"]) =>
      toDestinationBody({ label: "Caja", destination: { ...filled, type } });
    expect(body("CLUB")).toEqual({ type: "CLUB" });
    expect(body("INSTAGRAM")).toEqual({ type: "INSTAGRAM", username: "cafe" });
    expect(body("WHATSAPP")).toEqual({
      type: "WHATSAPP",
      phone: "1123456789",
      message: null,
    });
  });
});

describe("destinationDetail", () => {
  it("muestra el dato de cada destino", () => {
    expect(destinationDetail({ type: "CLUB" })).toBeNull();
    expect(destinationDetail({ type: "INSTAGRAM", username: "cafe" })).toBe("@cafe");
    expect(destinationDetail({ type: "WHATSAPP", phone: "+5491123456789", message: "Hola" })).toBe("+5491123456789");
  });
});
