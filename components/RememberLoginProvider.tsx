"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getRememberedLogin, 
  saveRememberedLogin, 
  clearRememberedLogin,
  hasRememberedLogin,
  type RememberedLogin 
} from '@/lib/auth-storage';

interface RememberLoginContextType {
  rememberedData: RememberedLogin | null;
  isRememberEnabled: boolean;
  saveLogin: (email: string, password: string) => void;
  clearLogin: () => void;
  toggleRemember: (enabled: boolean) => void;
  hasRemembered: boolean;
}

const RememberLoginContext = createContext<RememberLoginContextType | undefined>(undefined);

interface RememberLoginProviderProps {
  children: ReactNode;
}

export const RememberLoginProvider: React.FC<RememberLoginProviderProps> = ({ children }) => {
  const [rememberedData, setRememberedData] = useState<RememberedLogin | null>(null);
  const [isRememberEnabled, setIsRememberEnabled] = useState(false);
  const [hasRemembered, setHasRemembered] = useState(false);

  // Load remembered data on mount
  useEffect(() => {
    const loadRememberedData = () => {
      const data = getRememberedLogin();
      if (data) {
        setRememberedData(data);
        setIsRememberEnabled(true);
        setHasRemembered(true);
      } else {
        setHasRemembered(hasRememberedLogin());
      }
    };

    loadRememberedData();
  }, []);

  const saveLogin = (email: string, password: string) => {
    if (isRememberEnabled) {
      saveRememberedLogin(email, password);
      setRememberedData({ email, password });
      setHasRemembered(true);
    }
  };

  const clearLogin = () => {
    clearRememberedLogin();
    setRememberedData(null);
    setIsRememberEnabled(false);
    setHasRemembered(false);
  };

  const toggleRemember = (enabled: boolean) => {
    setIsRememberEnabled(enabled);
    if (!enabled && rememberedData) {
      clearLogin();
    }
  };

  const value: RememberLoginContextType = {
    rememberedData,
    isRememberEnabled,
    saveLogin,
    clearLogin,
    toggleRemember,
    hasRemembered
  };

  return (
    <RememberLoginContext.Provider value={value}>
      {children}
    </RememberLoginContext.Provider>
  );
};

export const useRememberLogin = (): RememberLoginContextType => {
  const context = useContext(RememberLoginContext);
  if (context === undefined) {
    throw new Error('useRememberLogin must be used within a RememberLoginProvider');
  }
  return context;
};