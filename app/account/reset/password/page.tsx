"use client";

import { useState, FormEvent, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPasswordWithToken } from "@/app/account/reset/password/actions";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!token) {
      setError("Liên kết đặt lại mật khẩu không hợp lệ. Vui lòng sử dụng liên kết từ email của bạn.");
      return;
    }
    
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    
    if (password !== passwordConfirm) {
      setError("Mật khẩu không khớp.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await resetPasswordWithToken(token, password, passwordConfirm);
      
      if (result.success) {
        setSuccess(result.message ?? "Đặt lại mật khẩu thành công! Đang chuyển hướng đến trang đăng nhập...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(result.error ?? "Đặt lại mật khẩu thất bại.");
      }
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-md">
          <h1 className="text-center text-2xl font-bold text-red-600">
            Liên kết không hợp lệ
          </h1>
          <div className="rounded-md bg-red-50 p-4 text-red-600">
            <p className="text-center">
              Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold text-gray-900">
          Đặt lại mật khẩu
        </h1>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-600">
            <p className="text-center">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="rounded-md bg-green-50 p-4 text-green-600">
            <p className="text-center">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu mới
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="Ít nhất 8 ký tự"
            />
          </div>
          
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>
            <input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              minLength={8}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="Nhập lại mật khẩu"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isLoading ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              'Đặt lại mật khẩu'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Đang tải...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}