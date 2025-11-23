"use client";

import { useEffect, useState } from "react";
import { Ticket, Filter, Calendar, User, Car } from "lucide-react";
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
import { Select } from "@/components/ui/select";

import TicketForm from "@/components/TicketForm";
import API from "@/lib/api";
import SelectParkingLotDropdown from "@/components/SelectParkingLotDropdown";
import DetailBooking from "@/components/DetailBooking";
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterExpiry, setFilterExpiry] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [selectedBookingPartial, setSelectedBookingPartial] =
    useState<boolean>(false);
  const [parkingLots, setParkingLots] = useState<any[]>([]);
  const [parkingLotsLoading, setParkingLotsLoading] = useState(false);
  const [parkingLotsError, setParkingLotsError] = useState<string | null>(null);
  const [selectedLotId, setSelectedLotId] = useState<string>("");
  const [bookingsForLot, setBookingsForLot] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  // Modal tạo vé vãng lai
  const handleAddTicket = async (newTicket: Omit<TicketType, "id">) => {
    try {
      const res = await API.post("/api/v1/tickets/owner", newTicket);
      if (res.data?.data) {
        setTickets((prev) => [res.data.data, ...prev]);
      }
    } catch (err) {
      // Xử lý lỗi
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Giả sử API trả về đúng định dạng
        const [ticketRes, customerRes, vehicleRes] = await Promise.all([
          API.get("/api/v1/tickets/owner"), // Lỗi
          API.get("/api/v1/customers/owner"), // Lỗi
          API.get("/api/v1/vehicles/owner"), // Lỗi
        ]);
        setTickets(ticketRes.data.data || []);
        setCustomers(customerRes.data.data || []);
        setVehicles(vehicleRes.data.data || []);
      } catch (err) {
        // Xử lý lỗi
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // load parking lots for selector
  const loadLots = async () => {
    setParkingLotsLoading(true);
    setParkingLotsError(null);
    try {
      const res = await fetchMyParkingLots();
      const lots = res.data?.data || [];
      setParkingLots(lots);
      if (lots.length > 0 && !selectedLotId) setSelectedLotId(lots[0]._id);
    } catch (err: any) {
      console.error("Error loading parking lots", err);
      const status = err?.response?.status;
      if (status === 401) {
        setParkingLotsError(
          "Không đăng nhập hoặc token hết hạn. Vui lòng đăng nhập lại."
        );
        toast.error(
          "Không đăng nhập hoặc token hết hạn. Vui lòng đăng nhập lại."
        );
      } else if (status === 403) {
        setParkingLotsError(
          "Tài khoản không có quyền xem bãi đỗ. Kiểm tra vai trò tài khoản."
        );
        toast.error(
          "Tài khoản không có quyền xem bãi đỗ. Kiểm tra vai trò tài khoản."
        );
      } else {
        setParkingLotsError(
          "Không thể tải danh sách bãi đỗ. Vui lòng thử lại."
        );
        toast.error("Không thể tải danh sách bãi đỗ. Vui lòng thử lại.");
      }
      setParkingLots([]);
    } finally {
      setParkingLotsLoading(false);
    }
  };

  useEffect(() => {
    loadLots();
  }, []);

  const loadBookingsForLot = async (lotId?: string) => {
    const id = lotId || selectedLotId;
    if (!id) return toast.error("Vui lòng chọn bãi");
    setLoadingBookings(true);
    try {
      // fetch all bookings and filter by parkingLot id
      const res = await API.get("/api/v1/bookings");
      const all = res.data?.data || res.data || [];
      const filtered = all.filter(
        (b: any) =>
          b.parkingSlotId?.parkingLot?._id === id ||
          b.parkingSlotId?.parkingLot?._id === id
      );
      setBookingsForLot(filtered);
      if (filtered.length === 0) toast("Không có đặt chỗ cho bãi này");
    } catch (err) {
      console.error("Error loading bookings for lot", err);
      toast.error("Lỗi khi tải đặt chỗ");
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleTicketClick = async (ticket: TicketType) => {
    setSelectedTicket(ticket);
    setSelectedBooking(null);
    setSelectedBookingPartial(true);
    setTicketModalOpen(true);

    // Try to fetch associated booking if bookingId exists
    const bookingId =
      (ticket as any).bookingId ||
      (ticket as any).booking?._id ||
      (ticket as any).bookingIdString;
    if (!bookingId) {
      // No booking id available, show ticket info only
      setSelectedBooking(ticket);
      setSelectedBookingPartial(true);
      return;
    }

    setTicketLoading(true);
    try {
      const resp = await getBookingById(bookingId);
      setSelectedBooking(resp.data);
      setSelectedBookingPartial(false);
    } catch (err: any) {
      console.error("Error fetching booking for ticket", err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        toast.error(
          "Không có quyền xem chi tiết booking — hiển thị thông tin vé cơ bản"
        );
        setSelectedBooking(ticket);
        setSelectedBookingPartial(true);
      } else {
        toast.error("Lỗi khi lấy chi tiết booking");
        setSelectedBooking(ticket);
        setSelectedBookingPartial(true);
      }
    } finally {
      setTicketLoading(false);
    }
  };

  const handleBookingRowClick = async (booking: any) => {
    // open modal and fetch booking details
    setSelectedBooking(booking);
    setSelectedBookingPartial(true);
    setTicketModalOpen(true);
    setTicketLoading(true);
    try {
      const resp = await getBookingById(booking._id);
      setSelectedBooking(resp.data);
      setSelectedBookingPartial(false);
    } catch (err: any) {
      console.error("Error fetching booking details", err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        toast.error(
          "Không có quyền xem chi tiết booking — hiển thị thông tin cơ bản"
        );
        setSelectedBooking(booking);
        setSelectedBookingPartial(true);
      } else {
        toast.error("Lỗi khi lấy chi tiết booking");
        setSelectedBooking(booking);
        setSelectedBookingPartial(true);
      }
    } finally {
      setTicketLoading(false);
    }
  };

  // Lọc vé
  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch =
      ticket.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType ? ticket.type === filterType : true;
    const matchCustomer = filterCustomer
      ? ticket.customer === filterCustomer
      : true;
    // Tính trạng thái dựa vào ngày hết hạn
    const now = new Date();
    const expiryDate = new Date(ticket.expiry);
    const status = expiryDate >= now ? "active" : "expired";
    const matchStatus = filterStatus ? status === filterStatus : true;
    const matchExpiry = filterExpiry ? ticket.expiry === filterExpiry : true;
    return (
      matchSearch && matchType && matchCustomer && matchStatus && matchExpiry
    );
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      {/* Parking lot selector + load bookings */}
      <div className="flex items-center gap-3">
        <div className="w-72">
          <SelectParkingLotDropdown
            parkingLots={parkingLots}
            selectedLotId={selectedLotId}
            onSelect={setSelectedLotId}
          />
        </div>
        <Button
          onClick={() => loadBookingsForLot()}
          disabled={loadingBookings}
          className="h-10"
        >
          {loadingBookings ? "Đang tải..." : "Xem đặt chỗ"}
        </Button>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {bookingsForLot.length
              ? `${bookingsForLot.length} đặt chỗ`
              : "Chưa có đặt chỗ"}
          </div>
          {parkingLotsLoading && (
            <div className="text-sm text-muted-foreground">Đang tải bãi...</div>
          )}
          {parkingLotsError && (
            <div className="flex items-center gap-2">
              <div className="text-sm text-red-600">{parkingLotsError}</div>
              <Button variant="outline" size="sm" onClick={() => loadLots()}>
                Thử lại
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Ticket className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý vé</h1>
          <p className="text-gray-600 mt-2">
            Quản lý vé đỗ xe và theo dõi thời hạn sử dụng
          </p>
        </div>
      </div>
      {/* Nút tạo vé vãng lai */}
      <div className="mb-2">
        <TicketForm
          vehicles={vehicles}
          customers={customers.map((c) => ({ id: c.id, name: c.userName }))}
          onSubmit={handleAddTicket}
        />
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Danh sách vé</CardTitle>
          <CardDescription>
            Quản lý, lọc và tìm kiếm vé của khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bộ lọc */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="Tìm theo biển số hoặc khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:w-64"
            />
            <select
              className="border rounded px-3 py-2 text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Loại vé</option>
              <option value="Daily">Hàng ngày</option>
              <option value="Monthly">Hàng tháng</option>
              <option value="Annual">Hàng năm</option>
            </select>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={filterCustomer}
              onChange={(e) => setFilterCustomer(e.target.value)}
            >
              <option value="">Khách hàng</option>
              {customers.map((c) => (
                <option key={c.id} value={c.userName}>
                  {c.userName}
                </option>
              ))}
            </select>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Trạng thái</option>
              <option value="active">Còn hiệu lực</option>
              <option value="expired">Hết hạn</option>
            </select>
            <Input
              type="date"
              value={filterExpiry}
              onChange={(e) => setFilterExpiry(e.target.value)}
              className="md:w-40"
            />
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
                  <TableHead>Tầng</TableHead>
                  <TableHead>Hết Hạn</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.licensePlate}</TableCell>
                      <TableCell>{ticket.customer}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            ticket.type === "Daily"
                              ? "bg-blue-100 text-blue-800"
                              : ticket.type === "Monthly"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {ticket.type === "Daily"
                            ? "Hàng Ngày"
                            : ticket.type === "Monthly"
                            ? "Hàng Tháng"
                            : "Hàng Năm"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {ticket.price?.toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell>{ticket.floor}</TableCell>
                      <TableCell>{formatDate(ticket.expiry)}</TableCell>
                      <TableCell>
                        {new Date(ticket.expiry) >= new Date() ? (
                          <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                            Còn hiệu lực
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                            Hết hạn
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Không tìm thấy vé phù hợp
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bookings for selected lot */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Đặt chỗ của bãi đã chọn
          </CardTitle>
          <CardDescription>
            Danh sách các đặt chỗ theo bãi đỗ bạn chọn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đặt</TableHead>
                  <TableHead>Khách</TableHead>
                  <TableHead>Biển số</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Bắt đầu</TableHead>
                  <TableHead>Kết thúc</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingBookings ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Đang tải đặt chỗ...
                    </TableCell>
                  </TableRow>
                ) : bookingsForLot.length > 0 ? (
                  bookingsForLot.map((b) => (
                    <TableRow
                      key={b._id}
                      className="hover:cursor-pointer"
                      onClick={() => handleBookingRowClick(b)}
                    >
                      <TableCell className="font-medium">{b._id}</TableCell>
                      <TableCell>
                        {b.userId?.userName ||
                          b.userId?.name ||
                          b.userName ||
                          b.customerName ||
                          "-"}
                      </TableCell>
                      <TableCell>
                        {b.vehicleNumber || b.vehicle || "-"}
                      </TableCell>
                      <TableCell>
                        {b.parkingSlotId?.slotNumber ||
                          b.spot ||
                          b.parkingSlotId?.parkingLot?.name ||
                          "-"}
                      </TableCell>
                      <TableCell>
                        {b.startTime
                          ? new Date(b.startTime).toLocaleString("vi-VN")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {b.endTime
                          ? new Date(b.endTime).toLocaleString("vi-VN")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {b.status ||
                          (new Date(b.endTime) > new Date()
                            ? "active"
                            : "expired")}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookingRowClick(b);
                          }}
                        >
                          Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Không có đặt chỗ
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
                  selectedBooking.userId?.name ||
                  selectedBooking.userName ||
                  selectedBooking.customerName ||
                  selectedBooking.name ||
                  "-",
                vehicle:
                  selectedBooking.vehicleNumber ||
                  selectedBooking.vehicle ||
                  selectedBooking.vehicleInfo ||
                  "-",
                zone:
                  selectedBooking.parkingSlotId?.parkingLot?.name ||
                  selectedBooking.zone ||
                  "-",
                spot:
                  selectedBooking.parkingSlotId?.slotNumber ||
                  selectedBooking.spot ||
                  "-",
                startTime:
                  selectedBooking.startTime || selectedBooking.from || "-",
                endTime: selectedBooking.endTime || selectedBooking.to || "-",
                paymentMethod:
                  selectedBooking.paymentMethod ||
                  selectedBooking.payment ||
                  "-",
                estimatedFee: (
                  selectedBooking.totalPrice ||
                  selectedBooking.estimatedFee ||
                  0
                ).toString(),
              }
            : null
        }
      />
    </div>
  );
}
