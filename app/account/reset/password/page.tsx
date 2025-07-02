"use client";

import { useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/components/ResetForm"

export default function Page() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        {!token ? (
          <p className="text-center text-red-500">
            Reset token not found. Please check your email link and try again.
          </p>
        ) : (
          <ResetPasswordForm />
        )}
      </div>
    </div>
  );
}
