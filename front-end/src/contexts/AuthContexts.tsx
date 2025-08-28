"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Permission } from "@/types/permissions";
import { mockRoles } from "@/lib/mock-data";
import { User } from "@/types/user";

//AuthUser là User, cộng thêm permissions
export type AuthUser = User & {
  permissions: Permission[];
};

interface AuthContextType {
  user: AuthUser | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error(
          "Không thể phân tích dữ liệu người dùng từ localStorage",
          error
        );
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

  const login = (userData: User) => {
    const permissions = getPermissionsForRole(userData.role);
    const userToStore: AuthUser = {
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
    throw new Error("useAuth phải được sử dụng bên trong một AuthProvider");
  }
  return context;
}
