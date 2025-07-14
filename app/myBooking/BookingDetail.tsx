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
              <h2 className="text-xl font-bold">PARKING TICKET</h2>
              <p className="text-sm text-gray-500">#{booking.ticketId}</p>
            </div>
            <div className="bg-black text-white px-2 py-1 rounded text-xs">
              ACTIVE
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Location
              </p>
              <p className="font-medium">
                {booking.zone}-{booking.spotNumber}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Car className="w-4 h-4" /> Plate
              </p>
              <p className="font-medium">{booking.plateNumber}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Start
              </p>
              <p className="font-medium">
                {new Date(booking.startTime).toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="w-4 h-4" /> End
              </p>
              <p className="font-medium">
                {new Date(booking.endTime).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <CreditCard className="w-4 h-4" /> Payment
              </p>
              <p className="font-medium">{booking.paymentMethod}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
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
            Scan QR code at parking entrance
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
            <Ticket className="w-4 h-4 mr-2" /> Print Ticket
          </Button>
        </div>
      </div>
    </div>
  );
}