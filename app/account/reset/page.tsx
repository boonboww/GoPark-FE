"use client";
import { useSearchParams } from "next/navigation";
import { ResetTable } from "@/components/ResetTable";
import { Suspense } from "react";

function ResetContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
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