"use client";

import { useState, useEffect } from "react";
import RoleGuard from "@/components/features/auth/RoleGuard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CombinedParkingManagement from "@/app/owner/VehicleManagement";
import type { Customer, Vehicle, Ticket, ParkingLot, ParkingSlot } from "@/app/owner/types";
import API from "@/lib/api";
import { fetchMyParkingLots, fetchParkingLotDetails } from "@/lib/parkingLot.api";
import {
  Building2,
  Car,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";

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
      _id: "T001",
      vehicleNumber: "51H-12345",
      userId: {
        _id: "u001",
        userName: "Nguyen Van A",
        email: "nva@example.com",
        phoneNumber: "0901234567",
      },
      ticketType: "date",
      price: 50000,
      floor: "1",
      expiryDate: "2025-07-02",
      status: "active",
    },
    {
      _id: "T002",
      vehicleNumber: "51G-54321",
      userId: {
        _id: "u002",
        userName: "Tran Thi B",
        email: "ttb@example.com",
        phoneNumber: "0909876543",
      },
      ticketType: "month",
      price: 1000000,
      floor: "2",
      expiryDate: "2025-07-30",
      status: "active",
    },
  ] satisfies Ticket[],
};

export default function OwnerDashboard() {
  const [customerList] = useState<Customer[]>(initialData.customers);
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(
    initialData.vehicles
  );
  const [ticketList] = useState<Ticket[]>(initialData.tickets);
  const [accountName, setAccountName] = useState<string>("");
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [stats, setStats] = useState({
    totalLots: 0,
    totalSlots: 0,
    occupiedSlots: 0,
    revenue: 0,
    todayBookings: 0,
    activeCustomers: 0,
  });

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

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // 1. Fetch Parking Lots
        const lotsRes = await fetchMyParkingLots();
        const lots = lotsRes.data.data;
        setParkingLots(lots);

        // 2. Fetch Details for each lot to calculate stats
        let totalSlots = 0;
        let occupiedSlots = 0;
        let revenue = 0;
        let todayBookings = 0;

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
        
        // Fetch data for a wider range to catch active bookings (e.g., last 30 days to future)
        // Note: This is an approximation. Ideally backend should provide stats.
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();

        await Promise.all(lots.map(async (lot) => {
          try {
            const detailsRes = await fetchParkingLotDetails(lot._id, startOfMonth, endOfNextMonth);
            const slots = detailsRes.data.data.data as any[]; // Type assertion if needed
            
            if (slots) {
              totalSlots += slots.length;
              
              slots.forEach(slot => {
                // Count occupied slots
                if (slot.status === 'booked' || slot.status === 'reserved') {
                  occupiedSlots++;
                }

                // Calculate revenue and today's bookings from attached bookings
                if (slot.bookings && Array.isArray(slot.bookings)) {
                  slot.bookings.forEach((booking: any) => {
                    // Revenue (sum of totalPrice of all visible bookings)
                    if (booking.totalPrice) {
                      revenue += booking.totalPrice;
                    }

                    // Today's bookings
                    const bookingStart = new Date(booking.startTime);
                    const todayStart = new Date(startOfDay);
                    const todayEnd = new Date(endOfDay);
                    
                    if (bookingStart >= todayStart && bookingStart <= todayEnd) {
                      todayBookings++;
                    }
                  });
                }
              });
            }
          } catch (err) {
            console.error(`Failed to fetch details for lot ${lot._id}`, err);
          }
        }));

        setStats({
          totalLots: lots.length,
          totalSlots,
          occupiedSlots,
          revenue,
          todayBookings,
          activeCustomers: customerList.length, // Keep mock for now or fetch if available
        });

      } catch (err) {
        console.error("❌ Failed to load dashboard data", err);
      }
    };

    loadDashboardData();
  }, [customerList.length]); // Re-run if customer list changes (though it's static for now)

  return (
    <RoleGuard allowedRole="owner">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Chào mừng trở lại,{" "}
            <span className="font-semibold">{accountName}</span>! Đây là tổng
            quan về hoạt động bãi đỗ của bạn.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Tổng số bãi đỗ
              </CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.totalLots}</div>
              <p className="text-xs text-blue-600">Đang hoạt động</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">
                Tỷ lệ lấp đầy
              </CardTitle>
              <Car className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {stats.totalSlots > 0 ? Math.round((stats.occupiedSlots / stats.totalSlots) * 100) : 0}%
              </div>
              <p className="text-xs text-orange-600">
                {stats.occupiedSlots}/{stats.totalSlots} chỗ đậu
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Doanh thu tháng
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {(stats.revenue / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-green-600">
                +20.1% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Đặt chỗ hôm nay
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.todayBookings}</div>
              <p className="text-xs text-purple-600">
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
                    <p className="text-sm font-medium">
                      Khách hàng mới đăng ký
                    </p>
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
                  <span className="text-sm text-gray-600">
                    Khách hàng hoạt động
                  </span>
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
