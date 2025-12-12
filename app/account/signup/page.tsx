"use client";
// app/account/signup/page.tsx
import SignupForm from "@/app/account/signup/SignupForm";
import { AuthWrapper } from "@/components/features/auth/AuthWrapper";

export default function SignupPage() {
  return (
    <AuthWrapper align="left">
      <SignupForm />
    </AuthWrapper>
  );
}
