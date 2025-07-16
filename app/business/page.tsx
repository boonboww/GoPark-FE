"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PolicyForm } from "./PolicyForm";
import { User2, Send, ShieldCheck, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
// import axios from "axios";

// // const API = axios.create({
// //   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
// //   withCredentials: true,
// // });

export default function BusinessPage() {
  const [formData, setFormData] = useState({
    ownerName: "",
    ownerEmail: "",
    phone: "",
    acceptPolicy: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPolicy, setShowPolicy] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    setFormData({ ...formData, [name]: value });

    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, acceptPolicy: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!formData.ownerName) newErrors.ownerName = "Bắt buộc";
    if (!formData.ownerEmail) {
      newErrors.ownerEmail = "Bắt buộc";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.ownerEmail)) {
        newErrors.ownerEmail = "Email không hợp lệ";
      }
    }

    if (!formData.phone) newErrors.phone = "Bắt buộc";

    if (!formData.acceptPolicy) {
      alert("❌ Bạn phải đồng ý với điều khoản trước khi gửi!");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setShowConfirm(true);
  };

  const handleCreateParkingLot = () => {
  setLoading(true);

  setTimeout(() => {
    setFormData({
      ownerName: "",
      ownerEmail: "",
      phone: "",
      acceptPolicy: false,
    });

    setLoading(false);
    setShowConfirm(false);
    setShowSuccess(true);
  }, 500); // Giả lập delay
};


  const renderInputError = (field: string) =>
    errors[field] && (
      <div className="flex items-center gap-1 mt-1 text-yellow-600 text-xs">
        <AlertTriangle className="w-4 h-4" /> <span>{errors[field]}</span>
      </div>
    );

  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen items-center justify-start mt-16 px-4 py-16 bg-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Đăng ký bãi đỗ xe của bạn
        </h1>

        <div className="w-full max-w-2xl md:max-w-3xl grid grid-cols-1 gap-8 justify-center">
          <div className="bg-white border rounded-xl shadow-sm p-6 space-y-4 min-w-0 flex flex-col">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User2 className="w-5 h-5" /> Thông tin chủ bãi
            </h2>

            <div>
              <Label htmlFor="ownerName">Họ và tên *</Label>
              <Input
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
              />
              {renderInputError("ownerName")}
            </div>

            <div>
              <Label htmlFor="ownerEmail">Email *</Label>
              <Input
                id="ownerEmail"
                name="ownerEmail"
                value={formData.ownerEmail}
                onChange={handleChange}
              />
              {renderInputError("ownerEmail")}
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {renderInputError("phone")}
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col justify-between min-w-0">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Điều khoản
              </h2>
              <p className="text-sm text-muted-foreground">
                Vui lòng đọc và đồng ý với chính sách trước khi gửi đăng ký.
              </p>

              <button
                type="button"
                onClick={() => setShowPolicy(true)}
                className="text-sky-600 underline text-sm hover:text-sky-800"
              >
                Xem chính sách
              </button>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="acceptPolicy"
                  checked={formData.acceptPolicy}
                  onCheckedChange={(checked) => handleCheckboxChange(!!checked)}
                />
                <Label htmlFor="acceptPolicy" className="text-sm">
                  Tôi đồng ý với chính sách bãi đỗ xe.
                </Label>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full mt-6 bg-black text-white hover:bg-gray-900"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi đăng ký"}
              <Send className="w-4 h-4 ml-2" />
            </Button>

            <PolicyForm open={showPolicy} onOpenChange={setShowPolicy} />
          </div>
        </div>
      </main>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận gửi đăng ký</DialogTitle>
          </DialogHeader>
          <p>
            Bạn có chắc chắn muốn gửi đăng ký bãi đỗ xe này tới quản trị viên?
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateParkingLot} disabled={loading}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đã gửi yêu cầu!</DialogTitle>
          </DialogHeader>
          <p>
            Cảm ơn bạn đã gửi đăng ký. Yêu cầu đã được chuyển đến quản trị viên.
            Vui lòng kiểm tra email để nhận xác nhận.
          </p>
          <DialogFooter className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setShowSuccess(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="hidden md:block w-full">
        <Footer />
      </div>
    </>
  );
}
