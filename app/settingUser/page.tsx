"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Bell,
  Database,
  Save,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import API from "@/lib/api";
import { ToastProvider, useToast } from "@/components/providers/ToastProvider";

function SettingUserContent() {
  const router = useRouter();
  const toast = useToast();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [twoFA, setTwoFA] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await API.get("/api/v1/users/me");
        if (res.data) {
          setUserInfo({
            name: res.data.userName || "",
            email: res.data.email || "",
            phone: res.data.phoneNumber || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        toast.error("Không thể tải thông tin người dùng.");
      }
    };

    fetchUserInfo();
  }, [toast]);

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ các trường mật khẩu.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    
    try {
      await API.patch("/api/v1/users/updateMyPassword", {
        passwordCurrent: oldPassword,
        password: newPassword,
        passwordConfirm: confirmPassword
      });
      toast.success("Mật khẩu đã được cập nhật thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Change password error:", error);
      let errorMessage = error.response?.data?.message || "Đổi mật khẩu thất bại.";
      
      // Nếu lỗi 401 (Unauthorized) thường là do sai mật khẩu hiện tại ở endpoint này
      if (error.response?.status === 401) {
        errorMessage = "Mật khẩu hiện tại không đúng.";
      }
      
      toast.error(errorMessage);
    }
  };

  const handleSave = () => {
    // Currently only simulating save for other settings
    toast.success("Cài đặt đã được lưu thành công!");
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 bg-white">
      {/* BACK */}
      <button
        onClick={() => router.push("/")}
        className="self-start flex items-center gap-2 mb-8 text-black hover:underline"
      >
        <ArrowLeft className="w-5 h-5" /> Quay Về Trang Chủ
      </button>

      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-black">
        Cài Đặt Người Dùng
      </h1>

      <div className="w-full max-w-3xl flex flex-col gap-8">

        {/* ACCOUNT INFO */}
        <div className="border border-black rounded-lg p-6 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Thông Tin Tài Khoản</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <Label className="mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </Label>
              <Input
                type="email"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="mb-1 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Số Điện Thoại
              </Label>
              <Input
                type="text"
                value={userInfo.phone}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, phone: e.target.value })
                }
              />
            </div>
            <p className="text-sm text-gray-500">
              * Tên của bạn không thể thay đổi.
            </p>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="border border-black rounded-lg p-6 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Thay Đổi Mật Khẩu</h2>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <Label className="mb-1">Mật Khẩu Hiện Tại</Label>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1">Mật Khẩu Mới</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1">Xác Nhận Mật Khẩu Mới</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button
              onClick={handleUpdatePassword}
              className="flex items-center gap-2 bg-black text-white hover:bg-gray-900 w-max"
            >
              <Lock className="w-4 h-4" /> Cập Nhật Mật Khẩu
            </Button>
          </div>
        </div>

        {/* TWO FACTOR AUTH */}
        <div className="border border-black rounded-lg p-6 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Xác Thực Hai Yếu Tố</h2>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={twoFA}
              onChange={() => setTwoFA(!twoFA)}
            />
            Bật 2FA để tăng cường bảo mật cho tài khoản.
          </label>
        </div>

        {/* NOTIFICATIONS */}
        <div className="border border-black rounded-lg p-6 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Thông Báo</h2>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            Nhận cập nhật về đặt chỗ, thanh toán và thông báo hệ thống.
          </label>
        </div>

        {/* PRIVACY */}
        <div className="border border-black rounded-lg p-6 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Quyền Riêng Tư & Dữ Liệu</h2>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={shareLocation}
              onChange={() => setShareLocation(!shareLocation)}
            />
            Cho phép hệ thống sử dụng vị trí xe của bạn để cung cấp dịch vụ tốt hơn.
          </label>
        </div>

        <Button
          onClick={handleSave}
          className="flex items-center gap-2 bg-black text-white hover:bg-gray-900"
        >
          <Save className="w-5 h-5" /> Lưu Cài Đặt
        </Button>
      </div>
    </main>
  );
}

export default function SettingUserPage() {
  return (
    <ToastProvider>
      <SettingUserContent />
    </ToastProvider>
  );
}