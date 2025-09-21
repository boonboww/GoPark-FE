"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from "chart.js";
import { Calendar, ParkingSquare } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

export default function ReportCharts() {
  // Bộ lọc ngày tháng năm
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  // Bộ lọc bãi đỗ
  const parkingLots = [
    { id: "thienphu", name: "Bãi Thiên Phú" },
    { id: "thanhcong", name: "Bãi Thành Công" },
    { id: "anbinh", name: "Bãi An Bình" },
  ];
  const [selectedLot, setSelectedLot] = useState(parkingLots[0].id);

  // Dữ liệu mẫu theo bãi đỗ
  const lotData = {
    thienphu: {
      revenue: [12, 15, 10, 18, 20, 22],
      traffic: [120, 150, 130, 170, 200, 220, 180],
      occupancy: 85,
    },
    thanhcong: {
      revenue: [10, 13, 9, 16, 18, 19],
      traffic: [110, 140, 120, 160, 180, 200, 170],
      occupancy: 72,
    },
    anbinh: {
      revenue: [14, 17, 12, 20, 22, 25],
      traffic: [130, 160, 140, 180, 210, 230, 190],
      occupancy: 90,
    },
  };

  const revenueData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
      {
        label: "Doanh thu (triệu VND)",
        data: lotData[selectedLot].revenue,
        backgroundColor: "#22c55e",
      },
    ],
  };
  const trafficData = {
    labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"],
    datasets: [
      {
        label: "Lượt xe ra/vào",
        data: lotData[selectedLot].traffic,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        fill: true,
      },
    ],
  };
  const occupancyData = {
    labels: parkingLots.map(lot => lot.name),
    datasets: [
      {
        label: "Tỷ lệ lấp đầy (%)",
        data: parkingLots.map(lot => lotData[lot.id].occupancy),
        backgroundColor: ["#f59e42", "#38bdf8", "#a3e635"],
      },
    ],
  };

  // Bộ lọc UI
  const FilterBar = (
    <div className="flex flex-col md:flex-row gap-2 items-center mb-4">
      <label className="flex items-center gap-2 text-sm">
        <ParkingSquare className="w-4 h-4" />
        Chọn bãi đỗ
        <select
          value={selectedLot}
          onChange={e => setSelectedLot(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {parkingLots.map(lot => (
            <option key={lot.id} value={lot.id}>{lot.name}</option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Calendar className="w-4 h-4" />
        Từ ngày
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />
      </label>
      <span className="hidden md:inline">—</span>
      <label className="flex items-center gap-2 text-sm">
        <Calendar className="w-4 h-4" />
        Đến ngày
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />
      </label>
    </div>
  );

  return (
    <Tabs defaultValue="revenue" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="revenue">Doanh thu bãi đỗ</TabsTrigger>
        <TabsTrigger value="traffic">Lượt xe ra/vào</TabsTrigger>
        <TabsTrigger value="occupancy">Tỷ lệ lấp đầy</TabsTrigger>
      </TabsList>
      <TabsContent value="revenue">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu các tháng</CardTitle>
            <CardDescription>Thống kê doanh thu từng tháng, so sánh tăng trưởng và hiệu suất kinh doanh.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {FilterBar}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600">{Math.max(...lotData[selectedLot].revenue)} triệu VND</div>
                <div className="text-xs text-gray-600">Tháng cao nhất</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-600">{Math.min(...lotData[selectedLot].revenue)} triệu VND</div>
                <div className="text-xs text-gray-600">Tháng thấp nhất</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-purple-600">{lotData[selectedLot].revenue.reduce((a,b)=>a+b,0)} triệu VND</div>
                <div className="text-xs text-gray-600">Tổng 6 tháng</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-orange-600">+18%</div>
                <div className="text-xs text-gray-600">Tăng trưởng so với kỳ trước</div>
              </div>
            </div>
            <div className="max-w-xl mx-auto">
              <Bar data={revenueData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="traffic">
        <Card>
          <CardHeader>
            <CardTitle>Lượt xe ra/vào trong tuần</CardTitle>
            <CardDescription>Thống kê số lượt xe ra/vào từng ngày, nhận diện ngày cao điểm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {FilterBar}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-600">{Math.max(...lotData[selectedLot].traffic)} lượt</div>
                <div className="text-xs text-gray-600">Ngày cao nhất</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600">{Math.min(...lotData[selectedLot].traffic)} lượt</div>
                <div className="text-xs text-gray-600">Ngày thấp nhất</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-orange-600">{lotData[selectedLot].traffic.reduce((a,b)=>a+b,0)} lượt</div>
                <div className="text-xs text-gray-600">Tổng tuần</div>
              </div>
            </div>
            <div className="max-w-xl mx-auto">
              <Line data={trafficData} options={{ responsive: true }} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="occupancy">
        <Card>
          <CardHeader>
            <CardTitle>Tỷ lệ lấp đầy các bãi</CardTitle>
            <CardDescription>So sánh tỷ lệ lấp đầy giữa các bãi đỗ, nhận diện bãi hoạt động tốt nhất.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {FilterBar}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              {parkingLots.map(lot => (
                <div key={lot.id} className={`rounded-lg p-3 text-center ${lot.id === selectedLot ? "bg-yellow-50" : "bg-blue-50"}`}>
                  <div className={`text-lg font-bold ${lot.id === selectedLot ? "text-yellow-600" : "text-blue-600"}`}>{lotData[lot.id].occupancy}%</div>
                  <div className="text-xs text-gray-600">{lot.name}</div>
                </div>
              ))}
            </div>
            <div className="max-w-xs mx-auto">
              <Pie data={occupancyData} options={{ responsive: true }} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}