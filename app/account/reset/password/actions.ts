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
    const res = await API.post("/users/forgotPassword", { email });
    
    return {
      success: res.status >= 200 && res.status < 300,
      message: res.data?.message ?? "Password reset email sent successfully. Please check your email.",
      token: res.data?.resetToken
    };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.response?.data?.message ?? 
            err.message ?? 
            "Failed to send reset email. Please try again later."
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
    const res = await API.patch(`/users/resetPassword/${hashedToken}`, {
      password,
      passwordConfirm
    });

    return {
      success: res.status >= 200 && res.status < 300,
      message: res.data?.message ?? "Password reset successfully!",
      token: res.data?.token
    };
  } catch (error) {
    const err = error as ApiError;
    return {
      success: false,
      error: err.response?.data?.message ?? 
            err.message ?? 
            "Password reset failed. The token may be invalid or expired."
    };
  }
}