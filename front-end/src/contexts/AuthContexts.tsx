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

// Create types by inferring from the Zod schemas
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
      const storedUser = localStorage.getItem("spa-user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const result: any = await apiLogin(credentials);

      const authenticatedUser: User | null = result?.data || result || null;

      if (authenticatedUser && authenticatedUser.id) {
        setUser(authenticatedUser);
        localStorage.setItem("spa-user", JSON.stringify(authenticatedUser));
        return authenticatedUser;
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
    localStorage.removeItem("spa-user");
    router.push("/auth/login");
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      const result: any = await apiRegister(userData);
      const newUser: User | null = result?.data || result || null;

      if (newUser && newUser.id) {
        setUser(newUser);
        localStorage.setItem("spa-user", JSON.stringify(newUser));
        return newUser;
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
