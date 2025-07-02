import API from "@/lib/api";

export async function sendResetPasswordEmail(email: string) {
  try {
    const res = await API.post("/users/forgotPassword", { email });

    return {
      success: true,
      message: res.data.message || "Check your email!",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || "Something went wrong",
    };
  }
}
