"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, LogIn, UserPlus, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/account/login/action";
import { cn } from "@/lib/utils";
import { useRememberLogin } from "@/components/RememberLoginProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [loginRole, setLoginRole] = useState<string | undefined>(undefined);
  const router = useRouter();

  const {
    rememberedData,
    isRememberEnabled,
    saveLogin,
    clearLogin,
    toggleRemember,
    hasRemembered,
  } = useRememberLogin();

  useEffect(() => {
    if (rememberedData) {
      setFormData({
        email: rememberedData.email,
        password: rememberedData.password,
      });
    }
  }, [rememberedData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRememberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    toggleRemember(isChecked);

    if (!isChecked && hasRemembered) {
      setFormData({ email: "", password: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      setMessage("❌ Vui lòng nhập đầy đủ email và mật khẩu");
      setLoading(false);
      return;
    }

    try {
      const res = await loginUser(email, password);

      if (res.error) {
        setMessage(`❌ ${res.error}`);
        if (hasRemembered && rememberedData?.email === email) {
          clearLogin();
          setFormData({ email: "", password: "" });
        }
      } else {
        setMessage("✅ Đăng nhập thành công!");
        setShowSuccessDialog(true);
        setLoginRole(res.data?.role);

        if (isRememberEnabled) {
          saveLogin(email, password);
        } else {
          clearLogin();
        }

        const role = res.data?.role;
        setTimeout(() => {
          setShowSuccessDialog(false);
          if (role === "admin") {
            router.push("/admin");
          } else if (role === "owner") {
            router.push("/owner");
          } else {
            router.push("/");
          }
        }, 2500);
      }
    } catch (error) {
      setMessage("❌ Có lỗi xảy ra khi đăng nhập");
      console.error("Login error:", error);
    }

    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {showSuccessDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm [animation:fadeIn_0.3s_ease-out]" />

          <div className="relative px-10 py-8 rounded-3xl shadow-2xl bg-white flex flex-col items-center pointer-events-auto min-w-[380px] [animation:slideUp_0.4s_ease-out]">
            {/* Animated Check Circle */}
            <div className="relative w-20 h-20 mb-5">
              <div className="absolute inset-0 bg-green-100 rounded-full [animation:pulse_1s_ease-out]"></div>
              <div className="absolute inset-2 bg-green-500 rounded-full flex items-center justify-center [animation:scaleIn_0.5s_ease-out_0.2s_both]">
                <svg
                  className="w-10 h-10 text-white [animation:checkmark_0.6s_ease-out_0.4s_both]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2 [animation:fadeIn_0.5s_ease-out_0.3s_both]">
              Đăng nhập thành công!
            </h3>
            <p className="text-gray-600 text-center mb-6 [animation:fadeIn_0.5s_ease-out_0.4s_both]">
              {loginRole === "admin" &&
                "Chào mừng Quản trị viên đến với hệ thống GoPark"}
              {loginRole === "owner" &&
                "Chào mừng Chủ bãi xe đến với hệ thống GoPark"}
              {(loginRole === "user" || !loginRole) &&
                "Chào mừng bạn đến với hệ thống GoPark"}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full [animation:progressBar_2.5s_ease-out]"></div>
            </div>

            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from { 
                  opacity: 0;
                  transform: translateY(20px);
                }
                to { 
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes pulse {
                0%, 100% { 
                  transform: scale(1);
                  opacity: 1;
                }
                50% { 
                  transform: scale(1.1);
                  opacity: 0.8;
                }
              }
              @keyframes scaleIn {
                from { 
                  transform: scale(0);
                  opacity: 0;
                }
                to { 
                  transform: scale(1);
                  opacity: 1;
                }
              }
              @keyframes checkmark {
                0% {
                  stroke-dasharray: 0 50;
                  stroke-dashoffset: 0;
                }
                100% {
                  stroke-dasharray: 50 50;
                  stroke-dashoffset: 0;
                }
              }
              @keyframes progressBar {
                from { width: 0%; }
                to { width: 100%; }
              }
            `}</style>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Đăng nhập tài khoản</CardTitle>
          <CardDescription>
            Vui lòng nhập thông tin đăng nhập để truy cập tài khoản của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    required
                    onChange={handleChange}
                    className="pl-10"
                    value={formData.email}
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <a
                    href="/account/reset"
                    tabIndex={-1}
                    className="ml-auto text-sm underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    required
                    onChange={handleChange}
                    className="pl-10"
                    value={formData.password}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={isRememberEnabled}
                  onChange={handleRememberChange}
                  className="mr-2 cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <Label
                  htmlFor="remember"
                  className="cursor-pointer select-none text-sm font-medium"
                >
                  Ghi nhớ đăng nhập
                  {hasRemembered && (
                    <span className="ml-1 text-xs text-green-600">
                      (đã lưu)
                    </span>
                  )}
                </Label>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 cursor-pointer"
                  disabled={loading}
                >
                  <LogIn className="w-4 h-4 cursor-pointer" />
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-red-500 cursor-pointer" />
                  Đăng nhập bằng Google
                </Button>
              </div>
              {message && (
                <p className="text-sm text-center text-muted-foreground">
                  {message}
                </p>
              )}
            </div>
            <div className="mt-4 text-center text-sm">
              Chưa có tài khoản?{" "}
              <a
                href="/account/signup"
                className="inline-flex items-center gap-1 underline text-blue-600 font-medium cursor-pointer"
              >
                <UserPlus className="w-4 h-4 cursor-pointer" /> Đăng ký ngay
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
