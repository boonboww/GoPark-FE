"use client";

import { useState } from "react";
import { Mail, Lock, LogIn, UserPlus, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/account/login/action";
import { cn } from "@/lib/utils";
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

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { email, password } = formData;
    const res = await loginUser(email, password);

    if (res.error) {
      setMessage(`❌ ${res.error}`);
    } else {
      setMessage("✅ Đăng nhập thành công!");

      const role = res.data?.role;
      console.log("Logged in role:", role);

      if (role === "admin") {
        router.push("/admin");
      } else if (role === "owner") {
        router.push("/owner");
      } else {
        router.push("/");
      }
    }

    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <a href="/account/reset" className="ml-auto text-sm underline">
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
                  />
                </div>
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