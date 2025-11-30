"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { sendResetPasswordEmail } from "@/app/account/reset/password/actions"

interface ResetTableProps extends React.ComponentPropsWithoutRef<"div"> {
  successMessage?: string;
}

export function ResetTable({
  className,
  successMessage,
  ...props
}: ResetTableProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(successMessage || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const res = await sendResetPasswordEmail(email);

    setLoading(false);

    if (res.success) {
      setMessage("📧 Vui lòng kiểm tra email để đặt lại mật khẩu.");
      setEmail("");
      // Redirect với tham số success
      router.push("/account/reset?success=true");
    } else {
      setError(res.error || "Đã xảy ra lỗi không xác định.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Đặt lại mật khẩu</CardTitle>
          <CardDescription>
            Để đặt lại mật khẩu, nhập email của bạn bên dưới và gửi yêu cầu.
            Chúng tôi sẽ gửi email hướng dẫn bạn hoàn tất quá trình này.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Địa chỉ Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {message && <p className="text-sm text-green-600">{message}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang gửi..." : "Đặt lại mật khẩu"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}