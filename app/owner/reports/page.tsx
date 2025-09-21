"use client";


import { BarChart3 } from "lucide-react";
import ReportCharts from "@/components/ReportCharts";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-600 mt-2">
            Xem báo cáo doanh thu, lượt xe và tỷ lệ lấp đầy các bãi đỗ
          </p>
        </div>
      </div>
      <ReportCharts />
    </div>
  );
}
