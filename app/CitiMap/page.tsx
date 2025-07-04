"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowLeft, X, Menu } from "lucide-react";

interface Parking {
  name: string;
  coords: [number, number];
  slots: number;
  available: boolean;
  address: string;
  price: number;
  image: string;
}

interface City {
  name: string;
  center: [number, number];
  zoom: number;
  parkings: Parking[];
}

const cities: City[] = [
  {
    name: "Đà Nẵng",
    center: [16.0544, 108.2022],
    zoom: 13,
    parkings: [
      {
        name: "Bãi đỗ xe GWOUTH",
        coords: [15.853837, 108.201831],
        slots: 50,
        available: true,
        address: "123 Đường Nguyễn Tất Thành, Đà Nẵng",
        price: 15000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Sân bay Đà Nẵng",
        coords: [16.0524, 108.2022],
        slots: 120,
        available: false,
        address: "Sân bay Quốc tế Đà Nẵng",
        price: 20000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Trần Phú",
        coords: [16.0641, 108.2172],
        slots: 80,
        available: true,
        address: "45 Trần Phú, Hải Châu, Đà Nẵng",
        price: 12000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Chợ Hàn",
        coords: [16.0697, 108.2228],
        slots: 60,
        available: true,
        address: "Chợ Hàn, Hải Châu, Đà Nẵng",
        price: 10000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Nguyễn Văn Linh",
        coords: [16.0549, 108.2137],
        slots: 70,
        available: false,
        address: "Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
        price: 14000,
        image: "/b1.jpg",
      },
    ],
  },
  {
    name: "Hồ Chí Minh",
    center: [10.7769, 106.7009],
    zoom: 13,
    parkings: [
      {
        name: "Bãi đỗ xe Quận 1",
        coords: [10.7745, 106.6990],
        slots: 100,
        available: true,
        address: "123 Bến Thành, Quận 1, TP.HCM",
        price: 20000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Nguyễn Huệ",
        coords: [10.7778, 106.7032],
        slots: 80,
        available: true,
        address: "Nguyễn Huệ, Quận 1, TP.HCM",
        price: 18000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Tân Bình",
        coords: [10.7965, 106.6680],
        slots: 150,
        available: false,
        address: "Sân bay Tân Sơn Nhất, Tân Bình, TP.HCM",
        price: 25000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Quận 7",
        coords: [10.7296, 106.7014],
        slots: 90,
        available: true,
        address: "Crescent Mall, Quận 7, TP.HCM",
        price: 17000,
        image: "/b1.jpg",
      },
    ],
  },
  {
    name: "Hà Nội",
    center: [21.0285, 105.8542],
    zoom: 13,
    parkings: [
      {
        name: "Bãi đỗ xe Hoàn Kiếm",
        coords: [21.0313, 105.8516],
        slots: 70,
        available: true,
        address: "Hồ Hoàn Kiếm, Quận Hoàn Kiếm, Hà Nội",
        price: 15000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Ba Đình",
        coords: [21.0350, 105.8340],
        slots: 60,
        available: false,
        address: "Quảng trường Ba Đình, Hà Nội",
        price: 14000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Cầu Giấy",
        coords: [21.0137, 105.7995],
        slots: 100,
        available: true,
        address: "Trần Duy Hưng, Cầu Giấy, Hà Nội",
        price: 16000,
        image: "/b1.jpg",
      },
    ],
  },
  {
    name: "Biên Hòa",
    center: [10.9574, 106.8427],
    zoom: 13,
    parkings: [
      {
        name: "Bãi đỗ xe Biên Hòa",
        coords: [10.9550, 106.8400],
        slots: 50,
        available: true,
        address: "123 Cách Mạng Tháng Tám, Biên Hòa",
        price: 12000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Tân Hiệp",
        coords: [10.9500, 106.8500],
        slots: 40,
        available: true,
        address: "Tân Hiệp, Biên Hòa, Đồng Nai",
        price: 10000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Chợ Biên Hòa",
        coords: [10.9600, 106.8450],
        slots: 60,
        available: false,
        address: "Chợ Biên Hòa, Đồng Nai",
        price: 11000,
        image: "/b1.jpg",
      },
    ],
  },
  {
    name: "Nha Trang",
    center: [12.2388, 109.1967],
    zoom: 13,
    parkings: [
      {
        name: "Bãi đỗ xe Vinpearl",
        coords: [12.2350, 109.1950],
        slots: 80,
        available: true,
        address: "Vinpearl Nha Trang, Khánh Hòa",
        price: 13000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Trần Phú",
        coords: [12.2400, 109.1980],
        slots: 70,
        available: true,
        address: "Trần Phú, Nha Trang, Khánh Hòa",
        price: 12000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Chợ Đêm",
        coords: [12.2370, 109.1970],
        slots: 50,
        available: false,
        address: "Chợ Đêm Nha Trang, Khánh Hòa",
        price: 11000,
        image: "/b1.jpg",
      },
    ],
  },
  {
    name: "Huế",
    center: [16.4667, 107.5790],
    zoom: 13,
    parkings: [
      {
        name: "Bãi đỗ xe Kinh Thành",
        coords: [16.4700, 107.5770],
        slots: 60,
        available: true,
        address: "Kinh Thành Huế, Thừa Thiên Huế",
        price: 10000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Chợ Đông Ba",
        coords: [16.4650, 107.5800],
        slots: 50,
        available: true,
        address: "Chợ Đông Ba, Huế",
        price: 9000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Trường Tiền",
        coords: [16.4680, 107.5820],
        slots: 40,
        available: false,
        address: "Cầu Trường Tiền, Huế",
        price: 9500,
        image: "/b1.jpg",
      },
    ],
  },
  {
    name: "Cần Thơ",
    center: [10.0452, 105.7469],
    zoom: 13,
    parkings: [
      {
        name: "Bãi đỗ xe Ninh Kiều",
        coords: [10.0470, 105.7480],
        slots: 70,
        available: true,
        address: "Bến Ninh Kiều, Cần Thơ",
        price: 11000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Chợ Cái Răng",
        coords: [10.0400, 105.7500],
        slots: 50,
        available: true,
        address: "Chợ Nổi Cái Răng, Cần Thơ",
        price: 10000,
        image: "/b1.jpg",
      },
      {
        name: "Bãi đỗ xe Vincom",
        coords: [10.0460, 105.7470],
        slots: 80,
        available: false,
        address: "Vincom Plaza, Cần Thơ",
        price: 12000,
        image: "/b1.jpg",
      },
    ],
  },
];

export default function CitiMap() {
  const searchParams = useSearchParams();
  const city = searchParams.get("city")?.toLowerCase() || "";
  const arriving = searchParams.get("arriving") ? new Date(searchParams.get("arriving")!) : null;
  const leaving = searchParams.get("leaving") ? new Date(searchParams.get("leaving")!) : null;

  const [map, setMap] = useState<L.Map | null>(null);
  const [parkingMarkers, setParkingMarkers] = useState<L.Marker[]>([]);
  const [userMarker, setUserMarker] = useState<L.Marker | null>(null);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const [filteredParkings, setFilteredParkings] = useState<Parking[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Define custom icon for parking markers
  const parkingIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  useEffect(() => {
    const selectedCity = cities.find(
      (c) => c.name.toLowerCase() === city || c.name.toLowerCase().replace(" ", "") === city
    );

    if (!selectedCity) {
      alert("Thành phố không được hỗ trợ. Hiển thị bãi đỗ ở Đà Nẵng.");
      const defaultCity = cities.find((c) => c.name === "Đà Nẵng")!;
      setFilteredParkings(defaultCity.parkings);
      const initMap = L.map("map", {
        zoomControl: true,
      }).setView(defaultCity.center, defaultCity.zoom);
      // Move zoom control to topright
      initMap.zoomControl.setPosition("topright");
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(initMap);
      setMap(initMap);
      showParkings(defaultCity.parkings, initMap);
      return;
    }

    setFilteredParkings(selectedCity.parkings);
    const initMap = L.map("map", {
      zoomControl: true,
    }).setView(selectedCity.center, selectedCity.zoom);
    // Move zoom control to topright
    initMap.zoomControl.setPosition("topright");
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(initMap);

    setMap(initMap);
    showParkings(selectedCity.parkings, initMap);

    return () => {
      initMap.remove();
    };
  }, [city]);

  // Resize map when panel visibility changes
  useEffect(() => {
    if (map) {
      // Delay invalidateSize to ensure DOM is updated
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [isPanelOpen, map]);

  const showParkings = (list: Parking[], map: L.Map) => {
    clearMarkers();
    const markers: L.Marker[] = [];
    list.forEach((p) => {
      const status = p.available
        ? '<span class="text-green-600 font-bold">Còn trống</span>'
        : '<span class="text-red-600 font-bold">Hết chỗ</span>';
      const popupContent = `
        <div class="text-sm">
          <img src="${p.image}" alt="${p.name}" class="w-full mb-2 rounded-md">
          <strong>${p.name}</strong><br>
          Địa chỉ: ${p.address}<br>
          Số chỗ: ${p.slots}<br>
          Giá: ${p.price.toLocaleString()} VNĐ/giờ<br>
          Trạng thái: ${status}<br>
          <button onclick="document.dispatchEvent(new CustomEvent('showParkingDetail', { detail: ${JSON.stringify(p)} }))" class="mt-2 inline-block bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Xem chi tiết</button>
        </div>
      `;
      const marker = L.marker(p.coords, { icon: parkingIcon }).addTo(map).bindPopup(popupContent);
      markers.push(marker);
    });
    setParkingMarkers(markers);
  };

  const clearMarkers = () => {
    parkingMarkers.forEach((m) => map?.removeLayer(m));
    setParkingMarkers([]);
  };

  const findNearbyParkings = async () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị!");
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      setUserCoords([latitude, longitude]);

      if (userMarker) map?.removeLayer(userMarker);
      const newUserMarker = L.marker([latitude, longitude], { icon: parkingIcon })
        .addTo(map!)
        .bindPopup("Vị trí của bạn")
        .openPopup();
      setUserMarker(newUserMarker);
      map?.setView([latitude, longitude], 14);

      const selectedCity = cities.find(
        (c) => c.name.toLowerCase() === city || c.name.toLowerCase().replace(" ", "") === city
      ) || cities.find((c) => c.name === "Đà Nẵng")!;

      const nearby = selectedCity.parkings.filter((p) => {
        const dist = getDistanceFromLatLonInKm(latitude, longitude, p.coords[0], p.coords[1]);
        return dist <= 3;
      });

      if (nearby.length === 0) {
        alert("Không có bãi đỗ nào gần trong bán kính 3km.");
        return;
      }

      setFilteredParkings(nearby);
      clearMarkers();
      showParkings(nearby, map!);
      setSelectedParking(null);
    } catch (err) {
      alert("Không thể lấy vị trí! Vui lòng bật GPS.");
      console.error(err);
    }
  };

  const navigateToParking = (lat: number, lon: number) => {
    if (!userCoords) {
      alert('Vui lòng định vị vị trí trước bằng cách nhấn "Tìm bãi quanh vị trí hiện tại"!');
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userCoords[0]},${userCoords[1]}&destination=${lat},${lon}`;
    window.open(url, "_blank");
  };

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg: number) => deg * (Math.PI / 180);

  useEffect(() => {
    const handleShowParkingDetail = (e: Event) => {
      const customEvent = e as CustomEvent;
      setSelectedParking(customEvent.detail);
    };

    document.addEventListener("showParkingDetail", handleShowParkingDetail);
    return () => {
      document.removeEventListener("showParkingDetail", handleShowParkingDetail);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {isPanelOpen && (
        <div className="fixed top-0 left-0 w-95 h-full z-[1000] bg-white bg-opacity-90 backdrop-blur-sm p-4 border-r border-gray-200 shadow-md overflow-y-auto">
          <button
            onClick={() => setIsPanelOpen(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          {selectedParking ? (
            <div>
              <button
                onClick={() => setSelectedParking(null)}
                className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w inguinal-5 h-5 mr-2" />
                Quay lại danh sách
              </button>
              <div className="border border-gray-200 p-6 rounded-xl shadow-lg bg-white">
                <img
                  src={selectedParking.image}
                  alt={selectedParking.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{selectedParking.name}</h3>
                <div className="space-y-2 text-gray-600">
                  <p className="text-sm">
                    <span className="font-medium">Địa chỉ:</span> {selectedParking.address}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Số chỗ:</span> {selectedParking.slots}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Giá:</span> {selectedParking.price.toLocaleString()} VNĐ/giờ
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Trạng thái:</span>{" "}
                    <span className={selectedParking.available ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                      {selectedParking.available ? "Còn trống" : "Hết chỗ"}
                    </span>
                  </p>
                  {arriving && (
                    <p className="text-sm">
                      <span className="font-medium">Thời gian đến:</span>{" "}
                      {arriving.toLocaleString("vi-VN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                  {leaving && (
                    <p className="text-sm">
                      <span className="font-medium">Thời gian rời:</span>{" "}
                      {leaving.toLocaleString("vi-VN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => navigateToParking(selectedParking.coords[0], selectedParking.coords[1])}
                  className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
                >
                  Đặt chỗ
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Tìm bãi đỗ xe</h2>
              <input
                id="searchInput"
                type="text"
                placeholder="Nhập tên TP (vd: Đà Nẵng)"
                defaultValue={city}
                className="w-full mb-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-80"
              />
              <button
                onClick={() => {
                  const input = (document.getElementById("searchInput") as HTMLInputElement).value
                    .trim()
                    .toLowerCase();
                  const selectedCity = cities.find(
                    (c) => c.name.toLowerCase() === input || c.name.toLowerCase().replace(" ", "") === input
                  );
                  if (!selectedCity) {
                    alert("Thành phố không được hỗ trợ!");
                    return;
                  }
                  setFilteredParkings(selectedCity.parkings);
                  clearMarkers();
                  showParkings(selectedCity.parkings, map!);
                  map?.setView(selectedCity.center, selectedCity.zoom);
                }}
className="w-full mb-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Tìm kiếm TP
              </button>
              <button
                onClick={findNearbyParkings}
                className="w-full p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              >
                Tìm bãi quanh vị trí hiện tại
              </button>
              <div className="mt-4 space-y-4">
                {filteredParkings.map((p) => (
                  <div
                    key={p.name}
                    className="border border-gray-300 p-3 rounded shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedParking(p)}
                  >
                    <img src={p.image} alt={p.name} className="w-full h-24 object-cover mb-2 rounded" />
                    <h3 className="font-semibold text-gray-800">{p.name}</h3>
                    <p className="text-sm text-gray-600">Địa chỉ: {p.address}</p>
                    <p className="text-sm text-gray-600">Số chỗ: {p.slots}</p>
                    <p className="text-sm text-gray-600">Giá: {p.price.toLocaleString()} VNĐ/giờ</p>
                    <p className="text-sm">
                      Trạng thái:{" "}
                      <span className={p.available ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                        {p.available ? "Còn trống" : "Hết chỗ"}
                      </span>
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToParking(p.coords[0], p.coords[1]);
                      }}
                      className="mt-2 w-full bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Đặt
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <div id="map" className="w-full h-screen relative">
        {!isPanelOpen && (
          <button
            onClick={() => setIsPanelOpen(true)}
            className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}