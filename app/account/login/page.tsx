"use client";
// app/account/login/page.tsx
import { LoginForm } from "@/app/account/login/login-form";
import { AuthWrapper } from "@/components/features/auth/AuthWrapper";

export default function Page() {
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  );
}
