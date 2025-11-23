/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

function SuccessContent() {
  const router = useRouter();
  const query = useSearchParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  //|| "http://localhost:5000/api/v1"
  useEffect(() => {
    const ticketId = query.get("ticketId");
    if (!ticketId) {
      router.push("/payment/fail");
      return;
    }

    const fetchTicket = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/tickets/${ticketId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (data.status === "success" && data.data?.ticket) {
          setTicket(data.data.ticket);
        } else {
          router.push("/payment/fail");
        }
      } catch (err) {
        router.push("/payment/fail");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [query, API_URL, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải vé của bạn...</p>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full animate-fadeIn">
        {/* Icon Success */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-green-500 w-16 h-16 animate-pulse" />
        </div>

        <h1 className="text-3xl font-bold text-center text-green-600 mb-2">
          Thanh toán thành công!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Vé của bạn đã được kích hoạt. Cảm ơn bạn đã sử dụng GoPark!
        </p>

        {/* Ticket info */}
        <div className="rounded-xl border p-5 bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">Thông tin vé</h2>

          <div className="space-y-2 text-gray-700">
            <Info label="Mã Booking" value={ticket.bookingId} />
            <Info label="Mã Slot" value={ticket.slotNumber} />
            <Info label="Biển số xe" value={ticket.vehicleNumber} />
            <Info label="Loại vé" value={ticket.ticketType} />
            <Info label="Trạng thái thanh toán" value={ticket.paymentStatus} />

            {/* Thời gian */}
            <Info
              label="Thời gian đặt"
              value={new Date(ticket.createdAt).toLocaleString()}
            />
            <Info
              label="Hết hạn"
              value={new Date(ticket.expiryDate).toLocaleString()}
            />
          </div>
        </div>

        {/* QR code */}
        {ticket.qrCode && (
          <div className="mt-6 text-center">
            <h3 className="font-semibold mb-3">Mã QR Checkin</h3>
            <img
              src={ticket.qrCode}
              className="mx-auto w-52 h-52 shadow rounded-xl border bg-white"
              alt="QR code"
            />
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          className="mt-8 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Đang tải vé của bạn...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

function Info({ label, value }: any) {
  return (
    <p className="flex justify-between">
      <span className="font-medium text-gray-600">{label}:</span>
      <span className="font-semibold">{value}</span>
    </p>
  );
}
