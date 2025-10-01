
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
import Lottie from "lottie-react";
import successAnimation from "@/public/animation.json"; 

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
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
    hasRemembered 
  } = useRememberLogin();

  useEffect(() => {
    if (rememberedData) {
      setFormData({
        email: rememberedData.email,
        password: rememberedData.password
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
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-white/40 backdrop-blur-sm transition-all duration-300" />
    
    <div className="relative px-8 py-8 rounded-2xl shadow-2xl border border-blue-200 bg-white/95 flex flex-col items-center pointer-events-auto animate-scale-in min-w-[420px]">
      
      {/* Lottie Success Animation */}
      <div className="w-24 h-24 mb-2">
        <Lottie
          animationData={successAnimation}
          loop={false}
          autoplay={true}
        />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-1">Đăng nhập thành công!</h3>
      <p className="text-gray-600 text-center mb-4">
        {loginRole === "admin" && "Chào mừng Quản trị viên đến với hệ thống GoPark"}
        {loginRole === "owner" && "Chào mừng Chủ bãi xe đến với hệ thống GoPark"}
        {(loginRole === "user" || !loginRole) && "Chào mừng bạn đến với hệ thống GoPark"}
      </p>
      
      {/* Mini Car Animation kết hợp */}
      <div className="w-full h-20 overflow-hidden flex items-center justify-center mb-4">
        <div className="relative w-full h-[60px]">
          <div className="absolute left-0 top-2 w-[120px] h-[40px] [animation:car-drive-in_1.2s_ease-out_forwards]">
            {/* Simple car design */}
            <div className="absolute w-[120px] h-6 bg-blue-600 rounded-[10px_10px_3px_3px] border-2 border-blue-700">
              <div className="absolute right-4 -top-3 w-10 h-[15px] bg-blue-600 rounded-t-[10px] border-2 border-blue-700 border-b-0"></div>
              <div className="absolute left-3 top-1 w-[15px] h-[8px] bg-amber-100 rounded-[2px] border border-amber-600"></div>
              <div className="absolute left-8 top-1 w-[25px] h-[12px] bg-blue-400 rounded-[3px] border border-blue-700"></div>
            </div>
            {/* Wheels */}
            <div className="absolute left-6 top-[22px] w-[15px] h-[15px] bg-gray-800 rounded-full border border-gray-900"></div>
            <div className="absolute left-[85px] top-[22px] w-[15px] h-[15px] bg-gray-800 rounded-full border border-gray-900"></div>
          </div>
          {/* Road */}
          <div className="absolute bottom-2 w-full h-[3px] bg-gray-500 rounded-[2px]"></div>
          <div className="absolute bottom-[1px] left-0 w-full h-[1px] bg-[linear-gradient(to_right,#fcd34d_0%,#fcd34d_20%,transparent_20%,transparent_100%)] bg-[length:20px_100%] [animation:road-move_0.4s_linear_infinite]"></div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="bg-green-500 h-2 rounded-full [animation:progressBar_2.5s_linear]"></div>
      </div>
      
      <style>{`
        @keyframes car-drive-in {
          0% { left: -120px; }
          70% { left: calc(50% - 60px); }
          100% { left: calc(50% - 60px); }
        }
        @keyframes road-move {
          0% { background-position: 0 0; }
          100% { background-position: 20px 0; }
        }
        @keyframes progressBar {
          0% { width: 0%; }
          100% { width: 100%; }
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
                  <a href="/account/reset" tabIndex={-1} className="ml-auto text-sm underline">
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
                <Label htmlFor="remember" className="cursor-pointer select-none text-sm font-medium">
                  Ghi nhớ đăng nhập
                  {hasRemembered && (
                    <span className="ml-1 text-xs text-green-600">(đã lưu)</span>
                  )}
                </Label>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full flex items-center justify-center gap-2 cursor-pointer" disabled={loading}>
                  <LogIn className="w-4 h-4 cursor-pointer" />
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
                <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 cursor-pointer">
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
              <a href="/account/signup" className="inline-flex items-center gap-1 underline text-blue-600 font-medium cursor-pointer">
                <UserPlus className="w-4 h-4 cursor-pointer" /> Đăng ký ngay
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
