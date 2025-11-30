"use client";
// app/account/login/page.tsx
import { LoginForm } from "@/app/account/login/login-form";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  const router = useRouter();
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Nút back về trang chủ */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer z-10"
        aria-label="Quay về trang chủ"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
