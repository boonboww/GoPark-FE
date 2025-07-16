"use client";

export default function ParkingMap() {
  return (
    <div className="border rounded-xl overflow-hidden shadow h-64 md:h-96">
      <iframe
        // src="https://go-park-fe.vercel.app/CitiMap?city=Da+Nang&arriving=2025-07-11T06%3A44%3A39.866Z&leaving=2025-07-11T07%3A44%3A39.866Z&isNearby=false"
        // loading="lazy"
        // className="border rounded-xl overflow-hidden shadow h-64 md:h-96"
      />
    </div>
  );
}
