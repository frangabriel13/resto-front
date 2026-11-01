export const adminRoutes = {
  login: "/admin/ingresar",
  merchants: "/admin",
  newMerchant: "/admin/comercios/nuevo",
  merchant: (id: string) => `/admin/comercios/${id}`,
  merchantMenu: (id: string) => `/admin/comercios/${id}/carta`,
  merchantImageFailed: (id: string) => `/admin/comercios/${id}?aviso=imagen`,
} as const;
