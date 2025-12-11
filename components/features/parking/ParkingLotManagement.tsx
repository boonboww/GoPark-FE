// ✅ Full ParkingLotManagement with updated UI split into subcomponents
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ParkingLot } from "@/app/owner/types";
import { fetchMyParkingLots, deleteParkingLot } from "@/lib/parkingLot.api";
import AddParkingLotDialog from "@/components/features/parking/AddParkingLotDialog";
import EditParkingLotDialog from "@/components/features/parking/EditParkingLotDialog";
import SelectParkingLotDropdown from "@/app/owner/tickets/SelectParkingLotDropdown";

export default function ParkingLotManagement() {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [selectedLotId, setSelectedLotId] = useState<string>("");
  const [newLotDialogOpen, setNewLotDialogOpen] = useState(false);
  const [editLotDialogOpen, setEditLotDialogOpen] = useState(false);

  const selectedLot = parkingLots.find((lot) => lot._id === selectedLotId);

  const loadParkingLots = async () => {
    const res = await fetchMyParkingLots();
    setParkingLots(res.data.data);
    if (res.data.data.length > 0) {
      setSelectedLotId(res.data.data[0]._id);
    }
  };

  useEffect(() => {
    loadParkingLots();
  }, []);

  const handleDeleteParkingLot = async (id: string) => {
    await deleteParkingLot(id);
    await loadParkingLots();
    setEditLotDialogOpen(false);
  };

  return (
    <Card className="shadow-xl rounded-2xl p-4 bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Quản Lý Bãi Đậu Xe</CardTitle>
        <CardDescription className="text-gray-500">
          Thêm, sửa và quản lý các bãi đậu xe của bạn
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <AddParkingLotDialog
            open={newLotDialogOpen}
            onOpenChange={setNewLotDialogOpen}
            onCreated={loadParkingLots}
          />

          <SelectParkingLotDropdown
            parkingLots={parkingLots}
            selectedLotId={selectedLotId}
            onSelect={setSelectedLotId}
          />

          <EditParkingLotDialog
            open={editLotDialogOpen}
            onOpenChange={setEditLotDialogOpen}
            selectedLot={selectedLot}
            onUpdate={loadParkingLots}
            onDelete={handleDeleteParkingLot}
            setParkingLots={setParkingLots}
          />
        </div>
      </CardContent>
    </Card>
  );
}
