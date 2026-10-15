export const adminRoutes = {
  login: "/admin/ingresar",
  merchants: "/admin",
  newMerchant: "/admin/comercios/nuevo",
  merchant: (id: string) => `/admin/comercios/${id}`,
} as const;
