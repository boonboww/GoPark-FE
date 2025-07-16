"use client";

import CountUp from "react-countup";
import { FaMapMarkedAlt, FaCity, FaParking } from "react-icons/fa";
import { motion } from "framer-motion";

export default function MapSection() {
  return (
    <section className="relative flex flex-col items-center justify-center py-20 text-center min-h-[90vh] bg-gradient-to-b from-sky-50 to-white overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>

      {/* Wave Bottom */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320">
        <path
          fill="#38bdf8"
          fillOpacity="0.2"
          d="M0,160L48,186.7C96,213,192,267,288,266.7C384,267,480,213,576,181.3C672,149,768,139,864,160C960,181,1056,235,1152,224C1248,213,1344,139,1392,101.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-4xl sm:text-5xl font-bold text-sky-600 mb-4 z-10"
      >
        Mạng Lưới Đậu Xe Thông Minh
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-gray-600 max-w-2xl mb-12 px-4 z-10"
      >
        Chúng tôi kết nối hàng nghìn chỗ đậu xe an toàn trên khắp Việt Nam, mang lại sự tiện lợi và công nghệ gần gũi hơn với tài xế mỗi ngày.
      </motion.p>

      {/* Map Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        viewport={{ once: true }}
        className="w-full max-w-2xl px-6 z-10 group perspective-1000"
      >
        <img
          src="https://en.parkopedia.co.uk/public/images/map-with-markers.png"
          alt="Bản Đồ Việt Nam"
          className="w-full h-auto rounded-2xl shadow-2xl ring-4 ring-sky-300 transform group-hover:scale-105 group-hover:rotate-2 transition duration-500 ease-out"
        />
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-14 px-6 w-full max-w-5xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <FaMapMarkedAlt className="text-5xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 animate-bounce" />
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-4xl font-bold px-6 py-3 rounded-xl shadow-md">
            <CountUp end={23} duration={1.5} />
          </div>
          <div className="text-gray-700 mt-2 text-lg font-medium">Tỉnh Thành</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <FaCity className="text-5xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 animate-bounce delay-200" />
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-4xl font-bold px-6 py-3 rounded-xl shadow-md">
            <CountUp end={6} duration={2} separator="," />
          </div>
          <div className="text-gray-700 mt-2 text-lg font-medium">Thành Phố</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <FaParking className="text-5xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 animate-bounce delay-500" />
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-4xl font-bold px-6 py-3 rounded-xl shadow-md min-w-[160px]">
            <CountUp start={5000} end={50200} duration={5} separator="," />
          </div>
          <div className="text-gray-700 mt-2 text-lg font-medium">Chỗ Đậu Xe</div>
        </motion.div>
      </div>

      {/* CTA Button with scrollTo */}
      <motion.button
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="mt-14 px-8 py-4 bg-gradient-to-r cursor-pointer from-sky-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition transform duration-300 z-10"
      >
        Tìm Bản Đồ
      </motion.button>
    </section>
  );
}