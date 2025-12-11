"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ChangePasswordForm from "@/app/owner/account/ChangePasswordForm";
import API from "@/lib/api";

export default function AccountSettingsPanel() {
  // Email
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // Phone
  const [phone, setPhone] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [phoneSuccess, setPhoneSuccess] = useState("");

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");
    if (!email) {
      setEmailError("Vui lòng nhập email mới.");
      return;
    }
    setEmailLoading(true);
    try {
      await API.patch("/api/v1/users/change-email", { email });
      setEmailSuccess("Đổi email thành công!");
      setEmail("");
    } catch (err: any) {
      setEmailError(err?.response?.data?.message || "Đổi email thất bại.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePhoneChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    setPhoneSuccess("");
    if (!phone) {
      setPhoneError("Vui lòng nhập số điện thoại mới.");
      return;
    }
    setPhoneLoading(true);
    try {
      await API.patch("/api/v1/users/change-phone", { phone });
      setPhoneSuccess("Đổi số điện thoại thành công!");
      setPhone("");
    } catch (err: any) {
      setPhoneError(
        err?.response?.data?.message || "Đổi số điện thoại thất bại."
      );
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <ChangePasswordForm />
      <Card>
        <CardHeader>
          <CardTitle>Đổi email</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleEmailChange}>
            <Input
              type="email"
              placeholder="Email mới"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && (
              <div className="text-red-500 text-sm">{emailError}</div>
            )}
            {emailSuccess && (
              <div className="text-green-600 text-sm">{emailSuccess}</div>
            )}
            <Button type="submit" disabled={emailLoading} className="w-full">
              {emailLoading ? "Đang xử lý..." : "Đổi email"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Đổi số điện thoại</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handlePhoneChange}>
            <Input
              type="tel"
              placeholder="Số điện thoại mới"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            {phoneError && (
              <div className="text-red-500 text-sm">{phoneError}</div>
            )}
            {phoneSuccess && (
              <div className="text-green-600 text-sm">{phoneSuccess}</div>
            )}
            <Button type="submit" disabled={phoneLoading} className="w-full">
              {phoneLoading ? "Đang xử lý..." : "Đổi số điện thoại"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
