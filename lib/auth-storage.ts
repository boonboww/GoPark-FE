/**
 * Utility functions for managing authentication storage
 * Handles remember login functionality with basic encoding and expiry
 */

const REMEMBER_KEY = "gopark_remember_login";
const EXPIRY_DAYS = 30; // Thời gian nhớ đăng nhập (30 ngày)

// Simple encoding/decoding for basic obfuscation (not for production security)
const encodeData = (data: string): string => {
  try {
    return btoa(unescape(encodeURIComponent(data)));
  } catch {
    return data;
  }
};

const decodeData = (data: string): string => {
  try {
    return decodeURIComponent(escape(atob(data)));
  } catch {
    return data;
  }
};

export interface RememberedLogin {
  email: string;
  password: string;
}

/**
 * Lưu thông tin đăng nhập với thời gian hết hạn
 */
export const saveRememberedLogin = (email: string, password: string): void => {
  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);

    const data = {
      email: encodeData(email),
      password: encodeData(password),
      expiry: expiryDate.toISOString(),
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(REMEMBER_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save remembered login:", error);
  }
};

/**
 * Lấy thông tin đăng nhập đã lưu (nếu chưa hết hạn)
 */
export const getRememberedLogin = (): RememberedLogin | null => {
  try {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (!saved) return null;

    const data = JSON.parse(saved);
    if (!data.expiry) {
      // Dữ liệu cũ không có expiry, xóa đi
      clearRememberedLogin();
      return null;
    }

    const expiryDate = new Date(data.expiry);

    // Kiểm tra xem dữ liệu đã hết hạn chưa
    if (new Date() > expiryDate) {
      clearRememberedLogin();
      return null;
    }

    return {
      email: decodeData(data.email),
      password: decodeData(data.password),
    };
  } catch (error) {
    console.warn("Failed to get remembered login:", error);
    // Nếu có lỗi, xóa dữ liệu cũ
    clearRememberedLogin();
    return null;
  }
};

/**
 * Xóa thông tin đăng nhập đã lưu
 */
export const clearRememberedLogin = (): void => {
  try {
    localStorage.removeItem(REMEMBER_KEY);
  } catch (error) {
    console.warn("Failed to clear remembered login:", error);
  }
};

/**
 * Kiểm tra xem có thông tin đăng nhập đã lưu không
 */
export const hasRememberedLogin = (): boolean => {
  return getRememberedLogin() !== null;
};

/**
 * Cập nhật thời gian hết hạn của thông tin đăng nhập đã lưu
 */
export const refreshRememberedLogin = (): void => {
  const remembered = getRememberedLogin();
  if (remembered) {
    saveRememberedLogin(remembered.email, remembered.password);
  }
};

/**
 * Lưu access token vào localStorage
 */
export const saveAccessToken = (token: string): void => {
  try {
    // Cũng lưu vào key 'token' để tương thích với code cũ
    localStorage.setItem("token", token);
  } catch (error) {
    console.warn("Failed to save access token:", error);
  }
};

/**
 * Lấy access token từ localStorage
 */
export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.warn("Failed to get access token:", error);
    return null;
  }
};

/**
 * Xóa tất cả dữ liệu liên quan đến authentication khi logout
 */
export const clearAllAuthData = (): void => {
  try {
    // Xóa remembered login
    clearRememberedLogin();

    // Xóa các dữ liệu auth khác nếu có
    const authKeys = ["token", "refresh_token", "user_data", "session_data"];

    authKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  } catch (error) {
    console.warn("Failed to clear auth data:", error);
  }
};
