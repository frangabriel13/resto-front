"use client";

import { useRouter } from "next/navigation";
import { CredentialsForm, type Credentials } from "@/components/auth/credentials-form";
import { adminRoutes } from "@/lib/admin/routes";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";

export function AdminLoginForm() {
  const router = useRouter();

  async function login(body: Credentials) {
    const result = await callApi(api.POST("/auth/admin/login", { body }));
    if (!result.ok) return result.message;
    router.replace(adminRoutes.merchants);
  }

  return <CredentialsForm submit={login} />;
}
