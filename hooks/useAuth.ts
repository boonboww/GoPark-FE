"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  checkAuth,
  loginThunk,
  logoutThunk,
} from "@/lib/redux/slices/authSlice";
import { loadRemembered } from "@/lib/redux/slices/rememberLoginSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Get state from Redux
  const authState = useAppSelector((state) => state.auth);
  const { rememberedData, isRememberEnabled } = useAppSelector(
    (state) => state.rememberLogin
  );

  // Load remembered data on mount
  useEffect(() => {
    dispatch(loadRemembered());
  }, [dispatch]);

  // Check authentication status on mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Auto login with remembered credentials
  useEffect(() => {
    const autoLogin = async () => {
      if (
        rememberedData &&
        isRememberEnabled &&
        !authState.isAuthenticated &&
        !authState.loading
      ) {
        try {
          await dispatch(
            loginThunk({
              email: rememberedData.email,
              password: rememberedData.password,
            })
          ).unwrap();
        } catch (error) {
          console.error("Auto login failed:", error);
        }
      }
    };

    autoLogin();
  }, [
    rememberedData,
    isRememberEnabled,
    authState.isAuthenticated,
    authState.loading,
    dispatch,
  ]);

  // Redirect based on authentication status
  const requireAuth = useCallback(
    (redirectTo: string = "/account/login") => {
      if (!authState.loading && !authState.isAuthenticated) {
        router.push(redirectTo);
      }
    },
    [authState.isAuthenticated, authState.loading, router]
  );

  // Redirect authenticated users away from auth pages
  const requireGuest = useCallback(
    (redirectTo: string = "/") => {
      if (!authState.loading && authState.isAuthenticated) {
        router.push(redirectTo);
      }
    },
    [authState.isAuthenticated, authState.loading, router]
  );

  return {
    ...authState,
    checkAuth: () => dispatch(checkAuth()),
    login: (email: string, password: string) =>
      dispatch(loginThunk({ email, password })),
    logout: () => dispatch(logoutThunk()),
    requireAuth,
    requireGuest,
    hasRememberedCredentials: Boolean(rememberedData && isRememberEnabled),
  };
};
