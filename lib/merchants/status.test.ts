import { describe, expect, it } from "vitest";
import { nextMerchantStatuses } from "./status";

describe("nextMerchantStatuses", () => {
  it("un comercio en preparación solo se puede activar", () => {
    expect(nextMerchantStatuses("DRAFT")).toEqual(["ACTIVE"]);
  });

  it("uno activo se puede pausar o finalizar", () => {
    expect(nextMerchantStatuses("ACTIVE")).toEqual(["PAUSED", "ENDED"]);
  });

  it("uno pausado se puede reactivar o finalizar", () => {
    expect(nextMerchantStatuses("PAUSED")).toEqual(["ACTIVE", "ENDED"]);
  });

  it("uno finalizado no cambia más", () => {
    expect(nextMerchantStatuses("ENDED")).toEqual([]);
  });
});
