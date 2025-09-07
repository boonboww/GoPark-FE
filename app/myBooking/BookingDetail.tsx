"use client";

import { X, Ticket, MapPin, Clock, Car, CreditCard } from "lucide-react";
import QRCode from "react-qr-code";
import { Booking } from "./types";
import { Button } from "@/components/ui/button";

export default function BookingDetail({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const qrValue = `${booking.ticketId}|${booking.plateNumber}|${booking.zone}-${booking.spotNumber}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2">
      <div className="bg-white rounded-lg max-w-md w-full p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

  <div className="border-2 border-dashed border-gray-300 p-3 rounded-lg mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-xl mt-1 font-bold">VÉ ĐỖ XE</h2>
              <p className="text-sm text-gray-500">#{booking.ticketId}</p>
            </div>
            <div className="bg-black text-white px-2 mt-2 py-1 rounded text-xs">
              {booking.status === "active"
                ? "ĐANG HOẠT ĐỘNG"
                : booking.status === "completed"
                ? "HOÀN THÀNH"
                : booking.status === "pending"
                ? "CHỜ XÁC NHẬN"
                : booking.status === "cancelled"
                ? "ĐÃ HỦY"
                : booking.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Vị trí
              </p>
              <p className="font-medium">
                {booking.zone}-{booking.spotNumber}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Car className="w-4 h-4" /> Biển số
              </p>
              <p className="font-medium">{booking.plateNumber}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Bắt đầu
              </p>
              <p className="font-medium">
                {new Date(booking.startTime).toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Kết thúc
              </p>
              <p className="font-medium">
                {new Date(booking.endTime).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <CreditCard className="w-4 h-4" /> Thanh toán
              </p>
              <p className="font-medium">
                {booking.paymentMethod === "prepaid" ? "Thanh toán trước" : "Thanh toán tại bãi"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tổng cộng</p>
              <p className="font-bold text-lg">{booking.fee}</p>
            </div>
          </div>

          {booking.status === "active" && (
            <div className="mt-4 flex justify-center">
              <QRCode 
                value={qrValue} 
                size={128} 
                bgColor="#ffffff"
                fgColor="#000000"
              />
              <p className="text-xs text-center text-gray-500 mt-2">
                Quét mã QR tại cổng bãi đỗ
              </p>
            </div>
          )}
        </div>

  <div className="space-y-3">
          <h3 className="font-semibold text-lg">{booking.parkingName}</h3>
          <p className="text-sm text-gray-600">{booking.location}</p>
          
          <Button 
            className="w-full mt-2 bg-black hover:bg-gray-800 cursor-pointer text-white"
            onClick={() => window.print()}
          >
            <Ticket className="w-4 h-4 mr-2 cursor-pointer" /> In vé
          </Button>
        </div>
      </div>
    </div>
  );
}