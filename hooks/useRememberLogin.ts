import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  loadRemembered,
  saveLogin as saveLoginAction,
  clearLogin as clearLoginAction,
  toggleRemember as toggleRememberAction,
} from "@/lib/redux/slices/rememberLoginSlice";
import { useEffect } from "react";

export const useRememberLogin = () => {
  const dispatch = useAppDispatch();
  const { rememberedData, isRememberEnabled, hasRemembered } = useAppSelector(
    (state) => state.rememberLogin
  );

  // Load remembered data on mount
  useEffect(() => {
    dispatch(loadRemembered());
  }, [dispatch]);

  return {
    rememberedData,
    isRememberEnabled,
    hasRemembered,
    saveLogin: (email: string, password: string) => {
      dispatch(saveLoginAction({ email, password }));
    },
    clearLogin: () => {
      dispatch(clearLoginAction());
    },
    toggleRemember: (enabled: boolean) => {
      dispatch(toggleRememberAction(enabled));
    },
  };
};
