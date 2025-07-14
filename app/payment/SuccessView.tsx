"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Ticket, Home, QrCode, MapPin, Car, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SuccessView() {
  const router = useRouter();
  const ticketData = JSON.parse(localStorage.getItem('parkingTicket') || '{}');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white max-w-md mx-auto"
    >
      {/* Phần trên giữ nguyên */}
      <div className="flex justify-between mb-6">
        {['1', '2', '3'].map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              index <= 2 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {step}
            </div>
            <span className="text-xs text-gray-500">
              {index === 0 ? 'Information' : index === 1 ? 'Payment' : 'Completion'}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center mb-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-xl font-semibold mb-2 text-gray-800">Payment Successful!</h1>
        <p className="text-sm text-gray-500">
          Your parking ticket has been activated
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-sm font-medium mb-4 flex items-center justify-center gap-2 text-gray-800">
          <QrCode className="w-5 h-5 text-gray-600" />
          E-Ticket QR Code
        </h2>
        
        <div className="relative p-4 bg-white rounded-lg border-2 border-dashed border-gray-200 mb-4">
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-10 gap-1 w-48 h-48">
              {Array.from({ length: 100 }).map((_, i) => (
                <div 
                  key={i}
                  className={`w-4 h-4 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                />
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-3">
            Scan this code at the parking gate
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              Location:
            </span>
            <span className="font-medium text-gray-800">Zone {ticketData.zone} - Spot {ticketData.spot}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center gap-2">
              <Car className="w-4 h-4 text-gray-500" />
              License Plate:
            </span>
            <span className="font-medium text-gray-800">{ticketData.vehicle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              Time:
            </span>
            <span className="font-medium text-gray-800">
              {new Date(ticketData.startTime).toLocaleString('en-US')}
            </span>
          </div>
        </div>
      </div>

      {/* Phần button đã điều chỉnh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <Button 
          onClick={() => router.push('/ticket')} 
          className="w-full h-12 gap-2 bg-black hover:bg-gray-800 text-white"
        >
          <Ticket className="w-5 h-5" />
          <span className="sm:inline">View Ticket</span>
        </Button>
        <Button 
          onClick={() => router.push('/')} 
          variant="outline"
          className="w-full h-12 gap-2 border-gray-300 hover:bg-gray-50"
        >
          <Home className="w-5 h-5" />
          <span className="sm:inline">Home</span>
        </Button>
      </div>
    </motion.div>
  );
}