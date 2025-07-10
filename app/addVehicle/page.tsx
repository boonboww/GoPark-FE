'use client';

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import { Car, Trash2, Pencil, Lock, Plus, AlertTriangle, Loader2 } from "lucide-react";

export interface Vehicle {
  _id?: string;
  licensePlate: string;
  capacity: number;
  imageVehicle: string;
}

export default function AddVehiclePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [registeredVehicles, setRegisteredVehicles] = useState<Vehicle[]>([]);
  const isMax = registeredVehicles.length >= 3;

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { licensePlate: "", capacity: 0, imageVehicle: "" },
  ]);
  const [vehicleCount, setVehicleCount] = useState(1);
  const [error, setError] = useState("");
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<number, string[]>>({});

  // Fetch user data and vehicles on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id);
        fetchMyVehicles(decoded.id);
      } catch (error) {
        console.error("Invalid token", error);
        setError("Session expired. Please login again.");
      }
    }
  }, []);

  const fetchMyVehicles = async (userId: string) => {
    setIsFetching(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/v1/vehicles/my-vehicles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRegisteredVehicles(data);
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
      setError(error.message || "Failed to fetch vehicles. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  // Các hàm xử lý khác giữ nguyên như trước...
  const handleVehicleCountChange = (value: number) => {
    setVehicleCount(value);
    let updated = [...vehicles];
    if (value > updated.length) {
      for (let i = updated.length; i < value; i++) {
        updated.push({ licensePlate: "", capacity: 0, imageVehicle: "" });
      }
    } else {
      updated = updated.slice(0, value);
    }
    setVehicles(updated);
    setError("");
    setFormErrors({});
  };

  const handleChange = (
    index: number,
    field: keyof Vehicle,
    value: string | number
  ) => {
    const newVehicles = [...vehicles];
    newVehicles[index] = {
      ...newVehicles[index],
      [field]: field === "capacity" ? Number(value) : value,
    };
    setVehicles(newVehicles);
    
    if (formErrors[index]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  const validateVehicle = (vehicle: Vehicle, index: number) => {
    const errors: string[] = [];
    
    if (!vehicle.licensePlate.trim()) {
      errors.push("License plate is required");
    } else if (!/^[A-Za-z0-9-]+$/.test(vehicle.licensePlate)) {
      errors.push("Invalid license plate format");
    }
    
    if (!vehicle.capacity || vehicle.capacity < 1) {
      errors.push("Capacity must be at least 1");
    }
    
    if (vehicle.imageVehicle && !/^https?:\/\/.+\..+/.test(vehicle.imageVehicle)) {
      errors.push("Invalid image URL format");
    }
    
    if (errors.length > 0) {
      setFormErrors(prev => ({ ...prev, [index]: errors }));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (isMax) return;
    if (!userId) {
      setError("❌ Please login first");
      return;
    }

    let isValid = true;
    vehicles.forEach((v, i) => {
      if (!validateVehicle(v, i)) isValid = false;
    });
    
    if (!isValid) {
      setError("❌ Please fix all validation errors");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const results = await Promise.all(
        vehicles.map(vehicle => 
          fetch(`${apiUrl}/api/v1/vehicles`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              licensePlate: vehicle.licensePlate,
              capacity: Number(vehicle.capacity),
              imageVehicle: vehicle.imageVehicle,
            }),
          })
        )
      );

      const allSuccess = results.every(r => r.ok);
      if (!allSuccess) {
        const errors = await Promise.all(
          results.map(r => r.json().catch(() => ({})))
        );
        throw new Error(errors.map(e => e.message || "Unknown error").join(", "));
      }

      await fetchMyVehicles(userId);
      
      setVehicles([{ licensePlate: "", capacity: 0, imageVehicle: "" }]);
      setVehicleCount(1);
      setError("");
      alert("✅ Vehicles added successfully!");
    } catch (err) {
      setError(`❌ Failed to add vehicles: ${err.message}`);
      console.error("Add vehicles error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure to delete this vehicle?")) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/v1/vehicles/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setRegisteredVehicles(registeredVehicles.filter((v) => v._id !== id));
      } catch (error) {
        console.error("Delete error:", error);
        alert(`Failed to delete vehicle: ${error.message}`);
      }
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Please login to access this page</h1>
        <Button onClick={() => window.location.href = "/login"}>Go to Login</Button>
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen mt-20 flex flex-col items-center px-4 py-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-6">
          Add Your Vehicles
        </h1>

        {isMax && (
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <Lock className="w-4 h-4" /> You can register up to 3 vehicles only.
          </div>
        )}

        {!isMax && (
          <>
            <div className="w-full max-w-md mb-8">
              <Label>Select number of vehicles</Label>
              <select
                value={vehicleCount}
                onChange={(e) => handleVehicleCountChange(Number(e.target.value))}
                className="w-full border px-3 py-2 rounded-md"
                disabled={isLoading}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>

            <div className="w-full flex flex-col gap-6 max-w-4xl">
              {vehicles.map((v, index) => (
                <div
                  key={index}
                  className="w-full border mb-3 rounded-lg shadow-sm p-6 bg-white"
                >
                  <Label>License Plate *</Label>
                  <Input
                    className="mb-2"
                    value={v.licensePlate}
                    onChange={(e) =>
                      handleChange(index, "licensePlate", e.target.value)
                    }
                    placeholder="e.g., 43A-12345"
                    disabled={isLoading}
                    required
                  />
                  
                  <Label>Capacity *</Label>
                  <Input
                    className="mb-2"
                    type="number"
                    value={v.capacity || ""}
                    onChange={(e) =>
                      handleChange(index, "capacity", e.target.value)
                    }
                    placeholder="e.g., 4"
                    min="1"
                    disabled={isLoading}
                    required
                  />
                  
                  <Label>Image URL (Optional)</Label>
                  <Input
                    className="mb-2"
                    value={v.imageVehicle}
                    onChange={(e) =>
                      handleChange(index, "imageVehicle", e.target.value)
                    }
                    placeholder="e.g., https://example.com/image.jpg"
                    disabled={isLoading}
                  />
                  
                  {formErrors[index]?.map((err, i) => (
                    <p key={i} className="text-red-500 text-sm mt-1">
                      • {err}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {error && (
              <div className="flex gap-2 items-center text-red-600 mt-4">
                <AlertTriangle className="w-4 h-4" /> {error}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              className="mt-8 flex items-center gap-2 cursor-pointer bg-black text-white"
              disabled={isLoading || isMax}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Save Vehicles <Plus className="w-4 h-4" />
                </>
              )}
            </Button>
          </>
        )}

        <div className="mt-16 w-full max-w-4xl">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            Your Registered Vehicles
          </h2>
          
          {isFetching ? (
            <div className="flex justify-center my-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : registeredVehicles.length === 0 ? (
            <p className="text-gray-500">No vehicles registered yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {registeredVehicles.map((v) => {
                const vehicleUrl = `${window.location.origin}/vehicle/${v._id}`;
                return (
                  <div
                    key={v._id}
                    className="border rounded-lg shadow-sm p-6 bg-white flex flex-col gap-2"
                  >
                    <h3 className="flex gap-2 items-center font-semibold">
                      <Car className="w-4 h-4" /> {v.licensePlate}
                    </h3>
                    <p>
                      <strong>Capacity:</strong> {v.capacity}
                    </p>

                    {v.imageVehicle && (
                      <img
                        src={v.imageVehicle}
                        alt="Vehicle"
                        className="mt-2 h-24 object-contain"
                      />
                    )}
                    <QRCode value={vehicleUrl} size={100} className="mt-2" />
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setEditingVehicle(v)}
                        className="flex gap-1 cursor-pointer items-center"
                        disabled={isLoading}
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => v._id && handleDelete(v._id)}
                        className="flex cursor-pointer gap-1 items-center"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {editingVehicle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-md">
              <h2 className="text-lg font-bold mb-4">Edit Vehicle</h2>

              <div className="mb-4">
                <Label>License Plate *</Label>
                <Input
                  value={editingVehicle.licensePlate}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      licensePlate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <Label>Capacity *</Label>
                <Input
                  type="number"
                  value={editingVehicle.capacity}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      capacity: Number(e.target.value),
                    })
                  }
                  min="1"
                  required
                />
              </div>

              <div className="mb-4">
                <Label>Image URL</Label>
                <Input
                  value={editingVehicle.imageVehicle}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      imageVehicle: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingVehicle(null)}
                  className="flex gap-1 cursor-pointer items-center"
                >
                  <X className="w-4 h-4" /> Cancel
                </Button>

                <Button
                  onClick={async () => {
                    try {
                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                      const response = await fetch(
                        `${apiUrl}/api/v1/vehicles/${editingVehicle._id}`,
                        {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                          body: JSON.stringify({
                            licensePlate: editingVehicle.licensePlate,
                            capacity: editingVehicle.capacity,
                            imageVehicle: editingVehicle.imageVehicle,
                          }),
                        }
                      );

                      if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                      }

                      await fetchMyVehicles(userId!);
                      setEditingVehicle(null);
                      alert("✅ Updated successfully!");
                    } catch (error) {
                      console.error("Update error:", error);
                      alert(`Failed to update vehicle: ${error.message}`);
                    }
                  }}
                  className="flex gap-1 cursor-pointer items-center"
                >
                  <Save className="w-4 h-4" /> Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}