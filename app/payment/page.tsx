"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API from "@/lib/api";
import { Car, CreditCard, Clock, MapPin, User, ArrowRight } from "lucide-react";

type BookingData = {
  userId: string;
  userName: string; // thêm userName
  parkingSlotId: string;
  slotNumber: string; // thêm slotNumber
  vehicleId?: string;
  vehicleNumber: string;
  startTime: string;
  endTime: string;
  bookingType: string;
  paymentMethod: string;
  totalPrice: number;
};

export default function PaymentPage() {
  const router = useRouter();
  const query = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);

  useEffect(() => {
    const userId = query.get("userId");
    const userName = query.get("userName") || ""; // lấy username
    const parkingSlotId = query.get("parkingSlotId");
    const slotNumber = query.get("slotNumber") || ""; // lấy slotNumber
    const vehicleNumber = query.get("vehicleNumber");
    const vehicleId = query.get("vehicleId") || undefined;
    const startTime = query.get("startTime");
    const endTime = query.get("endTime");
    const bookingType = query.get("bookingType") || "hours";
    const paymentMethod = query.get("paymentMethod") || "prepaid";
    const totalPrice = Number(query.get("totalPrice") || 0);

    if (!userId || !parkingSlotId || !vehicleNumber || !startTime || !endTime) {
      router.push("/payment/fail");
      return;
    }

    setBookingData({
      userId,
      userName,
      parkingSlotId,
      slotNumber,
      vehicleId,
      vehicleNumber,
      startTime,
      endTime,
      bookingType,
      paymentMethod,
      totalPrice,
    });
  }, []);

  const handleConfirmBooking = async () => {
    if (!bookingData) return;
    setLoading(true);

    try {
      const res = await API.post("/api/v1/bookings/bookingOnline", {
        userId: bookingData.userId,
        parkingSlotId: bookingData.parkingSlotId,
        vehicleNumber: bookingData.vehicleNumber,
        vehicleId: bookingData.vehicleId,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        bookingType: bookingData.bookingType,
        paymentMethod: bookingData.paymentMethod,
      });

      const invoice = res.data.data.invoice;
      if (!invoice?.invoiceNumber) throw new Error("Không có invoice");

      setInvoiceNumber(invoice.invoiceNumber);
      setStep(2);
    } catch (err) {
      console.error(err);
      router.push("/payment/fail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const redirectVnPay = async () => {
      if (step !== 2 || !invoiceNumber) return;

      try {
        const res = await API.post(
          `/api/v1/vnpay/create-payment/${invoiceNumber}`,
          {
            returnUrl: `${window.location.origin}/payment/success`,
            cancelUrl: `${window.location.origin}/payment/fail`,
          }
        );
        const paymentUrl = res.data.data?.paymentUrl;
        if (!paymentUrl) throw new Error("Không nhận được payment URL");

        window.location.href = paymentUrl;
      } catch (err) {
        console.error(err);
        router.push("/payment/fail");
      }
    };

    redirectVnPay();
  }, [step, invoiceNumber]);

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải dữ liệu thanh toán...</p>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chuyển sang cổng thanh toán...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full animate-[fadeIn_0.35s_ease]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Xác nhận thông tin đặt chỗ
        </h2>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <User className="text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Người đặt</p>
              <p className="font-semibold">{bookingData.userName}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Car className="text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Xe</p>
              <p className="font-semibold">{bookingData.vehicleNumber}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Vị trí đỗ</p>
              <p className="font-semibold">{bookingData.slotNumber}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Clock className="text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Thời gian</p>
              <p className="font-semibold">
                {new Date(bookingData.startTime).toLocaleString()} -{" "}
                {new Date(bookingData.endTime).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <CreditCard className="text-gray-600 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Tổng phí</p>
              <p className="font-semibold text-xl text-green-600">
                {bookingData.totalPrice.toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirmBooking}
          disabled={loading}
          className="mt-6 flex items-center justify-center space-x-2 w-full bg-black text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-900 transition disabled:bg-gray-500"
        >
          <span>{loading ? "Đang xử lý..." : "Xác nhận và thanh toán"}</span>
          {!loading && <ArrowRight />}
        </button>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
