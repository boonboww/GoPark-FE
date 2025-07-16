"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function PolicyForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-full max-w-full
          md:w-[70vw] md:max-w-[70vw]
          h-[75vh] md:h-[75vh]
          overflow-y-auto md:overflow-visible
          rounded-2xl p-4 md:p-12
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl md:text-3xl font-bold text-gray-800">
            Chính Sách Hệ Thống Bãi Đỗ Xe
          </DialogTitle>
        </DialogHeader>

        <div
          className="
            mt-4 md:mt-6
            grid md:grid-cols-2 gap-6 md:gap-12
            text-sm md:text-lg
            text-gray-700
            leading-relaxed
          "
        >
          <section>
            <h3 className="font-semibold mb-2 text-base md:text-xl">📌 Yêu Cầu Chung</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Cung cấp thông tin trung thực và cập nhật về bãi đỗ xe của bạn.</li>
              <li>Luôn cập nhật thông tin hồ sơ mới nhất.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2 text-base md:text-xl">🔐 An Toàn & Bảo Mật</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Đảm bảo bãi đỗ xe đủ ánh sáng và an ninh.</li>
              <li>Hiển thị rõ thông tin liên hệ khẩn cấp và giờ hoạt động.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2 text-base md:text-xl">💲 Giá Cả & Thanh Toán</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Giá cả phải minh bạch cho mọi khách hàng.</li>
              <li>Xử lý thanh toán và hoàn tiền theo quyền lợi người tiêu dùng.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2 text-base md:text-xl">🤝 Dịch Vụ Khách Hàng</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Phản hồi nhanh chóng và lịch sự mọi câu hỏi của khách hàng.</li>
              <li>Cung cấp kênh hỗ trợ rõ ràng cho khiếu nại.</li>
            </ul>
          </section>

          <section className="md:col-span-2">
            <h3 className="font-semibold mb-2 text-base md:text-xl">✅ Cam Kết</h3>
            <p>
              Bằng việc đăng ký, bạn xác nhận đã đọc, hiểu và đồng ý tuân thủ tất cả
              các chính sách trên. Vi phạm có thể dẫn đến đình chỉ tài khoản hoặc hậu quả pháp lý.
            </p>
          </section>
        </div>

        <DialogFooter className="mt-8">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full md:w-auto"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}