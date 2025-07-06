"use client";

import Link from "next/link";
import {
  FaCar,
  FaSearch,
  FaMoneyCheckAlt,
  FaPlusCircle,
  FaRegSmile,
} from "react-icons/fa";

export default function HowItWorksSection() {
  return (
    <section className="py-20 px-6 text-center bg-white">
      <h2 className="text-4xl sm:text-5xl font-bold text-sky-600 mb-4">
        How It Works
      </h2>
      <p className="text-gray-600 max-w-3xl mx-auto mb-12">
        Whether you looking for a place to park or you want to promote your parking space, we make it simple.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* For Drivers */}
        <div className="border border-sky-100 rounded-2xl p-8 shadow hover:shadow-md transition">
          <h3 className="text-2xl font-semibold mb-6 text-sky-500">
            For Drivers
          </h3>
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center gap-4">
              <FaSearch className="text-3xl text-sky-500" />
              <span className="text-gray-700 text-lg">
                Search for nearby parking spots.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaCar className="text-3xl text-sky-500" />
              <span className="text-gray-700 text-lg">
                Reserve your space online.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaRegSmile className="text-3xl text-sky-500" />
              <span className="text-gray-700 text-lg">
                Park easily & stress-free.
              </span>
            </div>
          </div>
          <Link
            href="#map"
            className="inline-block bg-sky-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-600 transition"
          >
            Find Parking
          </Link>
        </div>

        {/* For Parking Owners */}
        <div className="border border-sky-100 rounded-2xl p-8 shadow hover:shadow-md transition">
          <h3 className="text-2xl font-semibold mb-6 text-sky-500">
            For Parking Owners
          </h3>
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center gap-4">
              <FaPlusCircle className="text-3xl text-sky-500" />
              <span className="text-gray-700 text-lg">
                Register your parking spots.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaMoneyCheckAlt className="text-3xl text-sky-500" />
              <span className="text-gray-700 text-lg">
                Manage bookings & income easily.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaRegSmile className="text-3xl text-sky-500" />
              <span className="text-gray-700 text-lg">
                Attract more customers every day.
              </span>
            </div>
          </div>
          <Link
            href="#promotion"
            className="inline-block bg-sky-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-600 transition"
          >
            Join Now
          </Link>
        </div>
      </div>
    </section>
  );
}
