"use client";

import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Car, MapPin, Clock } from "lucide-react";
import { BookingInfo } from "./page";
import { motion } from "framer-motion";

export default function PaymentForm({
  bookingInfo,
  isProcessing,
  onPayment,
  onQrPayment,
  formatDateTime
}: {
  bookingInfo: BookingInfo;
  isProcessing: boolean;
  onPayment: () => void;
  onQrPayment: () => void;
  formatDateTime: (dateTime: string) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white"
    >
      <div className="flex justify-between mb-6">
        {['1', '2', '3'].map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              index === 0 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {step}
            </div>
            <span className="text-xs text-gray-500">
              {index === 0 ? 'Information' : index === 1 ? 'Payment' : 'Completion'}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-800">
            <MapPin className="w-4 h-4 text-gray-600" />
            Booking Information
          </h2>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium text-gray-800">{bookingInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">License Plate:</span>
              <span className="font-medium text-gray-800">{bookingInfo.vehicle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium text-gray-800">Zone {bookingInfo.zone} - Spot {bookingInfo.spot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium text-gray-800">
                {formatDateTime(bookingInfo.startTime)} - {formatDateTime(bookingInfo.endTime)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-800">
            <CreditCard className="w-4 h-4 text-gray-600" />
            Payment
          </h2>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Method:</span>
            <span className="font-medium text-gray-800">{bookingInfo.paymentMethod}</span>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
            <span className="font-semibold text-gray-700">Total:</span>
            <span className="text-lg font-bold text-black">{bookingInfo.estimatedFee}</span>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => bookingInfo.paymentMethod.includes("VietQR") ? onQrPayment() : onPayment()}
            disabled={isProcessing}
            className="w-full mt-4 h-12 text-base bg-black hover:bg-gray-800 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Payment"
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}