"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, DollarSign } from "lucide-react";

type Suggestion = {
  id: string;
  name: string;
  address: string;
  price: string;
  image: string;
};

export default function ParkingSuggestion() {
  const suggestions: Suggestion[] = [
    {
      id: "1",
      name: "Bãi đỗ GoPark A",
      address: "456 Đường ABC, Đà Nẵng",
      price: "30.000 VNĐ/giờ",
      image: "/bg.jpg",
    },
    {
      id: "2",
      name: "Bãi đỗ Trung tâm Thành phố",
      address: "789 Đại lộ XYZ, Trung tâm",
      price: "35.000 VNĐ/giờ",
      image: "/bg.jpg",
    },
    {
      id: "3",
      name: "Bãi đỗ Sân bay",
      address: "123 Đường Sân bay",
      price: "50.000 VNĐ/giờ",
      image: "/bg.jpg",
    },
    {
      id: "4",
      name: "Bãi đỗ Đại học",
      address: "321 Đường Đại học",
      price: "25.000 VNĐ/giờ",
      image: "/bg.jpg",
    },
  ];

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Các bãi đỗ khác</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {suggestions.map((s) => (
          <Link href={`/detailParking/${s.id}`} key={s.id}>
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer bg-white">
              <div className="w-full h-40 relative">
                <Image
                  src={s.image}
                  alt={s.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority // Thêm priority cho LCP
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
          </Link>
        ))}
      </div>
    </section>
  );
}