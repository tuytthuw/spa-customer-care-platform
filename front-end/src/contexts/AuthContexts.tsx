"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/features/user/types";
import {
  login as apiLogin,
  register as apiRegister,
} from "@/features/auth/api/auth.api";
import { loginSchema, registerSchema } from "@/features/auth/schemas";
import { z } from "zod";

const LOCAL_STORAGE_USER_KEY = "user";

type LoginCredentials = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      // SỬA LỖI: Nhận về kết quả là ActionResult
      const result = await apiLogin(credentials);

      // SỬA LỖI: Kiểm tra `result.success` và `result.user`
      if (result.success && result.user) {
        const userObject = result.user as User;
        setUser(userObject);
        localStorage.setItem(
          LOCAL_STORAGE_USER_KEY,
          JSON.stringify(userObject)
        );
        return userObject;
      }
      return null;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    router.push("/auth/login");
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      // SỬA LỖI: Nhận về kết quả là ActionResult
      const result = await apiRegister(userData);

      // SỬA LỖI: Kiểm tra `result.success` và `result.user`
      if (result.success && result.user) {
        const userObject = result.user as User;
        setUser(userObject);
        localStorage.setItem(
          LOCAL_STORAGE_USER_KEY,
          JSON.stringify(userObject)
        );
        return userObject;
      }
      return null;
    } catch (error) {
      console.error("Registration failed:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = { user, loading, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
