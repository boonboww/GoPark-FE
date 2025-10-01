import API from "@/lib/api";

interface ResetResponse {
  success: boolean;
  message?: string;
  error?: string;
  token?: string;
}

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export async function sendResetPasswordEmail(email: string): Promise<ResetResponse> {
  try {
    const res = await API.post("/api/v1/users/forgotPassword", { email });
    
    return {
      success: res.status >= 200 && res.status < 300,
      message: res.data?.message ?? "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.",
      token: res.data?.resetToken
    };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.response?.data?.message ?? 
            err.message ?? 
            "Gửi email đặt lại mật khẩu thất bại. Vui lòng thử lại sau."
    };
  }
}

export async function resetPasswordWithToken(
  token: string,
  password: string,
  passwordConfirm: string
): Promise<ResetResponse> {
  try {
    const hashedToken = encodeURIComponent(token);
    const res = await API.patch(`/api/v1/users/resetPassword/${hashedToken}`, {
      password,
      passwordConfirm
    });

    return {
      success: res.status >= 200 && res.status < 300,
      message: res.data?.message ?? "Đặt lại mật khẩu thành công!",
      token: res.data?.token
    };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.response?.data?.message ?? 
            err.message ?? 
            "Đặt lại mật khẩu thất bại. Token có thể không hợp lệ hoặc đã hết hạn."
    };
  }
}