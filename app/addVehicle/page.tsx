"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Vehicle } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Car, AlertTriangle, Lock } from "lucide-react";
import QRCode from "react-qr-code";
import EditVehicleForm from "./EditVehicleForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastProvider, useToast } from "@/components/ToastProvider";

interface ApiError {
  response?: {
    status?: number;
    data?: {
      field?: string;
      message?: string;
    };
  };
}

function AddVehicleContent() {
  const toast = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [newVehicle, setNewVehicle] = useState({
    licensePlate: "",
    capacity: 4,
    imageVehicle: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [licensePlateError, setLicensePlateError] = useState<string>("");

  const MAX_VEHICLES = 3;

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  // Validate biển số xe theo format Việt Nam
  const validateLicensePlate = (plate: string): boolean => {
    if (!plate || plate.trim() === "") {
      setLicensePlateError("Biển số xe không được để trống");
      return false;
    }

    // Format mới (từ 2023): XX-Y XXXX hoặc XX-Y XXXXX (11-12 ký tự)
    // XX: Mã tỉnh/thành (2 số)
    // Y: Chữ cái (1 ký tự)
    // XXXX hoặc XXXXX: Số (4-5 chữ số)
    const newFormat = /^[0-9]{2}[A-Z]{1}[-\s]?[0-9]{4,5}$/i;
    
    // Format cũ: XX(X)-YYYYY (ví dụ: 43A-12345, 29B-12345)
    // XX(X): Mã tỉnh (2-3 ký tự bao gồm số + chữ)
    // YYYYY: Số thứ tự (4-5 số)
    const oldFormat = /^[0-9]{2}[A-Z]{1}[-\s]?[0-9]{4,5}$/i;
    
    // Format cho xe máy: XX-YY XXX.XX (có dấu chấm)
    const motorbikeFormat = /^[0-9]{2}[A-Z]{1}[-\s]?[0-9]{2}[-\s]?[0-9]{3}\.[0-9]{2}$/i;

    const trimmedPlate = plate.trim().toUpperCase();
    
    if (!newFormat.test(trimmedPlate) && !oldFormat.test(trimmedPlate) && !motorbikeFormat.test(trimmedPlate)) {
      setLicensePlateError(
        "Biển số không đúng định dạng. VD: 30A-12345, 51B-12345, 29C-123.45"
      );
      return false;
    }

    setLicensePlateError("");
    return true;
  };

  const fetchMyVehicles = async () => {
    try {
      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }

      const res = await API.get<{ data: Vehicle[] }>("/api/v1/vehicles/my-vehicles");
      setVehicles(res.data.data || []);
    } catch (error: any) {
      console.error(error);
      
      // Xử lý lỗi 401 Unauthorized
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }
      
      toast.error("Không thể tải danh sách phương tiện.");
    }
  };

  const handleAddVehicle = async () => {
    // Clear previous errors
    setLicensePlateError("");

    // Kiểm tra token
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    if (vehicles.length >= MAX_VEHICLES) {
      toast.warning("Bạn chỉ được đăng ký tối đa 3 phương tiện.");
      return;
    }

    // Validate biển số xe
    if (!validateLicensePlate(newVehicle.licensePlate)) {
      return;
    }

    // Validate sức chứa
    if (!newVehicle.capacity || newVehicle.capacity < 1) {
      toast.error("Sức chứa phải lớn hơn 0.");
      return;
    }

    // Xác nhận thêm xe
    const confirmed = window.confirm(
      `Xác nhận thêm phương tiện?\n\nBiển số: ${newVehicle.licensePlate.toUpperCase()}\nSức chứa: ${newVehicle.capacity} chỗ`
    );
    
    if (!confirmed) {
      return;
    }

    try {
      let imageUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await API.post("/api/v1/upload?folder=vehicles", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.url;
      }

      await API.post("/api/v1/vehicles", { 
        ...newVehicle, 
        licensePlate: newVehicle.licensePlate.toUpperCase().trim(),
        imageVehicle: imageUrl 
      });

      toast.success("Thêm phương tiện thành công!");
      setNewVehicle({ licensePlate: "", capacity: 4, imageVehicle: "" });
      setFile(null);
      setLicensePlateError("");
      fetchMyVehicles();
    } catch (error) {
      const apiError = error as ApiError;
      
      // Xử lý lỗi 401
      if (apiError.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }
      
      if (apiError.response?.data?.field === "licensePlate") {
        toast.error("Biển số này đã được đăng ký.");
        return;
      }
      console.error(error);
      toast.error("Thêm phương tiện thất bại.");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Bạn có chắc chắn muốn xóa phương tiện này?")) return;
    
    // Kiểm tra token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lỗi: Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }
    
    try {
      await API.delete(`/api/v1/vehicles/${id}`);
      toast.success("Xóa phương tiện thành công!");
      fetchMyVehicles();
    } catch (error: any) {
      console.error(error);
      
      // Xử lý lỗi 401
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }
      
      toast.error("Xóa phương tiện thất bại.");
    }
  };

  const handleUpdate = async (vehicle: Vehicle) => {
    if (!vehicle._id) return;

    // Kiểm tra token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Lỗi: Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    // Validate trước khi update
    if (!vehicle.licensePlate || vehicle.licensePlate.trim() === "") {
      alert("Lỗi: Biển số xe không được để trống!");
      return;
    }

    if (!vehicle.capacity || vehicle.capacity < 1) {
      alert("Lỗi: Sức chứa phải lớn hơn 0!");
      return;
    }

    // Validate format biển số
    const tempError = licensePlateError;
    if (!validateLicensePlate(vehicle.licensePlate)) {
      alert(`Lỗi: ${licensePlateError}`);
      setLicensePlateError(tempError);
      return;
    }

    // Xác nhận lưu thay đổi
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn lưu thay đổi?\n\nBiển số: ${vehicle.licensePlate.toUpperCase()}\nSức chứa: ${vehicle.capacity} chỗ`
    );

    if (!confirmed) {
      return;
    }

    try {
      await API.put(`/api/v1/vehicles/${vehicle._id}`, {
        ...vehicle,
        licensePlate: vehicle.licensePlate.toUpperCase().trim()
      });
      toast.success("Cập nhật phương tiện thành công!");
      setEditing(null);
      fetchMyVehicles();
    } catch (error) {
      const apiError = error as ApiError;
      
      // Xử lý lỗi 401
      if (apiError.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }
      
      if (apiError.response?.data?.field === "licensePlate") {
        alert("Lỗi: Biển số này đã được đăng ký.");
        return;
      }
      console.error(error);
      toast.error("Cập nhật phương tiện thất bại.");
    }
  };

  const handleImageError = () => setImageError("Không thể tải hình ảnh.");

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16 space-y-10">
        <h1 className="text-3xl font-bold text-center text-primary">Phương Tiện Của Tôi</h1>

        {/* Form Thêm Vehicle */}
        <section className="bg-white p-6 rounded-xl shadow-md space-y-4 border">
          {vehicles.length >= MAX_VEHICLES && (
            <div className="text-red-600 flex gap-2 items-center">
              <Lock className="w-4 h-4" /> Bạn chỉ được đăng ký tối đa 3 phương tiện.
            </div>
          )}
          <div>
            <Label>Biển số xe <span className="text-red-500">*</span></Label>
            <Input
              value={newVehicle.licensePlate}
              onChange={(e) => {
                setNewVehicle({ ...newVehicle, licensePlate: e.target.value });
                setLicensePlateError("");
              }}
              onBlur={() => {
                if (newVehicle.licensePlate) {
                  validateLicensePlate(newVehicle.licensePlate);
                }
              }}
              placeholder="VD: 30A-12345, 51B-12345, 29C-123.45"
              className={licensePlateError ? "border-red-500" : ""}
            />
            {licensePlateError && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {licensePlateError}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Format: XX[A-Z]-XXXXX (VD: 30A-12345) hoặc XX[A-Z]-XX-XXX.XX (xe máy)
            </p>
          </div>
          <div>
            <Label>Sức chứa <span className="text-red-500">*</span></Label>
            <Input
              type="number"
              min="1"
              max="50"
              value={newVehicle.capacity}
              onChange={(e) =>
                setNewVehicle({ ...newVehicle, capacity: Number(e.target.value) })
              }
              placeholder="VD: 4"
            />
            <p className="text-xs text-gray-500 mt-1">
              Số chỗ ngồi của phương tiện (từ 1-50)
            </p>
          </div>
          <div>
            <Label>Ảnh phương tiện (tùy chọn)</Label>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => {
                const selected = e.target.files && e.target.files[0];
                if (!selected) return;

                // Validate MIME type
                const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
                if (!allowedTypes.includes(selected.type)) {
                  setFile(null);
                  setImageError("Định dạng ảnh không hợp lệ. Vui lòng chọn file JPG hoặc PNG.");
                  toast.error("Định dạng ảnh không hợp lệ. Vui lòng chọn file JPG hoặc PNG.");
                  return;
                }

                // Validate size (5MB)
                const maxSize = 5 * 1024 * 1024;
                if (selected.size > maxSize) {
                  setFile(null);
                  setImageError("Kích thước ảnh vượt quá 5MB.");
                  toast.error("Kích thước ảnh vượt quá 5MB.");
                  return;
                }

                // OK
                setImageError("");
                setFile(selected);
              }}
            />
            {imageError && <p className="text-sm text-red-600">{imageError}</p>}
          </div>

          <div className="flex items-center justify-between">
            <Button
              onClick={handleAddVehicle}
              className="flex gap-2 items-center"
              disabled={vehicles.length >= MAX_VEHICLES}
            >
              <Plus className="w-4 h-4" /> Thêm phương tiện
            </Button>
          </div>
        </section>

        {/* Vehicle Cards */}
        <section className="grid md:grid-cols-2 gap-6">
          {vehicles.map((v) => {
            const vehicleUrl = `http://localhost:3000/vehicle/${v._id}`;
            return (
              <div
                key={v._id}
                className="bg-white rounded-lg shadow-md border p-5 flex flex-col gap-2"
              >
                <div className="flex gap-4 items-start">
                  {v.imageVehicle ? (
                    <img
                      src={v.imageVehicle}
                      alt="Vehicle"
                      className="w-28 h-20 object-cover rounded-md"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-28 h-20 bg-gray-100 flex items-center justify-center rounded-md text-gray-400">
                      <Car className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{v.licensePlate}</p>
                    <p className="text-sm text-gray-500">Sức chứa: {v.capacity} chỗ</p>
                    <div className="mt-2">
                      <QRCode value={vehicleUrl} size={80} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <Button variant="outline" onClick={() => setEditing(v)} className="flex gap-1 items-center">
                    <Pencil className="w-4 h-4" /> Sửa
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(v._id)} className="flex gap-1 items-center">
                    <Trash2 className="w-4 h-4" /> Xóa
                  </Button>
                </div>
              </div>
            );
          })}
          {vehicles.length === 0 && (
            <p className="text-center text-gray-500 text-sm col-span-full">
              Bạn chưa có phương tiện nào đăng ký.
            </p>
          )}
        </section>

        {editing && <EditVehicleForm vehicle={editing} onClose={() => setEditing(null)} onSave={handleUpdate} />}
      </main>
      <Footer />
    </>
  );
}

export default function AddVehiclePage() {
  return (
    <ToastProvider>
      <AddVehicleContent />
    </ToastProvider>
  );
}
