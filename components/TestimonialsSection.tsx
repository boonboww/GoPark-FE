"use client";

import { FaQuoteLeft } from "react-icons/fa";

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-6 text-center bg-sky-50">
      <h2 className="text-4xl sm:text-5xl font-bold text-sky-600 mb-4">
        What Our Users Say
      </h2>
      <p className="text-gray-600 max-w-3xl mx-auto mb-12">
        We’re trusted by drivers and parking owners across Vietnam.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Testimonial 1 */}
        <div className="bg-white p-8 rounded-2xl shadow-md relative hover:shadow-xl transition">
          <FaQuoteLeft className="text-sky-200 text-5xl absolute -top-4 -left-4" />
          <p className="text-gray-700 mb-6 leading-relaxed">
          " Finding parking has never been this easy! I can book spots online
            and save so much time "
          </p>
          <p className="text-sky-500 font-bold">– Tran Minh, Hanoi</p>
        </div>

        {/* Testimonial 2 */}
        <div className="bg-white p-8 rounded-2xl shadow-md relative hover:shadow-xl transition">
          <FaQuoteLeft className="text-sky-200 text-5xl absolute -top-4 -left-4" />
          <p className="text-gray-700 mb-6 leading-relaxed">
            " I earn extra income by sharing my unused parking spots. Great
            support team too "
          </p>
          <p className="text-sky-500 font-bold">– Le Hoa, Da Nang</p>
        </div>

        {/* Testimonial 3 */}
        <div className="bg-white p-8 rounded-2xl shadow-md relative hover:shadow-xl transition">
          <FaQuoteLeft className="text-sky-200 text-5xl absolute -top-4 -left-4" />
          <p className="text-gray-700 mb-6 leading-relaxed">
            " Very convenient, secure, and highly recommended for busy cities. "
          </p>
          <p className="text-sky-500 font-bold">
            – Nguyen Bao, Ho Chi Minh City
          </p>
        </div>
      </div>
    </section>
  );
}
