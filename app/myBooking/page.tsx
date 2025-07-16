"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ParkingSquare,
  MapPin,
  Clock,
  CheckCircle,
  Eye,
  Car,
  Trash2,
  Star,
} from "lucide-react";
import BookingDetail from "./BookingDetail";
import { Booking } from "./types";

export default function MyBookingPage() {
  const router = useRouter();

  const [activeBookings, setActiveBookings] = useState<Booking[]>([
    {
      id: 1,
      parkingName: "Bãi đỗ Trung tâm",
      location: "123 Đường Chính, Trung tâm Thành phố",
      time: "10/07/2025 - 10:00",
      status: "active",
      image: "/b1.jpg",
      feeEstimate: "100.000 - 200.000 VNĐ",
      package: "Theo giờ",
      plateNumber: "43A-12345",
      spotNumber: "A12",
      zone: "Khu vực 1",
    },
  ]);

  const [historyBookings, setHistoryBookings] = useState<Booking[]>([
    {
      id: 2,
      parkingName: "Bãi đỗ Trung tâm Thương mại",
      location: "456 Đường Trung tâm, Thượng Thành",
      time: "01/07/2025 - 14:00",
      status: "completed",
      image: "/b1.jpg",
      feeEstimate: "300.000 VNĐ",
      package: "Theo ngày",
      plateNumber: "43B1-67890",
      spotNumber: "B7",
      zone: "Khu vực 2",
    },
    {
      id: 3,
      parkingName: "Bãi đỗ Sân bay",
      location: "Đường Sân bay, Quận 3",
      time: "15/06/2025 - 09:00",
      status: "cancelled",
      image: "/b1.jpg",
      feeEstimate: "160.000 VNĐ",
      package: "Theo giờ",
      plateNumber: "43C-11223",
      spotNumber: "C3",
      zone: "Khu vực 1",
    },
  ]);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showNoBookingMsg, setShowNoBookingMsg] = useState(false);

  const handleCancel = (id: number) => {
    if (confirm("Bạn có chắc chắn muốn hủy đặt chỗ này không?")) {
      const cancelled = activeBookings.find((b) => b.id === id);
      if (cancelled) {
        setActiveBookings(activeBookings.filter((b) => b.id !== id));
        setHistoryBookings([{ ...cancelled, status: "cancelled" }, ...historyBookings]);
        setShowNoBookingMsg(true);
      }
    }
  };

  const handleReview = (booking: Booking) => {
    alert(`✅ Viết đánh giá cho ${booking.parkingName}`);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen mt-20 px-4 py-12 flex flex-col items-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-8">Đặt chỗ của tôi</h1>

        {showNoBookingMsg && (
          <div className="bg-yellow-100 border border-yellow-400 p-4 rounded mb-6 max-w-4xl w-full flex justify-between items-center">
            <span>🚗 Bạn chưa có chỗ đỗ xe? Tìm ngay một chỗ trong khu vực bạn muốn!</span>
            <Button
              onClick={() => router.push("/")}
              className="ml-4 bg-black cursor-pointer text-white hover:bg-gray-900"
            >
              Tìm ngay
            </Button>
          </div>
        )}

        <section className="w-full max-w-4xl mb-12">
          <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2 mb-4">
            <ParkingSquare className="w-5 h-5" /> Đặt chỗ hiện tại
          </h2>

          {activeBookings.length === 0 ? (
            <p className="text-gray-600">Bạn chưa có đặt chỗ nào đang hoạt động.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeBookings.map((b) => (
                <div
                  key={b.id}
                  className="border rounded-lg shadow-sm p-4 flex flex-col gap-2 bg-white"
                >
                  <img
                    src={b.image}
                    alt={b.parkingName}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h3 className="font-semibold flex items-center gap-1 text-lg">
                    <MapPin className="w-4 h-4" /> {b.parkingName}
                  </h3>
                  <p className="text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {b.time}
                  </p>
                  <p className="text-sm flex items-center gap-1">
                    <Car className="w-4 h-4" /> Biển số: {b.plateNumber}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedBooking(b)}
                      className="flex gap-1 items-center cursor-pointer"
                    >
                      <Eye className="w-4 h-4" /> Xem
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleCancel(b.id)}
                      className="flex gap-1 items-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> Hủy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="w-full max-w-4xl">
          <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5" /> Lịch sử đặt chỗ
          </h2>

          {historyBookings.length === 0 ? (
            <p className="text-gray-600">Chưa có lịch sử đặt chỗ.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {historyBookings.map((b) => (
                <div
                  key={b.id}
                  className={`border rounded-lg shadow-sm p-4 flex flex-col gap-2 bg-white ${
                    b.status === "cancelled" ? "opacity-70" : ""
                  }`}
                >
                  <img
                    src={b.image}
                    alt={b.parkingName}
                    className="w-full h-40 object-cover rounded"
                  />
                  <h3 className="font-semibold flex items-center gap-1 text-lg">
                    <MapPin className="w-4 h-4" /> {b.parkingName}
                  </h3>
                  <p className="text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {b.time}
                  </p>
                  <p className="text-sm flex items-center gap-1">
                    <Car className="w-4 h-4" /> Biển số: {b.plateNumber}
                  </p>
                  {b.status === "completed" && (
                    <Button
                      variant="outline"
                      onClick={() => handleReview(b)}
                      className="flex gap-1 items-center cursor-pointer mt-2"
                    >
                      <Star className="w-4 h-4" /> Viết đánh giá
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedBooking && (
          <BookingDetail
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
      </main>
      <Footer />
    </>
  );
}