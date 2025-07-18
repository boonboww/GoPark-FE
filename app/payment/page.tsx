"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentForm from "./PaymentForm";
import QrPayment from "./QrPayment";
import SuccessView from "./SuccessView";
import { Loader2 } from "lucide-react";
import { createBookingOnline } from "@/lib/api";

export type BookingInfo = {
  name: string;
  vehicle: string;
  zone: string;
  spot: string; // Slot number (e.g., "B1")
  parkingSlotId: string; // ✅ This is the ObjectId to send to BE
  startTime: string;
  endTime: string;
  paymentMethod: "pay-at-parking" | "prepaid" | "QR";
  estimatedFee: string;
};

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const booking = localStorage.getItem("currentBooking");
    if (booking) {
      try {
        const parsed = JSON.parse(booking) as BookingInfo;
        if (parsed?.name && parsed.vehicle && parsed.zone && parsed.parkingSlotId) {
          setBookingInfo(parsed);
          return;
        } else {
          console.warn("⚠️ Dữ liệu booking không đầy đủ:", parsed);
        }
      } catch (e) {
        console.error("❌ Lỗi parse booking:", e);
      }
    }
    router.push("/");
  }, [router]);

  const formatDateTime = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handlePayment = async () => {
    if (!bookingInfo) return;

    const bookingData = {
      userId: localStorage.getItem("userId") || "",
      parkingSlotId: bookingInfo.parkingSlotId,
      startTime: bookingInfo.startTime,
      endTime: bookingInfo.endTime,
      vehicleNumber: bookingInfo.vehicle,
      paymentMethod:
        bookingInfo.paymentMethod === "QR"
          ? "prepaid"
          : bookingInfo.paymentMethod,
      bookingType: "hours" as "date" | "hours" | "month", // hoặc lấy từ bookingInfo nếu cần linh hoạt
      totalPrice: parseFloat(bookingInfo.estimatedFee),
    };

    try {
      console.log("📤 Payload gửi booking:", bookingData);

      // ✅ Validate thời gian
      const now = new Date();
      const start = new Date(bookingData.startTime);
      const end = new Date(bookingData.endTime);
      if (start <= now || end <= now || end <= start) {
        console.error("❌ Thời gian không hợp lệ", {
          now,
          start: bookingData.startTime,
          end: bookingData.endTime,
        });
        return;
      }

      // ✅ Validate parkingSlotId là ObjectId
      if (!bookingData.parkingSlotId.match(/^[0-9a-fA-F]{24}$/)) {
        console.error(
          "❌ parkingSlotId không hợp lệ (phải là ObjectId):",
          bookingData.parkingSlotId
        );
        return;
      }

      setIsProcessing(true);
      const response = await createBookingOnline(bookingData);
      console.log("✅ Booking thành công:", response.data);
      setCurrentStep(3);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Lỗi khi tạo booking:", error);
      if (error?.response?.data) {
        console.log("💥 Response error:", error.response.data);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {currentStep === 1 && (
          <PaymentForm
            bookingInfo={bookingInfo}
            isProcessing={isProcessing}
            onPayment={handlePayment}
            onQrPayment={() => setCurrentStep(2)}
            formatDateTime={formatDateTime}
          />
        )}
        {currentStep === 2 && (
          <QrPayment
            onBack={() => setCurrentStep(1)}
            onComplete={handlePayment}
            bookingInfo={bookingInfo}
          />
        )}
        {currentStep === 3 && <SuccessView />}
      </div>
    </div>
  );
}
