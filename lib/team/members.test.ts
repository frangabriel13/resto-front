import { describe, expect, it } from "vitest";
import { canAddStaff, memberActions, memberStatus, sortTeam } from "./members";
import type { StaffMember } from "./types";

const member = (overrides: Partial<StaffMember> = {}): StaffMember => ({
  staffUserId: "01a14015-6b9f-76dd-ac13-63e4caf72bd3",
  name: "Bruno",
  email: "bruno@ejemplo.com",
  role: "EMPLOYEE",
  active: true,
  pendingFirstLogin: false,
  createdAt: "2026-10-01T12:00:00.000Z",
  ...overrides,
});

describe("sortTeam", () => {
  it("dueños, activos y dados de baja, por nombre", () => {
    const sorted = sortTeam([
      member({ name: "Zoe", active: false }),
      member({ name: "Carla" }),
      member({ name: "Ana" }),
      member({ name: "Dueña", role: "OWNER" }),
    ]);
    expect(sorted.map((m) => m.name)).toEqual(["Dueña", "Ana", "Carla", "Zoe"]);
  });
});

describe("memberStatus", () => {
  it("activo, pendiente o dado de baja", () => {
    expect(memberStatus(member()).label).toBe("Activo");
    expect(memberStatus(member({ pendingFirstLogin: true })).label).toBe("Todavía no ingresó");
    expect(memberStatus(member({ active: false, pendingFirstLogin: true })).label).toBe("Dado de baja");
  });
});

describe("memberActions", () => {
  it("al dueño no se lo toca", () => {
    expect(memberActions(member({ role: "OWNER" }), "ACTIVE")).toEqual({
      deactivate: false,
      reactivate: false,
      resetPassword: false,
    });
  });

  it("activo: baja y contraseña, en cualquier estado del club", () => {
    expect(memberActions(member(), "PAUSED")).toEqual({ deactivate: true, reactivate: false, resetPassword: true });
  });

  it("dado de baja: se reactiva solo con el club en preparación o activo", () => {
    expect(memberActions(member({ active: false }), "ACTIVE").reactivate).toBe(true);
    expect(memberActions(member({ active: false }), "ENDED").reactivate).toBe(false);
  });

  it("altas según el estado del club", () => {
    expect(canAddStaff("DRAFT")).toBe(true);
    expect(canAddStaff("PAUSED")).toBe(false);
  });
});
