"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, MapPin, Car, Clock, CreditCard } from "lucide-react";

interface BookingData {
  parkingLotId: string;
  parkingLotName: string;
  address: string;
  vehicleNumber: string;
  startTime: string;
  duration: number;
  totalPrice: number;
  paymentMethod: "prepaid" | "pay-at-parking";
}

interface BookingConfirmationProps {
  bookingData: BookingData;
  onConfirm: (data: BookingData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDarkMode?: boolean;
}

export default function BookingConfirmation({
  bookingData,
  onConfirm,
  onCancel,
  isLoading = false,
  isDarkMode = false
}: BookingConfirmationProps) {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <CardHeader className={`pb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Xác nhận đặt chỗ
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Thông tin bãi xe */}
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-start gap-2 mb-2">
            <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
            <div>
              <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {bookingData.parkingLotName}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {bookingData.address}
              </p>
            </div>
          </div>
        </div>

        {/* Thông tin xe */}
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-500" />
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Biển số xe:
            </span>
            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {bookingData.vehicleNumber}
            </span>
          </div>
        </div>

        {/* Thông tin thời gian */}
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Thời gian bắt đầu:
              </span>
            </div>
            <p className={`text-sm ml-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {formatDateTime(bookingData.startTime)}
            </p>
            <div className="flex items-center gap-2 ml-6">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Thời lượng: {bookingData.duration} giờ
              </span>
            </div>
          </div>
        </div>

        {/* Thông tin thanh toán */}
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-500" />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Thanh toán:
              </span>
            </div>
            <div className="ml-6 space-y-1">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Phương thức: {bookingData.paymentMethod === 'prepaid' ? 'Thanh toán online' : 'Trả tại bãi'}
              </p>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                Tổng tiền: {formatPrice(bookingData.totalPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={() => onConfirm(bookingData)}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận đặt chỗ'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}