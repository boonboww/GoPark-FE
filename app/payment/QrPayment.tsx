"use client";

import { Button } from "@/components/ui/button";
import { QrCode, CheckCircle, ArrowLeft, Scan, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { BookingInfo } from "./page";

export default function QrPayment({
  onBack,
  onComplete,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bookingInfo
}: {
  onBack: () => void;
  onComplete: () => void;
  bookingInfo: BookingInfo;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onComplete();
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white"
    >
      <div className="flex justify-between mb-6">
        {['1', '2', '3'].map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              index <= 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {step}
            </div>
            <span className="text-xs text-gray-500">
              {index === 0 ? 'Thông Tin' : index === 1 ? 'Thanh Toán' : 'Hoàn Thành'}
            </span>
          </div>
        ))}
      </div>

      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2 text-gray-800">
          <QrCode className="w-5 h-5 text-gray-600" />
          Thanh Toán QR
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Quét mã QR để hoàn tất thanh toán
        </p>

        <motion.div
          animate={isProcessing ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5 }}
          className="relative inline-block mb-8"
        >
          <div className="p-4 bg-white rounded-xl border-2 border-dashed border-gray-200 shadow-inner">
            <div className="w-64 h-64 bg-white p-2 flex items-center justify-center">
              <div className="relative">
                <div className="grid grid-cols-10 gap-1 w-48 h-48">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div 
                      key={i}
                      className={`w-4 h-4 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-2 rounded-full border border-gray-200">
                    <Scan className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="flex-1 h-12 border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay Lại
          </Button>
          <Button 
            onClick={handlePaymentComplete} 
            className="flex-1 h-12 bg-black hover:bg-gray-800 text-white"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang Xử Lý...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Xác Nhận Thanh Toán
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}