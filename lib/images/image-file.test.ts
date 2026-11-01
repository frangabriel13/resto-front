import { describe, expect, it } from "vitest";
import { imageFileError, maxImageBytes } from "./image-file";

describe("imageFileError", () => {
  it("acepta PNG, JPG y WebP de hasta 2 MB", () => {
    for (const type of ["image/png", "image/jpeg", "image/webp"]) {
      expect(imageFileError({ type, size: maxImageBytes })).toBeNull();
    }
  });

  it("rechaza otros tipos, SVG incluido", () => {
    for (const type of ["image/svg+xml", "image/heic", "application/pdf", ""]) {
      expect(imageFileError({ type, size: 10 })).toBe("La imagen tiene que ser PNG, JPG o WebP.");
    }
  });

  it("rechaza más de 2 MB", () => {
    expect(imageFileError({ type: "image/png", size: maxImageBytes + 1 })).toBe(
      "La imagen no puede pesar más de 2 MB.",
    );
  });
});
