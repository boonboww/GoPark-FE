"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ParkingSquare,
  MapPin,
  Clock,
  Eye,
  Car,
  Trash2,
  CreditCard,
  Loader2,
  RefreshCw,
  AlertCircle,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Timer,
} from "lucide-react";
import BookingDetail from "./BookingDetail";
import { Booking } from "./types";
import {
  getUserBookings,
  cancelBooking,
  formatBookingForUI,
} from "@/lib/booking.api";
import { cn } from "@/lib/utils";

export default function MyBookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "completed" | "cancelled"
  >("all");

  // Load bookings from API
  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings();

      if (response.status === "success" && response.data) {
        const formattedBookings = response.data.map(formatBookingForUI);
        // Sort by date descending (newest first)
        formattedBookings.sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
        setBookings(formattedBookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("❌ Error loading bookings:", error);
      toast.error("Không thể tải danh sách đặt chỗ. Vui lòng thử lại!");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    try {
      setCancelling(bookingId);
      const response = await cancelBooking(bookingId);

      if (response.status === "success") {
        toast.success("Đã hủy đặt chỗ thành công");
        // Update local state
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: "cancelled" as const } : b
          )
        );
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Không thể hủy đặt chỗ");
    } finally {
      setCancelling(null);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "active")
        return ["pending", "confirmed", "active"].includes(booking.status);
      if (filterStatus === "completed") return booking.status === "completed";
      if (filterStatus === "cancelled") return booking.status === "cancelled";
      return true;
    });
  }, [bookings, filterStatus]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      active: bookings.filter((b) =>
        ["pending", "confirmed", "active"].includes(b.status)
      ).length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };
  }, [bookings]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
      case "confirmed":
        return {
          label: "Đang hoạt động",
          color: "text-green-600 bg-green-50 border-green-200",
          icon: CheckCircle2,
        };
      case "pending":
        return {
          label: "Chờ xác nhận",
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
          icon: Timer,
        };
      case "completed":
        return {
          label: "Hoàn thành",
          color: "text-blue-600 bg-blue-50 border-blue-200",
          icon: CheckCircle2,
        };
      case "cancelled":
        return {
          label: "Đã hủy",
          color: "text-red-600 bg-red-50 border-red-200",
          icon: XCircle,
        };
      default:
        return {
          label: status,
          color: "text-gray-600 bg-gray-50 border-gray-200",
          icon: AlertCircle,
        };
    }
  };

  const renderBookingCard = (booking: Booking) => {
    const hasImageError = imageErrors.has(booking.id);
    const imageSrc = hasImageError ? "/b1.jpg" : booking.image || "/b1.jpg";
    const statusConfig = getStatusConfig(booking.status);
    const StatusIcon = statusConfig.icon;
    const isCancelable = ["pending", "confirmed"].includes(booking.status);

    return (
      <div
        key={booking.id}
        className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div
            className="relative w-full md:w-48 h-48 md:h-auto shrink-0 cursor-pointer"
            onClick={() => router.push(`/detailParking/${booking.parkingId}`)}
          >
            <Image
              src={imageSrc}
              alt={booking.parkingName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() =>
                setImageErrors((prev) => new Set([...prev, booking.id]))
              }
            />
            <div className="absolute top-3 left-3 md:hidden">
              <Badge
                className={cn(
                  "font-medium border shadow-sm",
                  statusConfig.color
                )}
              >
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig.label}
              </Badge>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3
                    className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(`/detailParking/${booking.parkingId}`)
                    }
                  >
                    {booking.parkingName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="line-clamp-1">{booking.location}</span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Badge
                    className={cn(
                      "font-medium border px-3 py-1",
                      statusConfig.color
                    )}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-6 mt-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-full bg-blue-50 text-blue-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Thời gian
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(booking.startTime).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-full bg-purple-50 text-purple-600">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Biển số</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {booking.plateNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-full bg-green-50 text-green-600">
                    <ParkingSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Vị trí</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {booking.zone}-{booking.spotNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-full bg-orange-50 text-orange-600">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Tổng phí
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                      {booking.fee}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
              {isCancelable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmCancelId(booking.id)}
                  disabled={cancelling === booking.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                >
                  {cancelling === booking.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Hủy
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBooking(booking)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 cursor-pointer"
              >
                <Eye className="w-4 h-4 mr-2" />
                Chi tiết
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen mt-20 bg-gray-50/50">
          <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">
              Đang tải dữ liệu...
            </h2>
            <p className="text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen mt-20 bg-gray-50/50 pb-20">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý đặt chỗ
              </h1>
              <p className="text-gray-500 mt-1">
                Xem và quản lý lịch sử đỗ xe của bạn
              </p>
            </div>
            <Button
              onClick={loadBookings}
              variant="outline"
              className="bg-white hover:bg-gray-50 shadow-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Tổng đơn</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.total}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <p className="text-sm text-gray-500 font-medium">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats.active}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Hoàn thành</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {stats.completed}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Đã hủy</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {stats.cancelled}
              </p>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white p-1.5 rounded-lg border shadow-sm inline-flex mb-6 overflow-x-auto max-w-full">
            {[
              { id: "all", label: "Tất cả" },
              { id: "active", label: "Đang hoạt động" },
              { id: "completed", label: "Hoàn thành" },
              { id: "cancelled", label: "Đã hủy" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                  filterStatus === tab.id
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Không tìm thấy đặt chỗ nào
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  {filterStatus === "all"
                    ? "Bạn chưa có lịch sử đặt chỗ nào. Hãy thử tìm kiếm bãi đỗ xe ngay!"
                    : "Không có đặt chỗ nào trong trạng thái này."}
                </p>
                {filterStatus === "all" && (
                  <Button
                    onClick={() => router.push("/")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Tìm chỗ đỗ xe ngay
                  </Button>
                )}
              </div>
            ) : (
              filteredBookings.map((booking) => renderBookingCard(booking))
            )}
          </div>

          {/* Modals */}
          {selectedBooking && (
            <BookingDetail
              booking={selectedBooking}
              onClose={() => setSelectedBooking(null)}
            />
          )}

          {!!confirmCancelId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setConfirmCancelId(null)}
              />
              <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-4 text-red-600">
                  <div className="p-2 bg-red-50 rounded-full">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Xác nhận hủy đặt chỗ
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn hủy đặt chỗ này không? Hành động này
                  không thể hoàn tác.
                </p>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmCancelId(null)}
                  >
                    Đóng
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirmCancelId) handleCancel(confirmCancelId);
                      setConfirmCancelId(null);
                    }}
                  >
                    Xác nhận hủy
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
