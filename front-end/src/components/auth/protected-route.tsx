// src/components/auth/protected-route.tsx
"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra nếu component đã được tải xong và không có user
    if (!user) {
      // Chuyển hướng về trang đăng nhập
      router.push("/auth/login");
    }
  }, [user, router]);

  // Nếu có user, hiển thị nội dung của trang
  if (user) {
    return <>{children}</>;
  }

  // Trong khi đang kiểm tra, có thể hiển thị một màn hình loading
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Đang kiểm tra quyền truy cập...</p>
    </div>
  );
}
