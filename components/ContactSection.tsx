"use client";

import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section className="relative flex flex-col items-center justify-center py-24 px-4 text-center min-h-[70vh] overflow-hidden bg-gradient-to-b from-white to-sky-50">
      {/* Decorative Blur Circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-4xl sm:text-5xl font-bold text-sky-600 mb-4 z-10"
      >
        Contact Us
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-gray-600 max-w-2xl mb-12 px-4 z-10"
      >
        We love to hear from you. Fill out the form below and our team will get back to you as soon as possible.
      </motion.p>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row gap-8 mb-12 z-10"
      >
        <div className="flex items-center gap-3 text-sky-600">
          <FaEnvelope className="text-2xl" />
          <span className="text-gray-700">info@yourdomain.com</span>
        </div>
        <div className="flex items-center gap-3 text-sky-600">
          <FaPhoneAlt className="text-2xl" />
          <span className="text-gray-700">+84 123 456 789</span>
        </div>
        <div className="flex items-center gap-3 text-sky-600">
          <FaMapMarkerAlt className="text-2xl" />
          <span className="text-gray-700">Hanoi, Vietnam</span>
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="w-full max-w-xl z-10"
      >
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <textarea
            placeholder="Your Message"
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-sky-400 to-sky-500 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
        >
          Send Message
        </button>
      </motion.form>
    </section>
  );
}
