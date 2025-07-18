"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { ParkingLot } from "@/app/owner/types";

interface Props {
  parkingLots: ParkingLot[];
  selectedLotId: string;
  onSelect: (id: string) => void;
}

export default function SelectParkingLotDropdown({ parkingLots, selectedLotId, onSelect }: Props) {
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium">Chọn bãi đậu xe</Label>
      <Select
        value={selectedLotId}
        onValueChange={onSelect}
        disabled={parkingLots.length === 0}
      >
        <SelectTrigger className="w-full rounded-md" aria-label="Chọn bãi đỗ xe">
          <SelectValue placeholder="Chọn bãi đậu xe" />
        </SelectTrigger>
        <SelectContent className="rounded-md">
          {parkingLots.map((lot) => (
            <SelectItem
              key={lot._id}
              value={lot._id}
              className="text-sm"
            >
              {lot.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}