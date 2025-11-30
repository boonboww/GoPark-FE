"use client";

import { User, Settings } from "lucide-react";
import AccountManagement from "@/app/owner/account/AccountManagement";
import ChangePasswordForm from "@/app/owner/account/ChangePasswordForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý tài khoản
          </h1>
          <p className="text-gray-600 mt-2">
            Cập nhật thông tin cá nhân và cài đặt tài khoản
          </p>
        </div>
      </div>
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="info">
            <User className="w-4 h-4 mr-1" /> Thông tin tài khoản
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-1" /> Cài đặt tài khoản
          </TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <AccountManagement />
        </TabsContent>
        <TabsContent value="settings">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
