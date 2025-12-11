"use client";

import { useEffect, useState } from "react";
import { Ticket, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import TicketForm from "@/components/features/booking/TicketForm";
import API from "@/lib/api";
import { getTicketsByParkingLotId } from "@/lib/ticket.api";
import SelectParkingLotDropdown from "@/app/owner/tickets/SelectParkingLotDropdown";
import DetailBooking from "@/app/owner/tickets/DetailBooking";
import { fetchMyParkingLots } from "@/lib/parkingLot.api";
import toast from "react-hot-toast";
import { getBookingById } from "@/lib/booking.api";
import type {
  Ticket as TicketType,
  Customer,
  Vehicle,
} from "@/app/owner/types";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  // const [customers, setCustomers] = useState<Customer[]>([]); // Might need for "Add Ticket" modal, but let's focus on list first
  const [vehicles, setVehicles] = useState<Vehicle[]>([]); // Might need for "Add Ticket" modal

  // Filter states
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState(""); // Changed from expiry to date for overlap check

  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [selectedBookingPartial, setSelectedBookingPartial] =
    useState<boolean>(false);

  const [parkingLots, setParkingLots] = useState<any[]>([]);
  const [parkingLotsLoading, setParkingLotsLoading] = useState(false);
  // const [parkingLotsError, setParkingLotsError] = useState<string | null>(null);
  const [selectedLotId, setSelectedLotId] = useState<string>("");

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Parking Lots
  const loadLots = async () => {
    setParkingLotsLoading(true);
    try {
      const res = await fetchMyParkingLots();
      const lots = res.data?.data || [];
      setParkingLots(lots);
      if (lots.length > 0 && !selectedLotId) setSelectedLotId(lots[0]._id);
    } catch (err: any) {
      console.error("Error loading parking lots", err);
      toast.error("Không thể tải danh sách bãi đỗ.");
    } finally {
      setParkingLotsLoading(false);
    }
  };

  useEffect(() => {
    loadLots();
    // Also load vehicles/customers for the "Add Ticket" modal if needed?
    // For now, let's just make the list work.
    // If strict on imports, we might need to load vehicles separately.
  }, []);

  // Fetch Tickets
  const fetchTickets = async () => {
    if (!selectedLotId) return;
    setLoading(true);
    try {
      const res = await getTicketsByParkingLotId(selectedLotId, {
        keyword: debouncedSearch,
        ticketType: filterType,
        status: filterStatus,
        date: filterDate,
      });
      setTickets(res.data?.data?.tickets || []);
    } catch (err) {
      console.error("Error fetching tickets", err);
      toast.error("Lỗi tải danh sách vé");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [selectedLotId, debouncedSearch, filterType, filterStatus, filterDate]);

  // Handler for Add Ticket (stub - would need proper implementation)
  const handleAddTicket = async (newTicket: Omit<TicketType, "_id">) => {
    // Implementation for adding ticket would go here
    // API.post ... then fetchTickets()
    toast.success("Tính năng tạo vé đang cập nhật");
  };

  const handleTicketClick = async (ticket: TicketType) => {
    // Logic to open ticket/booking detail
    // Map backend fields to what DetailBooking expects if needed
    // For now reusing existing logic but adapting to new fields
    setSelectedTicket(ticket);
    setTicketModalOpen(true);

    // If we have populated booking info in ticket, use it directly?
    if (ticket.bookingId && typeof ticket.bookingId === "object") {
      setSelectedBooking(ticket.bookingId);
      setSelectedBookingPartial(true); // It's populated, so partial info is there
    } else {
      // fetch if needed
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Ticket className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý vé</h1>
          <p className="text-gray-600 mt-2">
            Quản lý vé đỗ xe và theo dõi thời hạn sử dụng
          </p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Danh sách vé</CardTitle>
              <CardDescription>
                Quản lý, lọc và tìm kiếm vé của khách hàng
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-72">
                <SelectParkingLotDropdown
                  parkingLots={parkingLots}
                  selectedLotId={selectedLotId}
                  onSelect={setSelectedLotId}
                />
              </div>
              {/* Requires Vehicle/Customer data for form. 
                  If we want to keep this working, we need to fetch them. 
                  For now keeping it but passed empty arrays if not fetched.
              */}
              <TicketForm
                vehicles={vehicles}
                customers={[]} // Needs fetch logic if we want this to work fully
                onSubmit={handleAddTicket as any}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bộ lọc */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Tìm theo biển số, khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Tất cả loại vé</option>
              <option value="hours">Theo giờ</option>
              <option value="date">Theo ngày</option>
              <option value="month">Theo tháng</option>
              <option value="guest">Khách vãng lai</option>
            </select>

            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Active</option>
              <option value="used">Used</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="relative">
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full"
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  title="Xóa chọn ngày"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Bảng vé */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Vé</TableHead>
                  <TableHead>Biển Số</TableHead>
                  <TableHead>Khách Hàng</TableHead>
                  <TableHead>Loại Vé</TableHead>
                  <TableHead>Giá (VND)</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Ngày Đặt</TableHead>
                  <TableHead>Hết Hạn</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <TableRow
                      key={ticket._id}
                      onClick={() => handleTicketClick(ticket)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <TableCell className="font-medium">
                        {ticket._id.substring(ticket._id.length - 6)}
                      </TableCell>
                      <TableCell>{ticket.vehicleNumber}</TableCell>
                      <TableCell>
                        {ticket.userId?.userName ||
                          ticket.userId?.email ||
                          "N/A"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            ticket.ticketType === "hours"
                              ? "bg-blue-100 text-blue-800"
                              : ticket.ticketType === "date"
                              ? "bg-purple-100 text-purple-800"
                              : ticket.ticketType === "month"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {ticket.ticketType}
                        </span>
                      </TableCell>
                      <TableCell>
                        {ticket.bookingId?.totalPrice?.toLocaleString(
                          "vi-VN"
                        ) || ticket.price?.toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        {ticket.bookingId?.parkingSlotId
                          ? `${ticket.bookingId.parkingSlotId.zone}-${ticket.bookingId.parkingSlotId.slotNumber}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {formatDate(ticket.bookingId?.startTime)}
                      </TableCell>
                      <TableCell>
                        {formatDate(
                          ticket.bookingId?.endTime || ticket.expiryDate
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            ticket.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Không tìm thấy vé phù hợp
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Booking detail modal */}
      <DetailBooking
        open={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        bookingInfo={
          selectedBooking
            ? {
                name:
                  selectedBooking.userId?.userName ||
                  selectedTicket?.userId?.userName ||
                  "-",
                vehicle:
                  selectedBooking.vehicleNumber ||
                  selectedTicket?.vehicleNumber ||
                  "-",
                zone: selectedBooking.parkingSlotId?.zone || "-",
                spot: selectedBooking.parkingSlotId?.slotNumber || "-",
                startTime: selectedBooking.startTime || "-",
                endTime: selectedBooking.endTime || "-",
                paymentMethod: selectedBooking.paymentMethod || "-",
                estimatedFee: (
                  selectedBooking.totalPrice ||
                  selectedTicket?.price ||
                  0
                ).toString(),
              }
            : null
        }
      />
    </div>
  );
}
