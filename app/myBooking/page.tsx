"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calendar
} from "lucide-react";
import BookingDetail from "./BookingDetail";
import { Booking } from "./types";
import { getUserBookings, cancelBooking, formatBookingForUI } from "@/lib/booking.api";



export default function MyBookingPage() {
  const router = useRouter();
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [historyBookings, setHistoryBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  // Load bookings from API
  const loadBookings = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading user bookings...");
      const response = await getUserBookings();
      console.log("📝 API Response:", response);
      
      if (response.status === "success" && response.data) {
        console.log("✅ Raw booking data:", response.data);
        const formattedBookings = response.data.map(formatBookingForUI);
        console.log("🎨 Formatted bookings:", formattedBookings);
        
        // Separate active and completed bookings
        const active = formattedBookings.filter(booking => 
          booking.status === "pending" || 
          booking.status === "confirmed" || 
          booking.status === "active"
        );
        
        const history = formattedBookings.filter(booking => 
          booking.status === "completed" || 
          booking.status === "cancelled"
        );
        
        console.log("🟢 Active bookings:", active);
        console.log("📚 History bookings:", history);
        
        setActiveBookings(active);
        setHistoryBookings(history);
      } else {
        console.log("⚠️ No booking data in response");
        setActiveBookings([]);
        setHistoryBookings([]);
      }
    } catch (error) {
      console.error("❌ Error loading bookings:", error);
      toast.error("Không thể tải danh sách đặt chỗ. Vui lòng thử lại!");
      setActiveBookings([]);
      setHistoryBookings([]);
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
        // Move booking from active to history
        const cancelled = activeBookings.find((b) => b.id === bookingId);
        if (cancelled) {
          const updatedBooking = { ...cancelled, status: "cancelled" as const };
          setActiveBookings(activeBookings.filter((b) => b.id !== bookingId));
          setHistoryBookings([updatedBooking, ...historyBookings]);
        }
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Không thể hủy đặt chỗ");
    } finally {
      setCancelling(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Đang hoạt động</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Chờ xác nhận</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Hoàn thành</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Đã hủy</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  const renderBookingCard = (booking: Booking, showCancelButton = true) => {
    const hasImageError = imageErrors.has(booking.id);
    const imageSrc = hasImageError ? "/b1.jpg" : (booking.image || "/b1.jpg");
    
    return (
      <Card key={booking.id} className="mb-4 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden relative">
                <Image
                  src={imageSrc}
                  alt={booking.parkingName}
                  fill
                  className="object-cover"
                  onError={() => {
                    setImageErrors(prev => new Set([...prev, booking.id]));
                  }}
                />
              </div>
            <div>
              <h3 className="font-semibold text-lg">{booking.parkingName}</h3>
              <div className="flex items-center gap-1 text-gray-600 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{booking.location}</span>
              </div>
            </div>
          </div>
          {getStatusBadge(booking.status)}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-gray-600">Biển số</p>
              <p className="font-medium">{booking.plateNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ParkingSquare className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-gray-600">Vị trí</p>
              <p className="font-medium">{booking.zone}-{booking.spotNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-gray-600">Thời gian</p>
              <p className="font-medium">{new Date(booking.startTime).toLocaleString("vi-VN")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-gray-600">Phí</p>
              <p className="font-medium text-green-600">{booking.fee}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedBooking(booking)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 " />
            Xem chi tiết
          </Button>
          
          {showCancelButton && (booking.status === "pending" || booking.status === "confirmed") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmCancelId(booking.id)}
              disabled={cancelling === booking.id}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
            >
              {cancelling === booking.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Hủy đặt chỗ
            </Button>
          )}
  {/* Dialog xác nhận hủy */}
  <Dialog open={!!confirmCancelId} onOpenChange={() => setConfirmCancelId(null)}>
    <DialogContent className="max-w-xs">
      <DialogHeader>
        <DialogTitle>Xác nhận hủy đặt chỗ</DialogTitle>
      </DialogHeader>
      <div>Bạn có chắc chắn muốn hủy đặt chỗ này không?</div>
      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={() => setConfirmCancelId(null)}>
          Không
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            if (confirmCancelId) handleCancel(confirmCancelId);
            setConfirmCancelId(null);
          }}
        >
          Có, hủy đặt chỗ
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
        </div>
      </CardContent>
    </Card>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen mt-20 px-4 py-12 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <h1 className="text-2xl md:text-4xl font-bold">Đang tải đặt chỗ...</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen mt-20 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-4xl font-bold">Đặt chỗ của tôi</h1>
            <Button
              onClick={loadBookings}
              variant="outline"
              size="sm"
              className="flex items-center cursor-pointer gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </Button>
          </div>

          {activeBookings.length === 0 && historyBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <CardContent className="flex flex-col items-center gap-4">
                <AlertCircle className="w-16 h-16 text-gray-400" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Chưa có đặt chỗ nào</h3>
                  <p className="text-gray-600 mb-4">
                    Bạn chưa có chỗ đỗ xe nào. Hãy tìm và đặt một chỗ đỗ ngay bây giờ!
                  </p>
                  <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                    <Car className="w-4 h-4 mr-2" />
                    Tìm chỗ đỗ xe
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="active" className="flex items-center gap-2">
                  <ParkingSquare className="w-4 h-4" />
                  Đang hoạt động ({activeBookings.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Lịch sử ({historyBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {activeBookings.length === 0 ? (
                  <Card className="p-6 text-center">
                    <CardContent className="flex flex-col items-center gap-3">
                      <ParkingSquare className="w-12 h-12 text-gray-400" />
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Không có đặt chỗ đang hoạt động</h3>
                        <p className="text-gray-600">Tất cả đặt chỗ của bạn đã hoàn thành hoặc bị hủy.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {activeBookings.map((booking) => renderBookingCard(booking, true))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {historyBookings.length === 0 ? (
                  <Card className="p-6 text-center">
                    <CardContent className="flex flex-col items-center gap-3">
                      <Calendar className="w-12 h-12 text-gray-400" />
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Chưa có lịch sử đặt chỗ</h3>
                        <p className="text-gray-600">Khi bạn hoàn thành hoặc hủy đặt chỗ, chúng sẽ xuất hiện ở đây.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {historyBookings.map((booking) => renderBookingCard(booking, false))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          {selectedBooking && (
            <BookingDetail
              booking={selectedBooking}
              onClose={() => setSelectedBooking(null)}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}