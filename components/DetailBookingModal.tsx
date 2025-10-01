"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { createBookingOnline } from "@/lib/api";
import { toast } from "sonner";

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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (!selectedSlot || !bookingMeta) return null;

  const bookingInfo: BookingInfo = {
    ...bookingMeta,
    spot: selectedSlot.slotNumber,
    parkingSlotId: selectedSlot._id,
  };

  // Hàm format thời gian để hiển thị đúng múi giờ địa phương
  const formatDateTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime); // Không thêm :00Z
      return date.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handlePayment = useCallback(async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsProcessing(true);
    setIsLoading(true);
    setLoadingMessage("Đang xác thực thông tin...");
    console.log("📦 bookingInfo chuẩn bị lưu:", bookingInfo);

    if (!bookingInfo.parkingSlotId.match(/^[0-9a-fA-F]{24}$/)) {
      setErrorMessage("ID vị trí đỗ xe không hợp lệ!");
      console.error("❌ parkingSlotId không hợp lệ:", bookingInfo.parkingSlotId);
      toast.error("ID vị trí đỗ xe không hợp lệ!");
      setIsProcessing(false);
      setIsLoading(false);
      return;
    }

    // Lấy userId từ localStorage và kiểm tra hợp lệ
    const userId = localStorage.getItem("userId") || "";
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      setErrorMessage("Không tìm thấy thông tin người dùng hợp lệ. Vui lòng đăng nhập lại!");
      toast.error("Không tìm thấy thông tin người dùng hợp lệ. Vui lòng đăng nhập lại!");
      setIsProcessing(false);
      setIsLoading(false);
      return;
    }

    // Validate các trường bắt buộc
    if (!bookingInfo.vehicle || !bookingInfo.vehicle.trim()) {
      setErrorMessage("Vui lòng chọn phương tiện!");
      toast.error("Vui lòng chọn phương tiện!");
      setIsProcessing(false);
      setIsLoading(false);
      return;
    }

    if (!bookingInfo.startTime || !bookingInfo.endTime) {
      setErrorMessage("Vui lòng chọn thời gian bắt đầu và kết thúc!");
      toast.error("Vui lòng chọn thời gian bắt đầu và kết thúc!");
      setIsProcessing(false);
      setIsLoading(false);
      return;
    }
    // Parse estimatedFee - có thể là số thuần túy hoặc format "123,456 VNĐ"
    const cleanFee = bookingInfo.estimatedFee.replace(/[,\sVNĐ]/g, '');
    const totalPrice = parseFloat(cleanFee);

    // Validate và convert thời gian
    const startDate = new Date(bookingInfo.startTime);
    const endDate = new Date(bookingInfo.endTime);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setErrorMessage("Thời gian không hợp lệ!");
      toast.error("Thời gian không hợp lệ!");
      setIsProcessing(false);
      setIsLoading(false);
      return;
    }
    
    const bookingData = {
      userId,
      parkingSlotId: bookingInfo.parkingSlotId,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      vehicleNumber: bookingInfo.vehicle.trim(),
      paymentMethod: bookingInfo.paymentMethod,
      bookingType: bookingInfo.bookingType,
      totalPrice: totalPrice,
    };

    try {
      const now = new Date();
      const start = new Date(bookingData.startTime);
      const end = new Date(bookingData.endTime);
      
      console.log("🕐 Time validation debug:", {
        originalStartTime: bookingInfo.startTime,
        originalEndTime: bookingInfo.endTime,
        isoStartTime: bookingData.startTime,
        isoEndTime: bookingData.endTime,
        parsedStart: start,
        parsedEnd: end,
        now: now,
        startValid: !isNaN(start.getTime()),
        endValid: !isNaN(end.getTime()),
        startFuture: start > now,
        endFuture: end > now,
        startBeforeEnd: start < end
      });
      
      const bufferMinutes = 5;
      if (start <= new Date(now.getTime() + bufferMinutes * 60 * 1000)) {
        setErrorMessage(`Thời gian bắt đầu phải sau thời gian hiện tại ít nhất ${bufferMinutes} phút!`);
        console.error("❌ Thời gian không hợp lệ", { now, start: bookingData.startTime, end: bookingData.endTime });
        toast.error(`Thời gian bắt đầu phải sau thời gian hiện tại ít nhất ${bufferMinutes} phút!`);
        setIsProcessing(false);
        return;
      }
      if (end <= start) {
        setErrorMessage("Thời gian kết thúc phải sau thời gian bắt đầu!");
        console.error("❌ Thời gian không hợp lệ", { now, start: bookingData.startTime, end: bookingData.endTime });
        toast.error("Thời gian kết thúc phải sau thời gian bắt đầu!");
        setIsProcessing(false);
        return;
      }

      if (isNaN(totalPrice) || totalPrice <= 0) {
        setErrorMessage("Phí dự kiến không hợp lệ!");
        console.error("❌ Phí dự kiến không hợp lệ:", { 
          originalFee: bookingInfo.estimatedFee, 
          cleanFee: cleanFee, 
          parsedPrice: totalPrice 
        });
        toast.error("Phí dự kiến không hợp lệ!");
        setIsProcessing(false);
        setIsLoading(false);
        return;
      }

      // Validate basic requirements
      if (!bookingData.vehicleNumber || bookingData.vehicleNumber.length < 3) {
        setErrorMessage("Biển số xe không hợp lệ!");
        toast.error("Biển số xe phải có ít nhất 3 ký tự!");
        setIsProcessing(false);
        setIsLoading(false);
        return;
      }

      if (!bookingData.totalPrice || bookingData.totalPrice <= 0) {
        setErrorMessage("Giá tiền không hợp lệ!");
        toast.error("Giá tiền phải lớn hơn 0!");
        setIsProcessing(false);
        setIsLoading(false);
        return;
      }

      setLoadingMessage("Đang tạo vé đỗ xe...");
      
      console.log("📤 Sending booking data:", bookingData);
      console.log("📊 BookingData details:", {
        userId: bookingData.userId,
        userIdValid: bookingData.userId.match(/^[0-9a-fA-F]{24}$/),
        parkingSlotId: bookingData.parkingSlotId,
        slotIdValid: bookingData.parkingSlotId.match(/^[0-9a-fA-F]{24}$/),
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        vehicleNumber: bookingData.vehicleNumber,
        vehicleNumberLength: bookingData.vehicleNumber.length,
        paymentMethod: bookingData.paymentMethod,
        bookingType: bookingData.bookingType,
        totalPrice: bookingData.totalPrice,
        totalPriceType: typeof bookingData.totalPrice
      });

      const response = await createBookingOnline(bookingData);
      console.log("✅ Booking thành công:", response.data);
      
      setLoadingMessage("Đang lưu thông tin vé...");
      localStorage.setItem("currentBooking", JSON.stringify(bookingInfo));
      
      setLoadingMessage("Hoàn thành!");
      
      // Delay ngắn để user thấy message hoàn thành
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLoading(false);
      setSuccessMessage("Đặt chỗ và tạo vé thành công!");
      setShowSuccessModal(true);
      toast.success("Đặt chỗ và tạo vé thành công!");
      onConfirm(bookingInfo);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Lỗi khi tạo booking:", error);
      console.error("❌ Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      setIsLoading(false);
      setErrorMessage(
        error?.response?.data?.message || "Đã xảy ra lỗi khi đặt chỗ. Vui lòng thử lại!"
      );
      toast.error(
        error?.response?.data?.message || "Đã xảy ra lỗi khi đặt chỗ. Vui lòng thử lại!"
      );
      console.log("💥 Response error:", error.response?.data || error.message);
    } finally {
      setIsProcessing(false);
    }
  }, [bookingInfo, onConfirm]);

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
    
    // Reset tất cả states
    setSuccessMessage("");
    setErrorMessage("");
    setLoadingMessage("");
  };

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
      
      {/* Loading Modal */}
      <Dialog open={isLoading} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md rounded-lg" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="sr-only">Đang xử lý</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            {/* Loading Spinner */}
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            {/* Loading Message */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Đang xử lý...
            </h3>
            
            <p className="text-gray-600 text-sm">
              {loadingMessage}
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={handleSuccessModalClose}>
        <DialogContent className="sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="sr-only">Thông báo thành công</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            {/* Icon thành công */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            {/* Tiêu đề */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Thành công!
            </h3>
            
            {/* Thông báo */}
            <p className="text-gray-600 mb-6">
              {successMessage}
            </p>
            
            {/* Nút đóng */}
            <Button 
              onClick={handleSuccessModalClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md"
            >
              Hoàn thành
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}