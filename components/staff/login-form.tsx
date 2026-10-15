"use client";

import { useRouter } from "next/navigation";
import { CredentialsForm, type Credentials } from "@/components/auth/credentials-form";
import { callApi } from "@/lib/api/call-api";
import { api } from "@/lib/api/client";
import { staffNextStep } from "@/lib/staff/access";

export function LoginForm() {
  const router = useRouter();

  async function login(body: Credentials) {
    const result = await callApi(api.POST("/auth/staff/login", { body }));
    if (!result.ok) return result.message;
    router.replace(staffNextStep(result.data));
  }

  return <CredentialsForm submit={login} />;
}
