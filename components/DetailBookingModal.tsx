
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { createBookingOnline } from "@/lib/api";
import { toast } from "sonner"; // Sử dụng sonner thay vì react-hot-toast

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!selectedSlot || !bookingMeta) return null;

  const bookingInfo: BookingInfo = {
    ...bookingMeta,
    spot: selectedSlot.slotNumber,
    parkingSlotId: selectedSlot._id,
  };

  // Hàm format thời gian để hiển thị thân thiện
  const formatDateTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime + ":00Z");
      return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return dateTime; // Fallback nếu parse thất bại
    }
  };

  const handlePayment = useCallback(async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsProcessing(true);
    console.log("📦 bookingInfo chuẩn bị lưu:", bookingInfo);

    if (!bookingInfo.parkingSlotId.match(/^[0-9a-fA-F]{24}$/)) {
      setErrorMessage("ID vị trí đỗ xe không hợp lệ!");
      console.error("❌ parkingSlotId không hợp lệ:", bookingInfo.parkingSlotId);
      toast.error("ID vị trí đỗ xe không hợp lệ!"); // Sử dụng sonner toast
      setIsProcessing(false);
      return;
    }

    const bookingData = {
      userId: localStorage.getItem("userId") || "",
      parkingSlotId: bookingInfo.parkingSlotId,
      startTime: new Date(bookingInfo.startTime + ":00Z").toISOString(),
      endTime: new Date(bookingInfo.endTime + ":00Z").toISOString(),
      vehicleNumber: bookingInfo.vehicle,
      paymentMethod: bookingInfo.paymentMethod,
      bookingType: bookingInfo.bookingType,
      totalPrice: parseFloat(bookingInfo.estimatedFee),
    };

    try {
      // Validate thời gian
      const now = new Date();
      const start = new Date(bookingData.startTime);
      const end = new Date(bookingData.endTime);
      const bufferMinutes = 5; // Yêu cầu startTime cách now ít nhất 5 phút
      if (start <= new Date(now.getTime() + bufferMinutes * 60 * 1000)) {
        setErrorMessage(`Thời gian bắt đầu phải sau thời gian hiện tại ít nhất ${bufferMinutes} phút!`);
        console.error("❌ Thời gian không hợp lệ", {
          now,
          start: bookingData.startTime,
          end: bookingData.endTime,
        });
        toast.error(`Thời gian bắt đầu phải sau thời gian hiện tại ít nhất ${bufferMinutes} phút!`); // Sử dụng sonner toast
        setIsProcessing(false);
        return;
      }
      if (end <= start) {
        setErrorMessage("Thời gian kết thúc phải sau thời gian bắt đầu!");
        console.error("❌ Thời gian không hợp lệ", {
          now,
          start: bookingData.startTime,
          end: bookingData.endTime,
        });
        toast.error("Thời gian kết thúc phải sau thời gian bắt đầu!"); // Sử dụng sonner toast
        setIsProcessing(false);
        return;
      }

      if (isNaN(bookingData.totalPrice)) {
        setErrorMessage("Phí dự kiến không hợp lệ!");
        console.error("❌ Phí dự kiến không hợp lệ:", bookingInfo.estimatedFee);
        toast.error("Phí dự kiến không hợp lệ!"); // Sử dụng sonner toast
        setIsProcessing(false);
        return;
      }

      const response = await createBookingOnline(bookingData);
      console.log("✅ Booking thành công:", response.data);
      localStorage.setItem("currentBooking", JSON.stringify(bookingInfo));
      setSuccessMessage("Đặt chỗ thành công!");
      toast.success("Đặt chỗ thành công!"); // Sử dụng sonner toast
      onConfirm(bookingInfo);
    } catch (error: any) {
      console.error("❌ Lỗi khi tạo booking:", error);
      setErrorMessage(
        error?.response?.data?.message || "Đã xảy ra lỗi khi đặt chỗ. Vui lòng thử lại!"
      );
      toast.error(
        error?.response?.data?.message || "Đã xảy ra lỗi khi đặt chỗ. Vui lòng thử lại!"
      ); // Sử dụng sonner toast
      console.log("💥 Response error:", error.response?.data || error.message);
    } finally {
      setIsProcessing(false);
    }
  }, [bookingInfo, onConfirm]);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết đặt chỗ</DialogTitle>
        </DialogHeader>

        {isProcessing ? (
          <div className="text-center py-6">
            <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-blue-600 font-semibold text-lg">Đang xử lý thanh toán...</p>
          </div>
        ) : successMessage || errorMessage ? (
          <div className="text-center py-6">
            {successMessage ? (
              <>
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-green-600 font-semibold text-lg">{successMessage}</p>
              </>
            ) : (
              <>
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <p className="text-red-600 font-semibold text-lg">{errorMessage}</p>
              </>
            )}
            <Button
              onClick={onClose}
              className="mt-4 bg-green-800 hover:bg-blue-900 text-white"
            >
              Đóng
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Tên:</span><span className="font-medium">{bookingMeta.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Phương tiện:</span><span className="font-medium">{bookingMeta.vehicle}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Khu vực:</span><span className="font-medium">{bookingMeta.zone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Vị trí:</span><span className="font-medium">{selectedSlot.slotNumber}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Thời gian bắt đầu:</span><span className="font-medium">{formatDateTime(bookingMeta.startTime)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Thời gian kết thúc:</span><span className="font-medium">{formatDateTime(bookingMeta.endTime)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Phương thức thanh toán:</span><span className="font-medium">{bookingMeta.paymentMethod === "prepaid" ? "Thanh toán trước" : "Thanh toán tại bãi"}</span></div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-muted-foreground font-semibold">Phí dự kiến:</span>
                <span className="font-bold text-primary">{parseFloat(bookingMeta.estimatedFee).toLocaleString("vi-VN")} VNĐ</span>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="gap-2 bg-green-800 hover:bg-blue-900 cursor-pointer text-white me-3"
              >
                <CreditCard className="w-4 h-4" />
                Tiến hành thanh toán
              </Button>
              <Button onClick={onClose} variant="outline" className="text-gray-700 hover:bg-red-700 hover:text-white cursor-pointer">
                Đóng
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
