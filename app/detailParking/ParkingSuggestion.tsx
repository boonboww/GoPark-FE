"use client";

import Image from "next/image";
import { MapPin, DollarSign } from "lucide-react";

export default function ParkingSuggestion() {
  const suggestions = [
    {
      id: 1,
      name: "GoPark Lot A",
      address: "456 ABC Street, City",
      price: "$1.2/hr",
      image: "/bg.jpg",
    },
    {
      id: 2,
      name: "City Center Parking",
      address: "789 XYZ Avenue, Downtown",
      price: "$1.5/hr",
      image: "/bg.jpg",
    },
    {
      id: 3,
      name: "Airport Parking",
      address: "123 Airport Road",
      price: "$2.0/hr",
      image: "/bg.jpg",
    },
    {
      id: 4,
      name: "University Parking",
      address: "321 Uni Street",
      price: "$1.0/hr",
      image: "/bg.jpg",
    },
  ];

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Other Parking Suggestions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {suggestions.map((s) => (
          <div
            key={s.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer bg-white"
          >
            <div className="w-full h-40 relative">
              <Image
                src={s.image}
                alt={s.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4 flex flex-col gap-2">
              <h3 className="font-medium text-base">{s.name}</h3>

              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" /> {s.address}
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" /> {s.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
