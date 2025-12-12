"use client";
// app/account/login/page.tsx
import { Suspense } from "react";
import { LoginForm } from "@/app/account/login/login-form";
import { AuthWrapper } from "@/components/features/auth/AuthWrapper";

export default function Page() {
  return (
    <AuthWrapper align="right">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthWrapper>
  );
}
