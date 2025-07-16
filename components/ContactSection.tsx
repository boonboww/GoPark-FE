"use client";

import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      access_key: "b19fe6de-12a8-4d61-b749-e617b5b2b5cd",
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center py-24 px-4 text-center min-h-[70vh] overflow-hidden bg-gradient-to-b from-white to-sky-50">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Blur Effects */}
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
        Liên Hệ Với Chúng Tôi
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-gray-600 max-w-2xl mb-12 px-4 z-10"
      >
        Chúng tôi rất mong nhận được ý kiến từ bạn. Vui lòng điền vào biểu mẫu
        dưới đây và đội ngũ của chúng tôi sẽ phản hồi sớm nhất có thể.
      </motion.p>

      {/* Info */}
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
          <span className="text-gray-700">Hà Nội, Việt Nam</span>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="w-full max-w-xl z-10"
      >
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Họ và Tên"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email của bạn"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tin nhắn của bạn"
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-sky-400 to-sky-500 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
        >
          Gửi Tin Nhắn
        </button>
      </motion.form>
    </section>
  );
}
