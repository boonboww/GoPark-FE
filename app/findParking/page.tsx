"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Grid, List, MapPin, Clock, Car, Camera, Shield, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";

interface ParkingLot {
  _id: string;
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  description: string;
  zones: Array<{
    zone: string;
    count: number;
  }>;
  isActive: boolean;
  pricePerHour: number;
  avtImage: string;
  image: string[];
  allowedPaymentMethods: string[];
  createdAt: string;
  updatedAt: string;
}

interface Filters {
  name: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  paymentMethod: string;
  sortBy: string;
  nearMe: boolean;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

export default function FindParkingPage() {
  const router = useRouter();
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [filteredLots, setFilteredLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    name: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    paymentMethod: "",
    sortBy: "newest",
    nearMe: false
  });

  // Fetch parking lots from API
  useEffect(() => {
    const fetchParkingLots = async () => {
      try {
        setLoading(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const response = await fetch(`${apiUrl}/api/v1/parkinglots/public/all`);
        
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu bãi đỗ");
        }
        
        const result = await response.json();
        if (result.status === "success") {
          setParkingLots(result.data);
          setFilteredLots(result.data);
        } else {
          throw new Error("Lỗi khi tải dữ liệu");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchParkingLots();
  }, []);

  // Filter parking lots based on filters
  useEffect(() => {
    let filtered = [...parkingLots];

    // Filter by name
    if (filters.name) {
      filtered = filtered.filter(lot =>
        lot.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // Filter by city (from address)
    if (filters.city) {
      filtered = filtered.filter(lot =>
        lot.address.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Filter by payment method
    if (filters.paymentMethod) {
      filtered = filtered.filter(lot =>
        lot.allowedPaymentMethods.includes(filters.paymentMethod)
      );
    }

    // Filter by active status
    filtered = filtered.filter(lot => lot.isActive);

    // Sort results
    switch (filters.sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "slots-desc":
        filtered.sort((a, b) => getTotalSlots(b.zones) - getTotalSlots(a.zones));
        break;
      case "slots-asc":
        filtered.sort((a, b) => getTotalSlots(a.zones) - getTotalSlots(b.zones));
        break;
      case "distance":
        if (userLocation) {
          filtered.sort((a, b) => {
            const distanceA = calculateDistance(
              userLocation.latitude, 
              userLocation.longitude, 
              a.location.coordinates[1], 
              a.location.coordinates[0]
            );
            const distanceB = calculateDistance(
              userLocation.latitude, 
              userLocation.longitude, 
              b.location.coordinates[1], 
              b.location.coordinates[0]
            );
            return distanceA - distanceB;
          });
        }
        break;
    }

    setFilteredLots(filtered);
  }, [filters, parkingLots, userLocation]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      city: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      paymentMethod: "",
      sortBy: "newest",
      nearMe: false
    });
    setUserLocation(null);
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setFilters(prev => ({ ...prev, nearMe: true, sortBy: "distance" }));
          setLocationLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationLoading(false);
          alert("Không thể lấy vị trí hiện tại. Vui lòng cho phép truy cập vị trí.");
        }
      );
    } else {
      setLocationLoading(false);
      alert("Trình duyệt không hỗ trợ định vị.");
    }
  };

  const getTotalSlots = (zones: Array<{zone: string; count: number}>) => {
    return zones.reduce((total, zone) => total + zone.count, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu bãi đỗ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">Lỗi</p>
          <p>{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Header/>
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tìm kiếm bãi đỗ xe
          </h1>
          <p className="text-gray-600">
            Tìm thấy {filteredLots.length} bãi đỗ phù hợp
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col space-y-4">
            {/* First Row - Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên bãi đỗ..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex border rounded-md sm:w-auto w-full overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none flex-1 sm:flex-none cursor-pointer h-11 sm:h-auto sm:px-4 font-medium"
                >
                  <Grid size={16} className="mr-2 " />
                  <span>Lưới</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none flex-1 sm:flex-none cursor-pointer h-11 sm:h-auto sm:px-4 font-medium"
                >
                  <List size={16} className="mr-2" />
                  <span>Danh sách</span>
                </Button>
              </div>
            </div>

            {/* Second Row - Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* City Filter */}
              <div>
                <Input
                  type="text"
                  placeholder="Tìm theo thành phố..."
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="h-11 w-full"
                />
              </div>

              {/* Payment Method Filter */}
              <div>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
                  className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Phương thức thanh toán</option>
                  <option value="prepaid">Trả trước</option>
                  <option value="pay-at-parking">Trả tại bãi</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="name-asc">Tên A-Z</option>
                  <option value="name-desc">Tên Z-A</option>
                  <option value="slots-desc">Nhiều chỗ nhất</option>
                  <option value="slots-asc">Ít chỗ nhất</option>
                  {userLocation && <option value="distance">Gần nhất</option>}
                </select>
              </div>

              {/* Near Me Button */}
              <div>
                <Button
                  variant={filters.nearMe ? "default" : "outline"}
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="w-full h-11 font-medium cursor-pointer"
                >
                  {locationLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 cursor-pointer border-white mr-2"></div>
                      Đang tìm...
                    </>
                  ) : (
                    <>
                      <Navigation size={16} className="mr-2 " />
                      Gần tôi
                    </>
                  )}
                </Button>
              </div>

              {/* Clear Filters */}
              <div>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full h-11 font-medium cursor-pointer"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredLots.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Car className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Không tìm thấy bãi đỗ nào
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để có kết quả phù hợp hơn
            </p>
            <Button 
              onClick={clearFilters} 
              variant="outline"
              className="px-6 py-2 font-medium"
            >
              Xóa tất cả bộ lọc
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              : "space-y-4"
          }>
            {filteredLots.map((lot) => (
              <div
                key={lot._id}
                className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300 group ${
                  viewMode === "list" ? "flex flex-col sm:flex-row" : "flex flex-col h-full"
                }`}
                onClick={() => router.push(`/detailParking/${lot._id}`)}
              >
                {/* Image */}
                <div className={`relative ${
                  viewMode === "list" ? "sm:w-64 h-48 sm:h-auto flex-shrink-0" : "h-48 w-full"
                }`}>
                  {lot.avtImage ? (
                    <img
                      src={lot.avtImage}
                      alt={lot.name}
                      className={`object-cover w-full h-full ${
                        viewMode === "list" 
                          ? "rounded-t-lg sm:rounded-l-lg sm:rounded-t-none" 
                          : "rounded-t-lg"
                      } group-hover:scale-105 transition-transform duration-200`}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 ${
                      viewMode === "list" 
                        ? "rounded-t-lg sm:rounded-l-lg sm:rounded-t-none" 
                        : "rounded-t-lg"
                    } flex items-center justify-center`}>
                      <Car className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                      Hoạt động
                    </span>
                  </div>

                  {/* Total Slots Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {getTotalSlots(lot.zones)} chỗ đỗ
                    </span>
                  </div>

                  {/* Distance Badge */}
                  {userLocation && filters.nearMe && (
                    <div className="absolute bottom-3 right-3">
                      <span className="bg-blue-600/90 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {calculateDistance(
                          userLocation.latitude,
                          userLocation.longitude,
                          lot.location.coordinates[1],
                          lot.location.coordinates[0]
                        ).toFixed(1)} km
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`p-4 sm:p-5 flex flex-col ${viewMode === "list" ? "flex-1" : "flex-1"}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                      {lot.name}
                    </h3>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-lg font-bold text-blue-600">
                        {lot.pricePerHour?.toLocaleString('vi-VN') || '15,000'}đ
                      </p>
                      <p className="text-xs text-gray-500">mỗi giờ</p>
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div className="flex items-start gap-2 text-gray-600 mb-3 flex-grow">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <span className="text-sm line-clamp-2 leading-relaxed">{lot.address}</span>
                  </div>

                  {/* Zones - Fixed height */}
                  <div className="mb-3 min-h-[2rem]">
                    <div className="flex flex-wrap gap-1">
                      {lot.zones.slice(0, 2).map((zone, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium border border-blue-200"
                        >
                          Khu {zone.zone}: {zone.count}
                        </span>
                      ))}
                      {lot.zones.length > 2 && (
                        <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-md font-medium border border-gray-200">
                          +{lot.zones.length - 2} khu
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Payment Methods - Fixed height */}
                  <div className="mb-4 min-h-[2rem]">
                    <div className="flex flex-wrap gap-1">
                      {lot.allowedPaymentMethods.slice(0, 2).map((method, index) => (
                        <span
                          key={index}
                          className="bg-gray-50 text-gray-700 text-xs px-2 py-1 rounded-md font-medium border border-gray-200"
                        >
                          {method === "prepaid" ? "💳 Trả trước" : "💰 Trả tại bãi"}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features - Fixed height */}
                  <div className="mb-4 min-h-[1.5rem]">
                    <div className="flex items-center gap-3 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <Shield size={14} className="text-green-500" />
                        <span>Bảo mật</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Camera size={14} className="text-blue-500" />
                        <span>Camera</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-orange-500" />
                        <span>24/7</span>
                      </div>
                    </div>
                  </div>

                  {/* Description for list view */}
                  {viewMode === "list" && (
                    <div className="mb-4 flex-grow">
                      {lot.description ? (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {lot.description}
                        </p>
                      ) : (
                        <p className="text-gray-400 text-sm italic">Chưa có mô tả</p>
                      )}
                    </div>
                  )}

                  {/* Action Section - Always at bottom */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500 truncate pr-2">
                        {new Date(lot.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 min-w-[100px] flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/detailParking/${lot._id}`);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
