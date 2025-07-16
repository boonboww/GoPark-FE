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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ticket Section */}
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">VÉ ĐỖ XE</h2>
              <p className="text-sm text-gray-500">#{booking.ticketId}</p>
            </div>
            <div className="bg-black text-white px-2 py-1 rounded text-xs">
              ĐANG HOẠT ĐỘNG
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
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

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <CreditCard className="w-4 h-4" /> Thanh toán
              </p>
              <p className="font-medium">{booking.paymentMethod === "prepaid" ? "Thanh toán trước" : "Thanh toán tại bãi"}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tổng cộng</p>
              <p className="font-bold text-lg">{booking.fee}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <QRCode 
              value={qrValue} 
              size={128} 
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">
            Quét mã QR tại cổng bãi đỗ
          </p>
        </div>

        {/* Parking Info Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">{booking.parkingName}</h3>
          <p className="text-sm text-gray-600">{booking.location}</p>
          
          <Button 
            className="w-full mt-4 bg-black hover:bg-gray-800 text-white"
            onClick={() => window.print()}
          >
            <Ticket className="w-4 h-4 mr-2" /> In vé
          </Button>
        </div>
      </div>
    </div>
  );
}