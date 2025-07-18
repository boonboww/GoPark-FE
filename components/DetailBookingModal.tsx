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

type ParkingSlot = {
  _id: string;
  slotNumber: string;
};

type DetailBookingModalProps = {
  open: boolean;
  onClose: () => void;
  selectedSlot: ParkingSlot | null;
  bookingMeta: {
    name: string;
    vehicle: string;
    zone: string;
    startTime: string;
    endTime: string;
    paymentMethod: "pay-at-parking" | "prepaid";
    estimatedFee: string;
    bookingType: "date" | "hours" | "month";
  };
  onConfirm: (bookingInfo: BookingInfo) => void;
};

export default function DetailBookingModal({
  open,
  onClose,
  selectedSlot,
  bookingMeta,
  onConfirm,
}: DetailBookingModalProps) {
  const router = useRouter();

  if (!selectedSlot || !bookingMeta) return null;

  const bookingInfo: BookingInfo = {
    ...bookingMeta,
    spot: selectedSlot.slotNumber,
    parkingSlotId: selectedSlot._id,
  };

  const handlePayment = () => {
    console.log("📦 bookingInfo chuẩn bị lưu:", bookingInfo);

    if (!bookingInfo.parkingSlotId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("❌ parkingSlotId không hợp lệ:", bookingInfo.parkingSlotId);
      return;
    }

    localStorage.setItem("currentBooking", JSON.stringify(bookingInfo));

    if (bookingInfo.paymentMethod === "prepaid") {
      router.push("/payment");
    } else {
      onConfirm(bookingInfo); // Gửi booking nếu thanh toán tại bãi
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
          <div className="flex justify-between"><span className="text-muted-foreground">Tên:</span><span className="font-medium">{bookingMeta.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Phương tiện:</span><span className="font-medium">{bookingMeta.vehicle}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Khu vực:</span><span className="font-medium">{bookingMeta.zone}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Vị trí:</span><span className="font-medium">{selectedSlot.slotNumber}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Thời gian bắt đầu:</span><span className="font-medium">{bookingMeta.startTime}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Thời gian kết thúc:</span><span className="font-medium">{bookingMeta.endTime}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Phương thức thanh toán:</span><span className="font-medium">{bookingMeta.paymentMethod === "prepaid" ? "Thanh toán trước" : "Thanh toán tại bãi"}</span></div>
          <div className="flex justify-between pt-2 border-t">
            <span className="text-muted-foreground font-semibold">Phí dự kiến:</span>
            <span className="font-bold text-primary">{bookingMeta.estimatedFee}</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button onClick={handlePayment} className="gap-2 bg-green-800 hover:bg-blue-900 cursor-pointer text-white me-3">
            <CreditCard className="w-4 h-4" />
            Tiến hành thanh toán
          </Button>
          <Button onClick={onClose} variant="outline" className="text-gray-700 hover:bg-red-700 hover:text-white cursor-pointer">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
