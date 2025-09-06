"use client";
import { AlertTriangle } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center mb-6">
        <span className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertTriangle className="w-16 h-16 text-destructive" />
        </span>
        <h1 className="text-6xl font-bold text-destructive mb-2">403</h1>
        <h2 className="text-2xl font-semibold mb-2">Bạn không có quyền truy cập trang này</h2>
        <p className="text-muted-foreground mb-6">Vui lòng đăng nhập với tài khoản phù hợp để tiếp tục.</p>
        <a href="/account/login" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">Quay lại đăng nhập</a>
      </div>
    </div>
  );
}
