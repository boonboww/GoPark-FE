"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Vehicle } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  Trash2,
  Car,
  AlertTriangle,
  Lock,
} from "lucide-react";
import QRCode from "react-qr-code";
import EditVehicleForm from "./EditVehicleForm";

interface ApiError {
  response?: {
    data?: {
      field?: string;
      message?: string;
    };
  };
}

export default function AddVehiclePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, "_id">>({
    licensePlate: "",
    capacity: 4,
    imageVehicle: "",
  });
  const [message, setMessage] = useState<string>("");
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [imageError, setImageError] = useState<string>("");

  const MAX_VEHICLES = 3;

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      const res = await API.get<{ data: Vehicle[] }>("/api/v1/vehicles/my-vehicles");
      setVehicles(res.data.data || []);
    } catch (error) {
      console.error(error);
      setMessage("Error: Failed to load your vehicles.");
    }
  };

  const handleAddVehicle = async () => {
    if (vehicles.length >= MAX_VEHICLES) {
      setMessage("Error: You can only register up to 3 vehicles.");
      return;
    }

    if (!newVehicle.licensePlate || !newVehicle.capacity) {
      setMessage("Error: Please fill in license plate and capacity.");
      return;
    }

    if (newVehicle.imageVehicle && !isValidUrl(newVehicle.imageVehicle)) {
      setMessage("Error: Invalid image URL.");
      return;
    }

    try {
      await API.post("/api/v1/vehicles", newVehicle);
      setMessage("✅ Vehicle added successfully!");
      setNewVehicle({ licensePlate: "", capacity: 4, imageVehicle: "" });
      setImageError("");
      fetchMyVehicles();
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.data?.field === "licensePlate") {
        setMessage("Error: This license plate is already registered.");
        return;
      }
      console.error(error);
      setMessage("Error: Failed to add vehicle.");
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await API.delete(`/api/v1/vehicles/${id}`);
      fetchMyVehicles();
    } catch (error) {
      console.error(error);
      setMessage("Error: Failed to delete vehicle.");
    }
  };

  const handleUpdate = async (vehicle: Vehicle) => {
    if (!vehicle._id) return;
    try {
      await API.put(`/api/v1/vehicles/${vehicle._id}`, vehicle);
      setEditing(null);
      fetchMyVehicles();
    } catch (error) {
      console.error(error);
      setMessage("Error: Failed to update vehicle.");
    }
  };

  const isValidUrl = (url: string) => {
    try {
      const u = new URL(url);
      return /\.(jpeg|jpg|png|gif|webp)$/i.test(u.pathname);
    } catch {
      return false;
    }
  };

  const handleImageError = () => {
    setImageError("Failed to load image.");
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      <h1 className="text-3xl font-bold text-center text-primary">My Vehicles</h1>

      {/* Add Form */}
      <section className="bg-white p-6 rounded-xl shadow-md space-y-4 border">
        {vehicles.length >= MAX_VEHICLES && (
          <div className="text-red-600 flex gap-2 items-center">
            <Lock className="w-4 h-4" />
            <span>You can only register up to 3 vehicles.</span>
          </div>
        )}

        <div>
          <Label>License Plate</Label>
          <Input
            value={newVehicle.licensePlate}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, licensePlate: e.target.value })
            }
            placeholder="e.g., 43A-12345"
          />
        </div>
        <div>
          <Label>Capacity</Label>
          <Input
            type="number"
            value={newVehicle.capacity}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, capacity: Number(e.target.value) })
            }
            placeholder="e.g., 4"
          />
        </div>
        <div>
          <Label>Image URL (optional)</Label>
          <Input
            value={newVehicle.imageVehicle}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, imageVehicle: e.target.value })
            }
            placeholder="https://example.com/car.jpg"
          />
          {imageError && <p className="text-sm text-red-600">{imageError}</p>}
        </div>

        <div className="flex items-center justify-between">
          <Button
            onClick={handleAddVehicle}
            className="flex gap-2 items-center"
            disabled={vehicles.length >= MAX_VEHICLES}
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </Button>
          {message && (
            <div
              className={`flex gap-2 items-center text-sm ${
                message.startsWith("Error") ? "text-red-600" : "text-green-600"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}
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
                  <p className="text-sm text-gray-500">
                    Capacity: {v.capacity} seat{v.capacity > 1 ? "s" : ""}
                  </p>
                  <div className="mt-2">
                    <QRCode value={vehicleUrl} size={80} />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditing(v)}
                  className="flex gap-1 items-center"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(v._id)}
                  className="flex gap-1 items-center"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </div>
            </div>
          );
        })}
        {vehicles.length === 0 && (
          <p className="text-center text-gray-500 text-sm col-span-full">
            You have no registered vehicles.
          </p>
        )}
      </section>

      {editing && (
        <EditVehicleForm
          vehicle={editing}
          onClose={() => setEditing(null)}
          onSave={handleUpdate}
        />
      )}
    </main>
  );
}
