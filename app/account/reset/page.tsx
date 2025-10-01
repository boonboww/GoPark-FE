"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ResetTable } from "@/components/ResetTable";
import { Suspense } from "react";

function ResetContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get("success");

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Nút back về trang đăng nhập */}
      <button
        onClick={() => router.push('/account/login')}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer z-10"
        aria-label="Quay lại trang đăng nhập"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <div className="w-full max-w-sm">
        <ResetTable 
          successMessage={success === "true" ? "Email đặt lại mật khẩu đã được gửi thành công!" : undefined} 
        />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ResetContent />
    </Suspense>
  );
}