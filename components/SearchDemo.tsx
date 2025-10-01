"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Users, 
  Building2, 
  Ticket, 
  BarChart3,
  Clock,
  Filter,
  Command
} from 'lucide-react';
import QuickSearch from '@/components/QuickSearch';
import { 
  getAllSearchItems, 
  getCustomerSearchItems, 
  getParkingLotSearchItems,
  getTicketSearchItems,
  getMenuSearchItems
} from '@/lib/search-utils';

export default function SearchDemo() {
  const allItems = getAllSearchItems();
  const menuItems = getMenuSearchItems();
  const customerItems = getCustomerSearchItems();
  const parkingItems = getParkingLotSearchItems();
  const ticketItems = getTicketSearchItems();

  const stats = [
    {
      title: 'Tổng số items',
      value: allItems.length,
      icon: Search,
      color: 'text-blue-600'
    },
    {
      title: 'Menu items',
      value: menuItems.length,
      icon: Command,
      color: 'text-purple-600'
    },
    {
      title: 'Khách hàng',
      value: customerItems.length,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Bãi đỗ xe',
      value: parkingItems.length,
      icon: Building2,
      color: 'text-orange-600'
    },
    {
      title: 'Vé đỗ xe',
      value: ticketItems.length,
      icon: Ticket,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Quick Search Demo
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Demo chức năng tìm kiếm nhanh cho Owner Dashboard. 
          Hỗ trợ tìm kiếm menu, khách hàng, bãi đỗ xe, vé và báo cáo.
        </p>
      </div>

      {/* Quick Search Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Quick Search Component
          </CardTitle>
          <CardDescription>
            Nhấn Ctrl+K hoặc click vào ô tìm kiếm để bắt đầu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <QuickSearch />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Command className="w-5 h-5" />
              Tính năng chính
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">✨</Badge>
              <span className="text-sm">Tìm kiếm realtime với fuzzy matching</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">⌨️</Badge>
              <span className="text-sm">Keyboard shortcuts (Ctrl+K, Arrow keys)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">🏷️</Badge>
              <span className="text-sm">Lọc theo danh mục</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">🕒</Badge>
              <span className="text-sm">Lưu lịch sử tìm kiếm</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">📱</Badge>
              <span className="text-sm">Responsive design</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Danh mục tìm kiếm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700">Menu</Badge>
              <span className="text-sm">Dashboard, báo cáo, cài đặt</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">Khách hàng</Badge>
              <span className="text-sm">Thông tin và trạng thái khách hàng</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-700">Bãi đỗ xe</Badge>
              <span className="text-sm">Địa điểm và tình trạng bãi đỗ</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-700">Vé đỗ xe</Badge>
              <span className="text-sm">Vé và giao dịch đỗ xe</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-700">Gần đây</Badge>
              <span className="text-sm">Lịch sử tìm kiếm</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sample Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Dữ liệu mẫu
          </CardTitle>
          <CardDescription>
            Một số ví dụ về dữ liệu có thể tìm kiếm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Khách hàng mẫu:</h4>
              <div className="space-y-2 text-sm">
                <div>• Nguyễn Văn An (an.nguyen@email.com)</div>
                <div>• Trần Thị Bình (binh.tran@email.com)</div>
                <div>• Lê Hoàng Công (cong.le@email.com)</div>
                <div>• Phạm Thị Dung (dung.pham@email.com)</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Bãi đỗ xe mẫu:</h4>
              <div className="space-y-2 text-sm">
                <div>• Bãi đỗ xe Vincom Center</div>
                <div>• Parking Time Square</div>
                <div>• Smart Park Landmark</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Hướng dẫn sử dụng
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-2">
          <p>1. <strong>Mở tìm kiếm:</strong> Nhấn Ctrl+K hoặc click vào ô tìm kiếm</p>
          <p>2. <strong>Nhập từ khóa:</strong> Gõ tên khách hàng, bãi đỗ xe, hoặc menu</p>
          <p>3. <strong>Điều hướng:</strong> Dùng mũi tên ↑↓ để chọn kết quả</p>
          <p>4. <strong>Chọn kết quả:</strong> Nhấn Enter hoặc click để chuyển trang</p>
          <p>5. <strong>Lọc danh mục:</strong> Click vào các nút danh mục để lọc kết quả</p>
        </CardContent>
      </Card>
    </div>
  );
}
