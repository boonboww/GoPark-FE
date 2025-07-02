"use client";
import CountUp from "react-countup";

export default function MapSection() {
  return (
    <section className="flex flex-col items-center justify-center py-16 text-center min-h-[70vh]">
     
      <div className="w-full max-w-xl px-4">
        <img
          src="https://en.parkopedia.co.uk/public/images/map-with-markers.png"
          alt="Vietnam Map"
          className="w-full h-auto rounded-xl opacity-90"
        />
      </div>

      {/* Số liệu thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 px-6 w-full max-w-4xl">
        {/* Provinces */}
        <div className="flex flex-col items-center">
          <div className="bg-sky-400 text-white text-3xl font-bold px-5 py-2 rounded-lg shadow">
            <CountUp end={34} duration={1.5} />
          </div>
          <div className="text-gray-600 mt-1">Provinces</div>
        </div>

        {/* Cities */}
        <div className="flex flex-col items-center">
          <div className="bg-sky-400 text-white text-3xl font-bold px-5 py-2 rounded-lg shadow">
            <CountUp end={1200} duration={2} separator="," />
          </div>
          <div className="text-gray-600 mt-1">Cities</div>
        </div>

        {/* Parking Spots */}
        <div className="flex flex-col items-center">
          <div className="bg-sky-400 text-white text-3xl font-bold px-5 py-2 rounded-lg min-w-[140px] shadow">
            <CountUp start={50000} end={50200} duration={5} separator="," />
          </div>
          <div className="text-gray-600 mt-1">Parking Spots</div>
        </div>
      </div>
    </section>
  );
}
