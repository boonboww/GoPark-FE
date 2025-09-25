"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";

// Component cho xác nhận đặt chỗ
export const BookingConfirmation = ({ data, onConfirm, onCancel, isDarkMode }) => {
  return (
    <div className={`p-3 rounded-lg mb-2 ${isDarkMode ? "bg-gray-800" : "bg-blue-50"} border ${isDarkMode ? "border-gray-700" : "border-blue-200"}`}>
      <div className="font-semibold text-sm mb-2">Xác nhận đặt chỗ</div>
      <div className="text-xs space-y-1 mb-3">
        <div>Bãi xe: {data.parkingName}</div>
        <div>Địa chỉ: {data.address}</div>
        <div>Thời gian: {data.startTime} - {data.endTime}</div>
        <div>Phương tiện: {data.vehicle}</div>
        <div className="font-semibold">Tổng tiền: {data.totalPrice} VNĐ</div>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onConfirm}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1"
        >
          Xác nhận
        </Button>
        <Button 
          onClick={onCancel}
          variant="outline"
          className="flex-1 text-xs py-1"
        >
          Hủy
        </Button>
      </div>
    </div>
  );
};

// Component cho form đặt chỗ
export const BookingForm = ({ onSubmit, onCancel, parkingLots, userVehicles, isDarkMode }) => {
  const [selectedParking, setSelectedParking] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1);

  return (
    <div className={`p-3 rounded-lg mb-2 ${isDarkMode ? "bg-gray-800" : "bg-blue-50"} border ${isDarkMode ? "border-gray-700" : "border-blue-200"}`}>
      <div className="font-semibold text-sm mb-2">Đặt chỗ bãi xe</div>
      
      <div className="space-y-2 text-xs">
        <div>
          <label className="block mb-1">Chọn bãi xe:</label>
          <select 
            value={selectedParking} 
            onChange={(e) => setSelectedParking(e.target.value)}
            className={`w-full p-2 rounded ${isDarkMode ? "bg-gray-700 text-white" : "bg-white"}`}
          >
            <option value="">-- Chọn bãi xe --</option>
            {parkingLots.map(lot => (
              <option key={lot.id} value={lot.id}>
                {lot.name} - {lot.address} ({lot.pricePerHour}đ/giờ)
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block mb-1">Chọn phương tiện:</label>
          <select 
            value={selectedVehicle} 
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className={`w-full p-2 rounded ${isDarkMode ? "bg-gray-700 text-white" : "bg-white"}`}
          >
            <option value="">-- Chọn xe --</option>
            {userVehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.licensePlate}>
                {vehicle.licensePlate} ({vehicle.capacity} chỗ)
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block mb-1">Thời gian bắt đầu:</label>
            <input 
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={`w-full p-2 rounded ${isDarkMode ? "bg-gray-700 text-white" : "bg-white"}`}
            />
          </div>
          <div>
            <label className="block mb-1">Thời gian (giờ):</label>
            <input 
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className={`w-full p-2 rounded ${isDarkMode ? "bg-gray-700 text-white" : "bg-white"}`}
            />
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-3">
        <Button 
          onClick={() => onSubmit({
            parkingLotId: selectedParking,
            vehicleNumber: selectedVehicle,
            startTime,
            duration
          })}
          disabled={!selectedParking || !selectedVehicle || !startTime}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1"
        >
          Đặt chỗ
        </Button>
        <Button 
          onClick={onCancel}
          variant="outline"
          className="flex-1 text-xs py-1"
        >
          Hủy
        </Button>
      </div>
    </div>
  );
};