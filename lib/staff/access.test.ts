import { describe, expect, it } from "vitest";
import {
  currentMerchant,
  staffNextStep,
  staffRedirect,
  type StaffAccount,
} from "./access";
import { staffRoutes } from "./routes";

function account(overrides: {
  mustChangePassword?: boolean;
  selectedMerchantId?: string | null;
}): StaffAccount {
  return {
    user: {
      id: "01a13fa3-f9ff-746f-91be-843159e136da",
      name: "Dueño",
      email: "dueno@example.com",
      mustChangePassword: overrides.mustChangePassword ?? false,
    },
    merchants: [],
    selectedMerchantId:
      overrides.selectedMerchantId === undefined
        ? "01a13fa3-f9f9-7009-8133-43c40c9b6c60"
        : overrides.selectedMerchantId,
  };
}

describe("staffNextStep", () => {
  it("sin sesión, va a ingresar", () => {
    expect(staffNextStep(null)).toBe(staffRoutes.login);
  });

  it("con contraseña temporal, va a cambiarla aunque no tenga comercio", () => {
    expect(
      staffNextStep(account({ mustChangePassword: true, selectedMerchantId: null })),
    ).toBe(staffRoutes.changePassword);
  });

  it("sin comercio elegido, va a elegirlo", () => {
    expect(staffNextStep(account({ selectedMerchantId: null }))).toBe(
      staffRoutes.selectMerchant,
    );
  });

  it("con todo resuelto, va al panel", () => {
    expect(staffNextStep(account({}))).toBe(staffRoutes.home);
  });
});

describe("staffRedirect", () => {
  it("no redirige si ya está en el paso que le toca", () => {
    expect(staffRedirect(null, staffRoutes.login)).toBeNull();
    expect(staffRedirect(account({}), staffRoutes.home)).toBeNull();
  });

  it("manda a ingresar si entra al panel sin sesión", () => {
    expect(staffRedirect(null, staffRoutes.home)).toBe(staffRoutes.login);
  });

  it("saca del login a quien ya tiene sesión", () => {
    expect(staffRedirect(account({}), staffRoutes.login)).toBe(staffRoutes.home);
  });

  it("no deja saltear el cambio de contraseña", () => {
    const pending = account({ mustChangePassword: true });
    expect(staffRedirect(pending, staffRoutes.home)).toBe(staffRoutes.changePassword);
    expect(staffRedirect(pending, staffRoutes.selectMerchant)).toBe(
      staffRoutes.changePassword,
    );
  });

  it("no vuelve a cambiar la contraseña si ya la cambió", () => {
    expect(staffRedirect(account({}), staffRoutes.changePassword)).toBe(
      staffRoutes.home,
    );
  });

  it("deja elegir otro comercio con el circuito completo", () => {
    expect(staffRedirect(account({}), staffRoutes.selectMerchant)).toBeNull();
  });
});

describe("currentMerchant", () => {
  const merchants: StaffAccount["merchants"] = [
    { id: "01a14015-6b7b-75cd-a8b2-1ae5bd684538", name: "Panadería", slug: "panaderia", status: "ACTIVE", hasActiveRule: true, role: "OWNER" },
    { id: "01a14015-6bbd-76dd-9528-5f20308248ee", name: "Heladería", slug: "heladeria", status: "PAUSED", hasActiveRule: true, role: "EMPLOYEE" },
  ];

  it("devuelve el comercio elegido en la sesión", () => {
    const selected = { ...account({ selectedMerchantId: merchants[1].id }), merchants };
    expect(currentMerchant(selected)?.name).toBe("Heladería");
  });

  it("no devuelve nada si no eligió comercio", () => {
    const pending = { ...account({ selectedMerchantId: null }), merchants };
    expect(currentMerchant(pending)).toBeUndefined();
  });
});
