import { describe, expect, it } from "vitest";
import { exportFilename } from "./export";

describe("exportFilename", () => {
  it("usa el nombre que manda la API", () => {
    expect(exportFilename('attachment; filename="clubsy-cafe-demo-2026-10-20.csv"')).toBe(
      "clubsy-cafe-demo-2026-10-20.csv",
    );
    expect(exportFilename("attachment; filename*=UTF-8''clubsy-caf%C3%A9.csv")).toBe("clubsy-café.csv");
  });

  it("sin cabecera, un nombre genérico", () => {
    expect(exportFilename(null)).toBe("clubsy-clientes.csv");
  });
});
