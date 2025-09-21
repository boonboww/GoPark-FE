/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AiOutlineScan } from "react-icons/ai";
import { Car } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  fetchMyParkingLots,
  deleteParkingLot,
  fetchParkingLotDetails,
  updateSlotStatus,
  fetchSlotBookings,
} from "@/lib/parkingLot.api";
import type {
  ParkingLot,
  Vehicle,
  Floor,
  ParkingSlot,
  Customer,
} from "@/app/owner/types";
import AddParkingLotDialog from "@/components/AddParkingLotDialog";
import EditParkingLotDialog from "@/components/EditParkingLotDialog";
import SelectParkingLotDropdown from "@/components/SelectParkingLotDropdown";
import { AxiosError } from "axios";

interface ParkingLotDetailsResponse {
  data: {
    data: {
      data: ParkingSlot[];
    };
  };
}

interface Booking {
  _id: string;
  userId: { name: string; email: string } | null;
  vehicleNumber: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface CombinedParkingManagementProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  customers: Customer[];
  parkingLots: ParkingLot[];
  setParkingLots: React.Dispatch<React.SetStateAction<ParkingLot[]>>;
}

export default function CombinedParkingManagement({
  vehicles,
  setVehicles,
  customers: _customers,
  parkingLots,
  setParkingLots,
}: CombinedParkingManagementProps) {
  const [selectedLotId, setSelectedLotId] = useState<string>("");
  const [newLotDialogOpen, setNewLotDialogOpen] = useState(false);
  const [editLotDialogOpen, setEditLotDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [parkingFloors, setParkingFloors] = useState<Floor[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slotBookings, setSlotBookings] = useState<Booking[]>([]);
  const [allSlotBookings, setAllSlotBookings] = useState<{[slotId: string]: Booking[]}>({});
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const router = useRouter();

  const selectedLot = parkingLots.find((lot) => lot._id === selectedLotId);
  const currentFloor =
    parkingFloors.find((floor) => floor.number === selectedFloor) ||
    parkingFloors[0];
  const parkedVehicles = parkingFloors
    .flatMap((floor) => floor.slots)
    .filter((slot) => slot.status === "booked" && slot.vehicle)
    .map((slot) => slot.vehicle!);

  useEffect(() => {
    if (parkedVehicles.length > 0) {
      setVehicles((prev) => {
        const updatedVehicles = [...prev];
        parkedVehicles.forEach((pv) => {
          const index = updatedVehicles.findIndex((v) => v.id === pv.id);
          if (index !== -1) {
            updatedVehicles[index] = { ...pv, status: "Parked" };
          } else {
            updatedVehicles.push({ ...pv, status: "Parked" });
          }
        });
        return updatedVehicles;
      });
    }
  }, [parkedVehicles, setVehicles]);

  const loadParkingLots = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchMyParkingLots();
      setParkingLots(res.data.data);
      if (res.data.data.length > 0 && !selectedLotId) {
        setSelectedLotId(res.data.data[0]._id);
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || err.message;
      if (err.response?.status === 403) {
        setError(
          `Không có quyền truy cập danh sách bãi đỗ: ${errorMessage}. Vui lòng kiểm tra vai trò tài khoản.`
        );
        "!".toUpperCase();
      } else if (err.response?.status === 401) {
        setError(
          `Token không hợp lệ: ${errorMessage}. Vui lòng kiểm tra đăng nhập.`
        );
      } else {
        setError(`Lỗi khi tải danh sách bãi đỗ: ${errorMessage}`);
      }
      toast.error(errorMessage);
      console.error("Error fetching parking lots:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadParkingLotDetails = async (lotId: string, date?: string) => {
    setIsLoading(true);
    try {
      const startTime = date
        ? new Date(date).toISOString()
        : new Date().toISOString();
      const endTime = date
        ? new Date(new Date(date).setHours(23, 59, 59, 999)).toISOString()
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const slotRes = (await fetchParkingLotDetails(
        lotId,
        startTime,
        endTime
      )) as unknown as ParkingLotDetailsResponse;
      const slots: ParkingSlot[] = slotRes.data?.data?.data ?? [];

      const selectedLot = parkingLots.find((lot) => lot._id === lotId);
      const zones = selectedLot?.zones ?? [];

      const zonesMap: { [key: string]: ParkingSlot[] } = {};
      if (Array.isArray(slots)) {
        slots.forEach((slot: ParkingSlot) => {
          const zoneName = slot.zone || "Default";
          if (!zonesMap[zoneName]) zonesMap[zoneName] = [];
          zonesMap[zoneName].push(slot);
        });
      }

      const floors: Floor[] = zones.map((zone, index) => ({
        number: index + 1,
        name: zone.zone,
        slots: zonesMap[zone.zone] || [],
      }));

      setParkingFloors(
        floors.length > 0
          ? floors
          : [
              {
                number: 1,
                name: "Default",
                slots: [],
              },
            ]
      );
      setSelectedFloor(floors[0]?.number || 1);
      
      // Load bookings for all slots
      await loadAllSlotBookings(slots, startTime, endTime);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Lỗi khi tải danh sách chỗ đỗ: ${errorMessage}`);
      console.error("Error fetching parking lot details:", error);
      setParkingFloors([
        {
          number: 1,
          name: "Default",
          slots: [],
        },
      ]);
      setSelectedFloor(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParkingLots();
  }, []);

  useEffect(() => {
    if (selectedLotId) {
      loadParkingLotDetails(selectedLotId, selectedDate);
    }
  }, [selectedLotId, selectedDate, parkingLots]);

  // Real-time timer để cập nhật màu sắc slots theo thời gian
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Cập nhật mỗi giây

    return () => clearInterval(timer);
  }, []);

  // Auto refresh booking data mỗi 30 giây để đảm bảo data mới nhất
  useEffect(() => {
    if (selectedLotId && parkingFloors.length > 0) {
      const refreshTimer = setInterval(() => {
        const startTime = selectedDate
          ? new Date(selectedDate).toISOString()
          : new Date().toISOString();
        const endTime = selectedDate
          ? new Date(new Date(selectedDate).setHours(23, 59, 59, 999)).toISOString()
          : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        
        const allSlots = parkingFloors.flatMap(floor => floor.slots);
        if (allSlots.length > 0) {
          loadAllSlotBookings(allSlots, startTime, endTime);
        }
      }, 30000); // Refresh mỗi 30 giây

      return () => clearInterval(refreshTimer);
    }
  }, [selectedLotId, selectedDate, parkingFloors]);

  const handleDeleteParkingLot = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteParkingLot(id);
      toast.success("Xóa bãi đỗ thành công");
      await loadParkingLots();
      setEditLotDialogOpen(false);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || err.message;
      if (err.response?.status === 403) {
        toast.error(`Không có quyền xóa bãi đỗ: ${errorMessage}`);
      } else {
        toast.error(`Lỗi khi xóa bãi đỗ: ${errorMessage}`);
      }
      console.error("Error deleting parking lot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string, slotId: string) => {
    // Kiểm tra xem slot có booking đang active trong thời gian hiện tại không
    const currentBookings = allSlotBookings[slotId] || [];
    
    const hasActiveBooking = currentBookings.some(booking => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      
      // Nếu có ngày được chọn, kiểm tra booking trong ngày đó
      if (selectedDate) {
        const selectedDay = new Date(selectedDate);
        const startOfDay = new Date(selectedDay.setHours(0, 0, 0, 0));
        const endOfDay = new Date(selectedDay.setHours(23, 59, 59, 999));
        
        // Kiểm tra xem có booking nào trong ngày được chọn không
        return (bookingStart <= endOfDay && bookingEnd >= startOfDay);
      } else {
        // Sử dụng currentTime để kiểm tra real-time - chỉ trong khoảng startTime đến endTime
        return (bookingStart <= currentTime && bookingEnd >= currentTime);
      }
    });

    // Nếu có booking đang active (trong khoảng thời gian), hiển thị màu vàng
    if (hasActiveBooking) {
      return "bg-yellow-400";
    }

    // Nếu không có booking active, hiển thị theo trạng thái thực tế của slot
    switch (status) {
      case "available":
        return "bg-green-400";
      case "booked":
      case "reserved":
        return "bg-red-400";
      default:
        return "bg-gray-500";
    }
  };

  const getSlotTooltip = (slot: ParkingSlot, slotId: string) => {
    const currentBookings = allSlotBookings[slotId] || [];
    
    if (currentBookings.length > 0) {
      // Tìm booking gần nhất hoặc đang diễn ra
      const now = currentTime;
      const activeBooking = currentBookings.find(booking => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        return (bookingStart <= now && bookingEnd >= now);
      });
      
      if (activeBooking) {
        // Booking đang diễn ra
        const timeLeft = Math.max(0, new Date(activeBooking.endTime).getTime() - now.getTime());
        const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        return `Slot ${slot.slotNumber} - Đang sử dụng (${activeBooking.vehicleNumber}) - Còn lại: ${hoursLeft}h ${minutesLeft}m`;
      } else {
        // Có booking nhưng chưa đến giờ hoặc đã hết
        const upcomingBooking = currentBookings.find(booking => new Date(booking.startTime) > now);
        const pastBooking = currentBookings.find(booking => new Date(booking.endTime) < now);
        
        if (upcomingBooking) {
          const timeUntilStart = new Date(upcomingBooking.startTime).getTime() - now.getTime();
          const hoursUntil = Math.floor(timeUntilStart / (1000 * 60 * 60));
          const minutesUntil = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60));
          return `Slot ${slot.slotNumber} - Đã đặt (${upcomingBooking.vehicleNumber}) - Bắt đầu sau: ${hoursUntil}h ${minutesUntil}m`;
        } else if (pastBooking) {
          return `Slot ${slot.slotNumber} - Đã có booking (${pastBooking.vehicleNumber}) - Đã kết thúc`;
        }
      }
      
      return `Slot ${slot.slotNumber} - Có booking (${currentBookings[0].vehicleNumber})`;
    }

    return `Slot ${slot.slotNumber} - ${slot.status}`;
  };

  const loadAllSlotBookings = async (slots: ParkingSlot[], startTime: string, endTime: string) => {
    const bookingsMap: {[slotId: string]: Booking[]} = {};
    
    // Load booking cho từng slot
    for (const slot of slots) {
      try {
        const response = await fetchSlotBookings(slot._id, startTime, endTime);
        bookingsMap[slot._id] = response.data.data || [];
      } catch (error) {
        console.error(`Error fetching bookings for slot ${slot.slotNumber}:`, error);
        bookingsMap[slot._id] = [];
      }
    }
    
    setAllSlotBookings(bookingsMap);
  };

  const fetchSlotBookingsLocal = async (
    slotId: string,
    startTime: string,
    endTime: string
  ) => {
    try {
      const response = await fetchSlotBookings(slotId, startTime, endTime);
      console.log("Fetched bookings:", response.data);
      setSlotBookings(response.data.data || []);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Lỗi khi tải danh sách booking: ${errorMessage}`);
      console.error("Error fetching slot bookings:", error);
      setSlotBookings([]);
    }
  };

  const handleSlotClick = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setSlotBookings([]);
    const startTime = selectedDate
      ? new Date(selectedDate).toISOString()
      : new Date().toISOString();
    const endTime = selectedDate
      ? new Date(new Date(selectedDate).setHours(23, 59, 59, 999)).toISOString()
      : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    if (slot.status === "booked" || slot.status === "reserved") {
      setSelectedVehicle(slot.vehicle || null);
      generateQRCode(slot.vehicle?.id || `RES-${slot.slotNumber}`);
      fetchSlotBookingsLocal(slot._id, startTime, endTime);
    } else {
      setSelectedVehicle(null);
      setQrCodeUrl(null);
      fetchSlotBookingsLocal(slot._id, startTime, endTime);
    }
    setShowModal(true);
  };

  const generateQRCode = (id: string) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}-${Date.now()}`;
    setQrCodeUrl(qrUrl);
  };

  const handleConfirm = async () => {
    if (selectedSlot && selectedVehicle && selectedLotId) {
      setIsLoading(true);
      try {
        await updateSlotStatus(selectedLotId, selectedSlot._id, {
          status: "booked",
          vehicle: {
            ...selectedVehicle,
            status: "Parked",
            plateImage: selectedVehicle.plateImage || `/bienso.png`,
          },
        });
        toast.success("Xác nhận đỗ xe thành công");
        await loadParkingLotDetails(selectedLotId, selectedDate);
        setShowModal(false);
        setVehicles((prev) => {
          const index = prev.findIndex((v) => v.id === selectedVehicle.id);
          if (index !== -1) {
            return [
              ...prev.slice(0, index),
              { ...selectedVehicle, status: "Parked" },
              ...prev.slice(index + 1),
            ];
          }
          return [...prev, { ...selectedVehicle, status: "Parked" }];
        });
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        const errorMessage = err.response?.data?.message || err.message;
        if (err.response?.status === 403) {
          toast.error(
            `Không có quyền cập nhật trạng thái chỗ đỗ: ${errorMessage}`
          );
        } else {
          toast.error(`Lỗi khi xác nhận đỗ xe: ${errorMessage}`);
        }
        console.error("Error updating slot status:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (error) {
    return (
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-red-600">
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 bg-red-50 rounded-md p-3 mb-4 text-sm">
            {error}
          </div>
          <Button
            onClick={loadParkingLots}
            variant="outline"
            className="text-sm"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <Card className="shadow-sm border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Parking Management
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage your parking lots and view real-time slot status
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{parkingLots.length}</div>
              <div className="text-sm text-gray-600">Parking Lots</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      )}

        {/* Control Panel */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Control Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 w-full">
              {/* Parking Lot Selector */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Select Parking Lot
                </label>
                <SelectParkingLotDropdown
                  parkingLots={parkingLots}
                  selectedLotId={selectedLotId}
                  onSelect={setSelectedLotId}
                />
              </div>

              {/* Date Picker */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDate("")}
                    className="shrink-0 cursor-pointer"
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 justify-end items-center flex-wrap mt-2 w-full">
                <Button
                  variant="default"
                  className="flex items-center gap-2 px-4 py-2 min-w-[170px] cursor-pointer w-full sm:w-auto"
                  onClick={() => router.push("/scan")}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <AiOutlineScan className="text-lg" />
                  Checkin/Checkout
                </Button>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <AddParkingLotDialog
                    open={newLotDialogOpen}
                    onOpenChange={setNewLotDialogOpen}
                    onCreated={loadParkingLots}
                  />
                  <EditParkingLotDialog
                    open={editLotDialogOpen}
                    onOpenChange={setEditLotDialogOpen}
                    selectedLot={selectedLot}
                    onUpdate={loadParkingLots}
                    onDelete={handleDeleteParkingLot}
                    setParkingLots={setParkingLots}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parking Slots */}
        {parkingFloors.length > 0 && currentFloor?.slots.length > 0 ? (
          <Card className="shadow-sm border">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Zone: {currentFloor.name}
                  </CardTitle>
                  <CardDescription>
                    {currentFloor.slots.length} slots available
                  </CardDescription>
                </div>
                <Select
                  value={selectedFloor.toString()}
                  onValueChange={(value) => setSelectedFloor(parseInt(value))}
                  disabled={parkingFloors.length === 0}
                >
                  <SelectTrigger className="w-[200px]" aria-label="Chọn khu vực">
                    <SelectValue placeholder="Select Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {parkingFloors.map((floor) => (
                      <SelectItem
                        key={floor.number}
                        value={floor.number.toString()}
                      >
                        {floor.name || `Zone ${floor.number}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {/* Slots Grid */}
              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 mb-6">
                {currentFloor.slots
                  .sort((a, b) => parseInt(a.slotNumber.replace(/^\D+/g, '')) - parseInt(b.slotNumber.replace(/^\D+/g, '')))
                  .map((slot) => {
                    const selected = selectedSlot?._id === slot._id ? "ring-2 ring-blue-500" : "";
                    const statusColor = getStatusColor(slot.status, slot._id);
                    
                    let bgColor = "";
                    if (statusColor.includes("green")) bgColor = "bg-green-100 cursor-pointer border-green-300 text-green-700";
                    else if (statusColor.includes("yellow")) bgColor = "bg-yellow-100 cursor-pointer border-yellow-300 text-yellow-700";
                    else if (statusColor.includes("red")) bgColor = "bg-red-100 cursor-pointer border-red-300 text-red-700";
                    else bgColor = "bg-gray-100 cursor-pointer border-gray-300 text-gray-700";

                    return (
                      <button
                        key={slot._id}
                        onClick={() => handleSlotClick(slot)}
                        className={`border rounded-lg h-16 flex flex-col items-center cursor-pointer justify-center transition-all duration-200 hover:shadow-md ${bgColor} ${selected}`}
                        title={getSlotTooltip(slot, slot._id)}
                      >
                        <div className="mb-1">
                          <Car className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="text-xs font-semibold">{slot.slotNumber}</div>
                      </button>
                    );
                  })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
                  <span className="text-sm text-gray-700">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
                  <span className="text-sm text-gray-700">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
                  <span className="text-sm text-gray-700">Occupied</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Car className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600 text-center">No parking slot data for this zone.</p>
            </CardContent>
          </Card>
        )}

        {/* Parked Vehicles */}
        {parkedVehicles.length > 0 && (
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Active Vehicles ({parkedVehicles.length})
              </CardTitle>
              <CardDescription>
                Currently parked vehicles in the lot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Owner</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">License</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Image</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {parkedVehicles.map((v, index) => (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                            {v.id}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{v.owner}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                            {v.licensePlate}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                            {v.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {v.plateImage && (
                            <img
                              src={v.plateImage}
                              alt="License Plate"
                              className="w-12 h-8 object-cover rounded border"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal */}
        {showModal && selectedSlot && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">
                    Slot {selectedSlot.slotNumber} Details
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedSlot.status === "available" ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">✅</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Slot Available</h3>
                    <p className="text-gray-600">This parking slot is currently available for booking.</p>
                  </div>
                ) : (
                  <>
                    {selectedVehicle && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Vehicle Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Ticket ID</p>
                            <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{selectedVehicle.id}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Owner</p>
                            <p className="font-semibold text-gray-900">{selectedVehicle.owner}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">License Plate</p>
                            <p className="font-semibold text-gray-900">{selectedVehicle.licensePlate}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Vehicle Type</p>
                            <p className="font-semibold text-gray-900">{selectedVehicle.type}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedVehicle.plateImage && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">License Plate Image</p>
                              <img
                                src={selectedVehicle.plateImage}
                                alt="License Plate"
                                className="w-full h-20 object-cover rounded border"
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">QR Code</p>
                            <div className="flex justify-center">
                              {qrCodeUrl ? (
                                <img
                                  src={qrCodeUrl}
                                  alt="QR Code"
                                  className="w-20 h-20 rounded border"
                                />
                              ) : (
                                <div className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center">
                                  <span className="text-xs text-gray-500">Loading...</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Booking History
                      </h3>
                      
                      {slotBookings.length > 0 ? (
                        <div className="space-y-3">
                          {slotBookings.map((booking) => (
                            <div
                              key={booking._id}
                              className="bg-white border border-gray-200 rounded p-3"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">License Plate</p>
                                  <p className="font-semibold text-gray-900">{booking.vehicleNumber}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Status</p>
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                    {booking.status}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Start Time</p>
                                  <p className="text-sm text-gray-900">{new Date(booking.startTime).toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">End Time</p>
                                  <p className="text-sm text-gray-900">{new Date(booking.endTime).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <span className="text-xl">📅</span>
                          </div>
                          <p className="text-gray-600">No bookings found for this time period.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
}