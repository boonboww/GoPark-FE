"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";

export type BookingInfo = {
  name: string;
  vehicle: string;
  zone: string;
  spot: string;
  startTime: string;
  endTime: string;
  paymentMethod: "pay-at-parking" | "prepaid";
  estimatedFee: string;
  parkingSlotId: string;
  bookingType: "date" | "hours" | "month";
};

type DetailBookingModalProps = {
  open: boolean;
  onClose: () => void;
  bookingInfo: BookingInfo | null;
  onConfirm: () => void;
};

export default function DetailBookingModal({
  open,
  onClose,
  bookingInfo,
  onConfirm,
}: DetailBookingModalProps) {
  const router = useRouter();

  if (!bookingInfo) return null;

  const handlePayment = () => {
    localStorage.setItem("currentBooking", JSON.stringify(bookingInfo));
    if (bookingInfo.paymentMethod === "prepaid") {
      router.push("/payment");
    } else {
      onConfirm(); // Gọi API tạo booking trực tiếp nếu thanh toán tại bãi
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết đặt chỗ</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tên:</span>
            <span className="font-medium">{bookingInfo.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phương tiện:</span>
            <span className="font-medium">{bookingInfo.vehicle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Khu vực:</span>
            <span className="font-medium">{bookingInfo.zone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vị trí:</span>
            <span className="font-medium">{bookingInfo.spot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Thời gian bắt đầu:</span>
            <span className="font-medium">{bookingInfo.startTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Thời gian kết thúc:</span>
            <span className="font-medium">{bookingInfo.endTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phương thức thanh toán:</span>
            <span className="font-medium">{bookingInfo.paymentMethod === "prepaid" ? "Thanh toán trước" : "Thanh toán tại bãi"}</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="text-muted-foreground font-semibold">Phí dự kiến:</span>
            <span className="font-bold text-primary">{bookingInfo.estimatedFee}</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            onClick={handlePayment} 
            className="gap-2 bg-green-800 hover:bg-blue-900 cursor-pointer text-white me-3"
          >
            <CreditCard className="w-4 h-4" />
            Tiến hành thanh toán
          </Button>
          <Button 
            onClick={onClose} 
            variant="outline"
            className="text-gray-700 hover:bg-red-700 hover:text-white cursor-pointer"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}