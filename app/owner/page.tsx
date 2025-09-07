"use client";

import { useState, useEffect } from "react";
import RoleGuard from '@/components/RoleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CombinedParkingManagement from "@/components/VehicleManagement";
import type { Customer, Vehicle, Ticket, ParkingLot } from "@/app/owner/types";
import API from "@/lib/api";
import { 
  Building2, 
  Car, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react';

const initialData = {
  customers: [
    {
      id: "u001",
      userName: "Nguyen Van A",
      email: "nva@example.com",
      phoneNumber: "0901234567",
    },
    {
      id: "u002",
      userName: "Tran Thi B",
      email: "ttb@example.com",
      phoneNumber: "0909876543",
    },
  ] satisfies Customer[],

  vehicles: [
    {
      id: "V1",
      licensePlate: "51H-12345",
      type: "Car",
      owner: "Nguyen Van A",
      status: "Parked",
    },
    {
      id: "V2",
      licensePlate: "51H-67890",
      type: "Car",
      owner: "Nguyen Van A",
      status: "Not Parked",
    },
    {
      id: "V3",
      licensePlate: "51G-54321",
      type: "Motorbike",
      owner: "Tran Thi B",
      status: "Parked",
    },
  ] satisfies Vehicle[],

  tickets: [
    {
      id: "T001",
      licensePlate: "51H-12345",
      customer: "Nguyen Van A",
      type: "Daily",
      price: 50000,
      floor: "1",
      expiry: "2025-07-02",
    },
    {
      id: "T002",
      licensePlate: "51G-54321",
      customer: "Tran Thi B",
      type: "Monthly",
      price: 1000000,
      floor: "2",
      expiry: "2025-07-30",
    },
  ] satisfies Ticket[],
};

export default function OwnerDashboard() {
  const [customerList] = useState<Customer[]>(initialData.customers);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(initialData.vehicles);
  const [ticketList] = useState<Ticket[]>(initialData.tickets);
  const [accountName, setAccountName] = useState<string>("");
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);

  useEffect(() => {
    const fetchAccountName = async () => {
      try {
        const res = await API.get("/api/v1/users/me");
        setAccountName(res.data.userName || "Owner");
      } catch (err) {
        console.error("❌ Failed to fetch account info", err);
      }
    };
    fetchAccountName();
  }, []);



  // Mock statistics
  const stats = {
    totalLots: parkingLots.length || 3,
    totalSlots: 150,
    occupiedSlots: 87,
    revenue: 12500000,
    todayBookings: 24,
    activeCustomers: customerList.length,
  };

  return (
    <RoleGuard allowedRole="owner">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Chào mừng trở lại, <span className="font-semibold">{accountName}</span>! Đây là tổng quan về hoạt động bãi đỗ của bạn.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số bãi đỗ</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLots}</div>
              <p className="text-xs text-muted-foreground">
                Đang hoạt động
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tỷ lệ lấp đầy</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((stats.occupiedSlots / stats.totalSlots) * 100)}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.occupiedSlots}/{stats.totalSlots} chỗ đậu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu tháng</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats.revenue / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">
                +20.1% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đặt chỗ hôm nay</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayBookings}</div>
              <p className="text-xs text-muted-foreground">
                +12% so với hôm qua
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Quản lý bãi đỗ real-time
              </CardTitle>
              <CardDescription>
                Theo dõi và quản lý chỗ đậu xe trong thời gian thực
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CombinedParkingManagement
                vehicles={vehicleList}
                setVehicles={setVehicleList}
                customers={customerList}
                parkingLots={parkingLots}
                setParkingLots={setParkingLots}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Hoạt động gần đây
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Xe 51H-12345 vào bãi</p>
                    <p className="text-xs text-gray-500">5 phút trước</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Khách hàng mới đăng ký</p>
                    <p className="text-xs text-gray-500">15 phút trước</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Thanh toán thành công</p>
                    <p className="text-xs text-gray-500">30 phút trước</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Thống kê nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Khách hàng hoạt động</span>
                  <Badge variant="secondary">{stats.activeCustomers}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Xe đang đậu</span>
                  <Badge variant="secondary">{stats.occupiedSlots}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vé còn hiệu lực</span>
                  <Badge variant="secondary">{ticketList.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
