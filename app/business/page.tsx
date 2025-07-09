"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PolicyForm } from "./PolicyForm";
import {
  Building2,
  MapPin,
  ParkingSquare,
  Phone,
  User2,
  Mail,
  Send,
  ShieldCheck,
  Upload,
  AlertTriangle,
} from "lucide-react";

export default function BusinessPage() {
  const [formData, setFormData] = useState({
    ownerName: "",
    ownerEmail: "",
    carParkName: "",
    address: "",
    slots: "",
    slotSize: "",
    zones: 1,
    zoneValues: [] as string[],
    phone: "",
    acceptPolicy: false,
    images: [] as File[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPolicy, setShowPolicy] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const name = target.name;
    const value = target.value;
    const files = (target as HTMLInputElement).files;

    if (files && files.length > 0) {
      setFormData({ ...formData, images: Array.from(files) });
    } else if (name === "zones") {
      const zones = parseInt(value) || 0;
      const zoneValues = Array(zones).fill("");
      setFormData({ ...formData, zones, zoneValues });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (typeof value === "string" && value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleZoneInputChange = (index: number, value: string) => {
    const newZoneValues = [...formData.zoneValues];
    newZoneValues[index] = value;
    setFormData({ ...formData, zoneValues: newZoneValues });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, acceptPolicy: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!formData.ownerName) newErrors.ownerName = "Required";

    if (!formData.ownerEmail) {
      newErrors.ownerEmail = "Required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.ownerEmail)) {
        newErrors.ownerEmail = "Invalid email format";
      }
    }

    if (!formData.carParkName) newErrors.carParkName = "Required";
    if (!formData.address) newErrors.address = "Required";
    if (!formData.slots) newErrors.slots = "Required";
    if (!formData.phone) newErrors.phone = "Required";

    if (!formData.acceptPolicy) {
      alert("❌ You must accept the policy!");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    console.log(formData);
    alert("✅ Registration submitted!");
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
          Register Your Parking Lot
        </h1>

        <div className="w-full max-w-screen-xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Owner Information */}
          <div className="bg-white border rounded-xl shadow-sm p-6 space-y-4 min-w-0 flex flex-col">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User2 className="w-5 h-5" /> Owner Information
            </h2>

            <div>
              <Label htmlFor="ownerName" className="flex items-center gap-2">
                <User2 className="w-4 h-4" /> Full Name{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="e.g., John Doe"
                className={`mt-1 ${
                  errors.ownerName ? "border-yellow-500" : ""
                }`}
              />
              {renderInputError("ownerName")}
            </div>

            <div>
              <Label htmlFor="ownerEmail" className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ownerEmail"
                name="ownerEmail"
                type="email"
                value={formData.ownerEmail}
                onChange={handleChange}
                placeholder="e.g., john@example.com"
                className={`mt-1 ${
                  errors.ownerEmail ? "border-yellow-500" : ""
                }`}
              />
              {renderInputError("ownerEmail")}
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> Contact Phone{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., +84 123 456 789"
                className={`mt-1 ${
                  errors.phone ? "border-yellow-500" : ""
                }`}
              />
              {renderInputError("phone")}
            </div>
          </div>

          {/* Parking Lot Information */}
          <div className="bg-white border rounded-xl shadow-sm p-6 space-y-4 min-w-0 flex flex-col">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5" /> Parking Lot Information
            </h2>

            <div>
              <Label htmlFor="carParkName" className="flex items-center gap-2">
                <ParkingSquare className="w-4 h-4" /> Parking Lot Name{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="carParkName"
                name="carParkName"
                value={formData.carParkName}
                onChange={handleChange}
                placeholder="e.g., Downtown Parking Lot"
                className={`mt-1 ${
                  errors.carParkName ? "border-yellow-500" : ""
                }`}
              />
              {renderInputError("carParkName")}
            </div>

            <div>
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Address{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g., 123 Main Street, City"
                className={`mt-1 ${
                  errors.address ? "border-yellow-500" : ""
                }`}
              />
              {renderInputError("address")}
            </div>

            <div>
              <Label htmlFor="zones" className="flex items-center gap-2">
                <ParkingSquare className="w-4 h-4" /> Number of Zones
              </Label>
              <select
                id="zones"
                name="zones"
                value={formData.zones}
                onChange={handleChange}
                className="mt-1 border rounded px-2 py-2 w-full"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {formData.zoneValues.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.zoneValues.map((zone, index) => (
                  <div key={index}>
                    <Label>Zone {index + 1}</Label>
                    <Input
                      value={zone}
                      onChange={(e) =>
                        handleZoneInputChange(index, e.target.value)
                      }
                      placeholder={`Slots in Zone ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}

            <div>
              <Label className="flex items-center gap-2">
                <ParkingSquare className="w-4 h-4" /> Vehicle Type
              </Label>
              <Input
                value="Car"
                readOnly
                className="mt-1 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <Label htmlFor="images" className="flex items-center gap-2">
                <Upload className="w-4 h-4" /> Upload Images
              </Label>
              <Input
                id="images"
                name="images"
                type="file"
                multiple
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>

          {/* Policies */}
          <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col justify-between min-w-0">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Policies
              </h2>
              <p className="text-sm text-muted-foreground">
                Please read and agree to our parking policy before submitting.
              </p>

              <button
                type="button"
                onClick={() => setShowPolicy(true)}
                className="text-sky-600 underline text-sm hover:text-sky-800"
              >
                Read Policy
              </button>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="acceptPolicy"
                  checked={formData.acceptPolicy}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(!!checked)
                  }
                />
                <Label htmlFor="acceptPolicy" className="text-sm">
                  I agree to the parking policy.
                </Label>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full mt-6 bg-black text-white hover:bg-gray-900"
            >
              Submit Registration <Send className="w-4 h-4 ml-2" />
            </Button>

            <PolicyForm open={showPolicy} onOpenChange={setShowPolicy} />
          </div>
        </div>
      </main>

      <div className="hidden md:block w-full">
        <Footer />
      </div>
    </>
  );
}
