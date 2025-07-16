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
        Cách Hoạt Động
      </h2>
      <p className="text-gray-600 max-w-3xl mx-auto mb-12">
        Dù bạn đang tìm chỗ đậu xe hay muốn quảng bá không gian đậu xe của mình,
        chúng tôi làm mọi thứ trở nên đơn giản.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* For Drivers */}
        <div className="border border-sky-100 rounded-2xl p-8 shadow hover:shadow-md transition">
          <h3 className="text-2xl font-semibold mb-6 text-sky-500">
            Dành Cho Tài Xế
          </h3>
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center gap-4">
              <FaSearch className="text-3xl text-sky-500" />
              <span className="text-gray-700 text-lg">
                Tìm kiếm các chỗ đậu xe gần đó.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaCar className="text-3xl text-sky-500" />
              <span className="text-gray-700 text-lg">
                Đặt chỗ đậu xe trực tuyến.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaRegSmile className="text-3xl text-sky-500" />
              <span className="text-gray-700 text-lg">
                Đậu xe dễ dàng và không căng thẳng.
              </span>
            </div>
          </div>
          <Link
            href="#map"
            className="inline-block bg-sky-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-600 transition"
          >
            Tìm Chỗ Đậu Xe
          </Link>
        </div>

        {/* For Parking Owners */}
        <div className="border border-sky-100 rounded-2xl p-8 shadow hover:shadow-md transition">
          <h3 className="text-2xl font-semibold mb-6 text-sky-500">
            Dành Cho Chủ Bãi Đậu Xe
          </h3>
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center gap-4">
              <FaPlusCircle className="text-3xl text-sky-500" />
              <span className="text-gray-700 text-lg">
                Đăng ký các chỗ đậu xe của bạn.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaMoneyCheckAlt className="text-3xl text-sky-500" />
              <span className="text-gray-700 text-lg">
                Quản lý đặt chỗ và thu nhập dễ dàng.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <FaRegSmile className="text-3xl text-sky-500" />
              <span className="text-gray-700 text-lg">
                Thu hút nhiều khách hàng hơn mỗi ngày.
              </span>
            </div>
          </div>
          <Link
            href="#promotion"
            className="inline-block bg-sky-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-600 transition"
          >
            Tham Gia Ngay
          </Link>
        </div>
      </div>
    </section>
  );
}
