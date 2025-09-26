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
import FullPageLoader from "@/features/shared/components/common/FullPageLoader";

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
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 1. Tải danh sách vai trò trước
        const response = await fetch("http://localhost:3001/roles");
        if (!response.ok) {
          throw new Error("Failed to fetch roles");
        }
        const rolesData = await response.json();
        setRoles(rolesData);

        // 2. Sau khi có vai trò, mới kiểm tra người dùng trong localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Gắn lại permissions từ rolesData mới nhất để đảm bảo luôn đúng
          const userRole = rolesData.find(
            (r: Role) => r.id === parsedUser.role
          );
          const userWithPermissions: AuthUser = {
            ...parsedUser,
            permissions: userRole?.permissions || {},
          };
          setUser(userWithPermissions);
        }
      } catch (error) {
        console.error("Failed to initialize auth state:", error);
        // Nếu có lỗi, xóa thông tin user cũ để tránh lỗi lặp lại
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false); // Hoàn tất quá trình tải
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: User & { name?: string; phone?: string }) => {
    const userRole = roles.find((r) => r.id === userData.role);
    const userToStore: AuthUser = {
      ...userData,
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

  // Hiển thị màn hình tải trong khi đang khởi tạo
  if (isLoading) {
    return <FullPageLoader />;
  }

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
