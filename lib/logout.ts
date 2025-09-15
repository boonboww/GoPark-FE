/**
 * Logout utility functions
 * Handles logout process and clears all authentication data
 */

import { clearAllAuthData } from './auth-storage';

export interface LogoutOptions {
  redirectTo?: string;
  clearRememberedLogin?: boolean;
}

/**
 * Thực hiện logout với các tùy chọn
 */
export const performLogout = async (options: LogoutOptions = {}) => {
  const { 
    redirectTo = '/account/login', 
    clearRememberedLogin: shouldClearRemembered = false 
  } = options;

  try {
    // Gọi API logout nếu có
    // await logoutUser(); // Uncomment khi có API logout
    
    // Xóa dữ liệu authentication
    if (shouldClearRemembered) {
      clearAllAuthData(); // Xóa tất cả bao gồm remembered login
    } else {
      // Chỉ xóa session data, giữ lại remembered login
      const authKeys = [
        'access_token',
        'refresh_token', 
        'user_data',
        'session_data'
      ];
      
      authKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    }

    // Redirect
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Logout failed:', error);
    return { success: false, error: error as Error };
  }
};

/**
 * Hook để sử dụng trong React components
 */
export const useLogout = () => {
  const logout = (options?: LogoutOptions) => {
    return performLogout(options);
  };

  return { logout };
};
