"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogOut } from "lucide-react";

export default function SessionExpiredModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Dùng useCallback để tránh tạo lại hàm mỗi lần re-render
  const handleSessionExpired = useCallback(() => {
    // Chỉ mở modal nếu chưa mở để tránh spam
    setIsOpen((prev) => {
      if (prev) return prev;
      return true;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, [handleSessionExpired]);

  const handleLoginRedirect = () => {
    setIsOpen(false);
    // Đảm bảo chuyển hướng ngay cả khi modal đang mở
    router.push("/account/login");
  };

  const handleCloseAttempt = (open: boolean) => {
    // Không cho phép đóng modal bằng Esc hoặc click ngoài
    if (!open) return;
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseAttempt}>
      <DialogContent
        className="sm:max-w-md pointer-events-auto"
        // Ngăn đóng khi click ngoài hoặc nhấn Esc (trải nghiệm tốt hơn khi bắt buộc đăng nhập lại)
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-red-600">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
            Phiên đăng nhập đã hết hạn
          </DialogTitle>
          <DialogDescription className="pt-3 text-base leading-relaxed text-muted-foreground">
            Để bảo mật tài khoản và tiếp tục sử dụng dịch vụ, bạn cần đăng nhập lại.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          <div className="rounded-full bg-red-100 p-4">
            <LogOut className="h-10 w-10 text-red-600" aria-hidden="true" />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleLoginRedirect}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium pointer-events-auto cursor-pointer"
            autoFocus // Tự động focus để người dùng có thể nhấn Enter ngay
          >
            Đăng nhập lại
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}