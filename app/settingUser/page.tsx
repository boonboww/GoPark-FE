"use client";

import { useState } from "react";
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

export default function SettingUserPage() {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState({
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [twoFA, setTwoFA] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);

  const handleSave = () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert("❌ New passwords do not match!");
      return;
    }
    // Ở đây bạn sẽ call API cập nhật
    alert("✅ Settings saved successfully!");
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 bg-white">
      {/* BACK */}
      <button
        onClick={() => router.push("/")}
        className="self-start flex items-center gap-2 mb-8 text-black hover:underline"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </button>

      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-black">
        User Settings
      </h1>

      <div className="w-full max-w-3xl flex flex-col gap-8">

        {/* ACCOUNT INFO */}
        <div className="border border-black rounded-lg p-6 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Account Information</h2>
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
                <Phone className="w-4 h-4" /> Phone Number
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
              * Your name cannot be changed.
            </p>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
    <div className="border border-black rounded-lg p-6 shadow-sm bg-white">
  <div className="flex items-center gap-2 mb-4">
    <Lock className="w-5 h-5" />
    <h2 className="text-lg font-semibold">Change Password</h2>
  </div>
  <div className="flex flex-col gap-4">
    <div>
      <Label className="mb-1">Current Password</Label>
      <Input
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
    </div>
    <div>
      <Label className="mb-1">New Password</Label>
      <Input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </div>
    <div>
      <Label className="mb-1">Confirm New Password</Label>
      <Input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </div>

    <Button
      onClick={() => {
        if (!oldPassword || !newPassword || !confirmPassword) {
          alert("❌ Please fill all password fields.");
          return;
        }
        if (newPassword !== confirmPassword) {
          alert("❌ New passwords do not match!");
          return;
        }
        // TODO: Call real API here
        alert("✅ Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }}
      className="flex items-center gap-2 bg-black text-white hover:bg-gray-900 w-max"
    >
      <Lock className="w-4 h-4" /> Update Password
    </Button>
  </div>
</div>

        {/* TWO FACTOR AUTH */}
        <div className="border border-black rounded-lg p-6 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={twoFA}
              onChange={() => setTwoFA(!twoFA)}
            />
            Enable 2FA for more secure account access.
          </label>
        </div>

        {/* NOTIFICATIONS */}
        <div className="border border-black rounded-lg p-6 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            Receive updates for bookings, payments and system messages.
          </label>
        </div>

        {/* PRIVACY */}
        <div className="border border-black rounded-lg p-6 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Privacy & Data</h2>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={shareLocation}
              onChange={() => setShareLocation(!shareLocation)}
            />
            Allow the system to use your vehicle location for better service.
          </label>
        </div>

        <Button
          onClick={handleSave}
          className="flex items-center gap-2 bg-black text-white hover:bg-gray-900"
        >
          <Save className="w-5 h-5" /> Save Settings
        </Button>
      </div>
    </main>
  );
}
