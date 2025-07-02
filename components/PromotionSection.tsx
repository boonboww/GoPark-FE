"use client";

export default function PromotionSection() {
  return (
    <section className="flex flex-col items-center justify-center py-20 text-center  min-h-[70vh]">
      {/* Tooltip */}
      <div className="relative mb-8">
        <div className="bg-sky-400 text-white px-6 py-3 rounded-xl text-base font-medium shadow-md">
          Are you a parking operator? Would you like <br />
          to promote your car parks and reach new customers?
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-sky-400" />
      </div>

      {/* Satellite image */}
      <img
        src="https://en.parkopedia.co.uk/public/images/satellite.png"
        alt="Satellite"
        className="w-40 h-auto mb-8"
      />

      {/* Join us button */}
      <button className="bg-sky-400 text-white px-8 py-3 rounded-md text-lg font-medium shadow hover:bg-sky-500 transition transform hover:scale-105 transition-transform duration-300">
        Join us
      </button>
    </section>
  );
}
