"use client";

import { User } from "lucide-react";
import AccountManagement from "@/components/AccountManagement";

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tài khoản</h1>
          <p className="text-gray-600 mt-2">
            Cập nhật thông tin cá nhân và cài đặt tài khoản
          </p>
        </div>
      </div>
      <AccountManagement />
    </div>
  );
}
