"use client";
import { ArrowLeft } from "lucide-react";
import { Parking } from "./types";

interface ParkingDetailProps {
  parking: Parking;
  arriving: Date | null;
  leaving: Date | null;
  onBack: () => void;
  onNavigate: () => void;
}

export const ParkingDetail = ({ parking, arriving, leaving, onBack, onNavigate }: ParkingDetailProps) => (
  <div>
    <button onClick={onBack} className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition-colors">
      <ArrowLeft className="w-5 h-5 mr-2"/> Quay lại danh sách
    </button>

    <div className="border border-gray-200 p-6 rounded-xl shadow-lg bg-white">
      <img src={parking.avtImage || "/default-parking.jpg"} alt={parking.name}
        className="w-full h-64 object-cover rounded-lg mb-4"/>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{parking.name}</h3>
      
      <div className="space-y-2 text-gray-600">
        <p className="text-sm"><span className="font-medium">Địa chỉ:</span> {parking.address}</p>
        <p className="text-sm"><span className="font-medium">Giá:</span> {parking.pricePerHour.toLocaleString()} VNĐ/giờ</p>
        <p className="text-sm">
          <span className="font-medium">Trạng thái:</span>{" "}
          <span className={parking.isActive ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
            {parking.isActive ? "Còn trống" : "Hết chỗ"}
          </span>
        </p>
        
        {parking.description && (
          <p className="text-sm"><span className="font-medium">Mô tả:</span> {parking.description}</p>
        )}
        
        {parking.zones?.length > 0 && (
          <div className="text-sm">
            <span className="font-medium">Khu vực:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {parking.zones.map((zone) => (
                <span key={zone._id} className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {zone.zone}: {zone.count} chỗ
                </span>
              ))}
            </div>
          </div>
        )}
        
        {arriving && (
          <p className="text-sm">
            <span className="font-medium">Thời gian đến:</span>{" "}
            {arriving.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
          </p>
        )}
        
        {leaving && (
          <p className="text-sm">
            <span className="font-medium">Thời gian rời:</span>{" "}
            {leaving.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
          </p>
        )}
      </div>

      <button onClick={onNavigate}
        className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all">
        Chỉ đường
      </button>
    </div>
  </div>
);