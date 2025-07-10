"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import {
  Car,
  Trash2,
  Pencil,
  Lock,
  Plus,
  AlertTriangle,
} from "lucide-react";

import EditVehicleForm from "./EditVehicleForm";
import { Vehicle } from "./types";

export default function AddVehiclePage() {
  const [registeredVehicles, setRegisteredVehicles] = useState<Vehicle[]>([
    {
      id: 101,
      type: "Car",
      plate: "43A-12345",
      document: "123456789",
    },
  ]);
  const isMax = registeredVehicles.length >= 3;

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 1, type: "", plate: "", document: "" },
  ]);
  const [vehicleCount, setVehicleCount] = useState(1);
  const [error, setError] = useState("");
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const handleVehicleCountChange = (value: number) => {
    setVehicleCount(value);
    let updated = [...vehicles];
    if (value > updated.length) {
      for (let i = updated.length + 1; i <= value; i++) {
        updated.push({ id: i, type: "", plate: "", document: "" });
      }
    } else {
      updated = updated.slice(0, value);
    }
    setVehicles(updated);
    setError("");
  };

  const handleChange = (id: number, field: keyof Vehicle, value: string) => {
    setVehicles(
      vehicles.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = () => {
    if (isMax) return;

    const hasEmpty = vehicles.some(
      (v) => !v.type || !v.plate || !v.document
    );
    if (hasEmpty) {
      setError("❌ Please fill all fields.");
      return;
    }

    const newVehicles = vehicles.map((v) => ({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: v.type,
      plate: v.plate,
      document: v.document,
    }));

    setRegisteredVehicles([...registeredVehicles, ...newVehicles]);
    setVehicles([{ id: 1, type: "", plate: "", document: "" }]);
    setVehicleCount(1);
    setError("");
    alert("✅ Vehicles added successfully!");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure to delete this vehicle?")) {
      setRegisteredVehicles(registeredVehicles.filter((v) => v.id !== id));
    }
  };

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
                onChange={(e) =>
                  handleVehicleCountChange(Number(e.target.value))
                }
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>

            <div className="w-full flex flex-col gap-6 max-w-4xl">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="w-full border mb-3 rounded-lg shadow-sm p-6 bg-white"
                >
                  <Label>Type</Label>
                  <Input
                  className="mb-2"
                    value={v.type}
                    onChange={(e) =>
                      handleChange(v.id, "type", e.target.value)
                    }
                    placeholder="e.g., Car"
                  />
                  <Label>Plate</Label>
                  <Input
                  className="mb-2"
                    value={v.plate}
                    onChange={(e) =>
                      handleChange(v.id, "plate", e.target.value)
                    }
                    placeholder="e.g., 43A-12345"
                  />
                  <Label>Document</Label>
                  <Input
                  className="mb-2"
                    value={v.document}
                    onChange={(e) =>
                      handleChange(v.id, "document", e.target.value)
                    }
                    placeholder="e.g., Registration No."
                  />
                </div>
              ))}
            </div>

            {error && (
              <div className="flex gap-2 items-center text-yellow-600 mt-4">
                <AlertTriangle className="w-4 h-4" /> {error}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              className="mt-8 flex items-center gap-2 cursor-pointer bg-black text-white"
            >
              Save Vehicles <Plus className="w-4 h-4" />
            </Button>
          </>
        )}

        <div className="mt-16 w-full max-w-4xl">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            Registered Vehicles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registeredVehicles.map((v) => {
              const vehicleUrl = `http://localhost:3000/vehicle/${v.id}`;
              return (
                <div
                  key={v.id}
                  className="border rounded-lg shadow-sm p-6 bg-white flex flex-col gap-2"
                >
                  <h3 className="flex gap-2 items-center font-semibold">
                    <Car className="w-4 h-4" /> {v.type}
                  </h3>
                  <p>
                    <strong>Plate:</strong> {v.plate}
                  </p>
                  <p>
                    <strong>Document:</strong> {v.document}
                  </p>
                  <QRCode value={vehicleUrl} size={100} className="mt-2" />
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setEditingVehicle(v)}
                      className="flex gap-1 cursor-pointer items-center"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(v.id)}
                      className="flex cursor-pointer gap-1 items-center"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {editingVehicle && (
          <EditVehicleForm
            vehicle={editingVehicle}
            onClose={() => setEditingVehicle(null)}
            onSave={(updated) => {
              setRegisteredVehicles((prev) =>
                prev.map((v) => (v.id === updated.id ? updated : v))
              );
              setEditingVehicle(null);
              alert("✅ Updated successfully!");
            }}
          />
        )}
      </main>

      <Footer />
    </>
  );
}
