"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import API from "@/lib/api";

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới không khớp.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/api/v1/users/change-password", {
        oldPassword,
        newPassword,
      });
      setSuccess("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Đổi mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Đổi mật khẩu</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Mật khẩu hiện tại"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
