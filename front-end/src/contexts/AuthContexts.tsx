"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Permission } from "@/types/permissions";
import { Staff } from "@/types/staff";
import { mockRoles } from "@/lib/mock-data"; // <-- 1. THÊM IMPORT CÒN THIẾU

export interface User extends Omit<Staff, "password" | "role"> {
  permissions: Permission[];
  role: "customer" | "receptionist" | "technician" | "manager";
}

// 2. Sửa lại type của hàm login để nhất quán
interface AuthContextType {
  user: User | null;
  login: (userData: Staff) => void; // Login sẽ nhận vào Staff data
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const getPermissionsForRole = (
    role: "customer" | "receptionist" | "technician" | "manager"
  ): Permission[] => {
    const rolePermissions = mockRoles.find((r) => r.id === role);
    return rolePermissions ? rolePermissions.permissions : [];
  };

  const login = (userData: Staff) => {
    const permissions = getPermissionsForRole(userData.role);
    const userToStore: User = {
      ...userData,
      permissions,
    };
    setUser(userToStore);
    localStorage.setItem("user", JSON.stringify(userToStore));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
