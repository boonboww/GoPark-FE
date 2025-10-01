"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useRememberLogin } from '@/components/RememberLoginProvider';

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  const router = useRouter();
  const { rememberedData, isRememberEnabled } = useRememberLogin();

  // Kiểm tra authentication status
  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      // Kiểm tra token trong localStorage hoặc cookies
      const token = localStorage.getItem('access_token') || 
                   sessionStorage.getItem('access_token');

      if (!token) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null
        });
        return;
      }

      // Gọi API để verify token và lấy thông tin user
      // const response = await fetch('/api/auth/verify', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });

      // if (response.ok) {
      //   const userData = await response.json();
      //   setAuthState({
      //     isAuthenticated: true,
      //     user: userData,
      //     loading: false,
      //     error: null
      //   });
      // } else {
      //   throw new Error('Token invalid');
      // }

      // Tạm thời mock data để test
      setAuthState({
        isAuthenticated: true,
        user: {
          id: '1',
          email: rememberedData?.email || 'user@example.com',
          role: 'user'
        },
        loading: false,
        error: null
      });

    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      });

      // Xóa token không hợp lệ
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
    }
  }, [rememberedData]);

  // Auto login với remembered credentials
  const autoLogin = useCallback(async () => {
    if (rememberedData && isRememberEnabled && !authState.isAuthenticated) {
      try {
        // Gọi API login với remembered credentials
        // const response = await loginUser(rememberedData.email, rememberedData.password);
        
        // Tạm thời mock thành công
        console.log('Auto login with remembered credentials');
        await checkAuth();
      } catch (error) {
        console.error('Auto login failed:', error);
      }
    }
  }, [rememberedData, isRememberEnabled, authState.isAuthenticated, checkAuth]);

  // Redirect based on authentication status
  const requireAuth = useCallback((redirectTo: string = '/account/login') => {
    if (!authState.loading && !authState.isAuthenticated) {
      router.push(redirectTo);
    }
  }, [authState.isAuthenticated, authState.loading, router]);

  // Redirect authenticated users away from auth pages
  const requireGuest = useCallback((redirectTo: string = '/') => {
    if (!authState.loading && authState.isAuthenticated) {
      router.push(redirectTo);
    }
  }, [authState.isAuthenticated, authState.loading, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!authState.loading && !authState.isAuthenticated) {
      autoLogin();
    }
  }, [autoLogin, authState.loading, authState.isAuthenticated]);

  return {
    ...authState,
    checkAuth,
    requireAuth,
    requireGuest,
    hasRememberedCredentials: Boolean(rememberedData && isRememberEnabled)
  };
};
