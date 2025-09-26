"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "@/features/user/types";
import { Role } from "@/features/roles/types";

export type AuthUser = User & {
  permissions: Role["permissions"];
  name?: string;
  phone?: string;
  avatar?: string;
};

interface AuthContextType {
  user: AuthUser | null;
  login: (userData: User & { name?: string; phone?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:3001/roles");
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    };

    fetchRoles();

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

  const login = (userData: User & { name?: string; phone?: string }) => {
    // ✅ Tìm quyền hạn tương ứng với vai trò của người dùng
    const userRole = roles.find((r) => r.id === userData.role);

    const userToStore: AuthUser = {
      ...userData,
      // Gán object permissions, hoặc một object rỗng nếu không tìm thấy
      permissions: userRole?.permissions || {},
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
