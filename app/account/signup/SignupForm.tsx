"use client";

import { useState } from "react";
import { User, Mail, Phone, Lock, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import API from "@/lib/api";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 10 },
  },
};

export default function SignupForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirm: "",
    profilePicture: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;
    if (id === "profilePicture" && files && files[0]) {
      // upload file as Base64 (demo purpose)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/api/v1/users/signup", formData);
      const token = res.data?.token;
      if (token && typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      router.push("/account/login?success=1");
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (err as any).response?.data?.message === "string"
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setError((err as any).response.data.message);
      } else {
        setError("Đăng ký thất bại");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-[500px]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[550px]"
      >
        <Card className="border border-white/60 bg-white/70 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 text-center pb-4 pt-6 px-10">
            <motion.div
              variants={itemVariants}
              className="mx-auto w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-2"
            >
              <UserPlus className="w-5 h-5 text-blue-600" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-xl font-bold text-slate-800">
                Tạo tài khoản
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium text-xs mt-1">
                Tham gia cùng chúng tôi ngay
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="px-10 pb-8">
            <form className="space-y-3" onSubmit={handleSubmit}>
              <motion.div variants={itemVariants} className="space-y-1.5">
                <Label
                  htmlFor="userName"
                  className="text-slate-600 font-semibold text-xs"
                >
                  Họ và tên
                </Label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors hidden sm:block">
                    <User className="w-4 h-4" />
                  </span>
                  <Input
                    id="userName"
                    type="text"
                    placeholder="Nhập họ tên"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    className="sm:pl-9 h-10 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg text-sm transition-all"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-slate-600 font-semibold text-xs"
                >
                  Email
                </Label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors hidden sm:block">
                    <Mail className="w-4 h-4" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="sm:pl-9 h-10 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg text-sm transition-all"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <Label
                  htmlFor="phoneNumber"
                  className="text-slate-600 font-semibold text-xs"
                >
                  Số điện thoại
                </Label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors hidden sm:block">
                    <Phone className="w-4 h-4" />
                  </span>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="0123456789"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="sm:pl-9 h-10 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg text-sm transition-all"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-3"
              >
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-slate-600 font-semibold text-xs"
                  >
                    Mật khẩu
                  </Label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors hidden sm:block">
                      <Lock className="w-4 h-4" />
                    </span>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="sm:pl-9 h-10 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg text-sm transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="passwordConfirm"
                    className="text-slate-600 font-semibold text-xs"
                  >
                    Xác nhận
                  </Label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors hidden sm:block">
                      <Lock className="w-4 h-4" />
                    </span>
                    <Input
                      id="passwordConfirm"
                      type="password"
                      placeholder="••••••••"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      required
                      className="sm:pl-9 h-10 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg text-sm transition-all"
                    />
                  </div>
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-rose-50 text-rose-600 border border-rose-100 p-2.5 rounded-lg text-xs text-center font-medium"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full h-10 mt-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Đăng ký"
                  )}
                </Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="text-center text-xs pt-2"
              >
                <span className="text-slate-500">Đã có tài khoản? </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline font-semibold cursor-pointer"
                  onClick={() => router.push("/account/login")}
                >
                  Đăng nhập
                </button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
