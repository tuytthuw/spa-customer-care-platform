"use client";
import { useAuth } from "@/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FullPageLoader from "@/features/shared/components/common/FullPageLoader";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Thêm log để theo dõi trạng thái
  console.log("ProtectedRoute render:", { loading, user: !!user });

  useEffect(() => {
    // Chỉ hành động khi đã kiểm tra xong
    if (!loading) {
      console.log("Auth check complete.");
      if (!user) {
        console.log("User not found, redirecting to login...");
        router.push("/auth/login");
      }
    }
  }, [user, loading, router]);

  // 1. Nếu đang kiểm tra (loading = true), hiển thị màn hình chờ
  if (loading) {
    console.log("Auth status: loading...");
    return <FullPageLoader />;
  }

  // 2. Nếu kiểm tra xong và có user, hiển thị trang
  if (!loading && user) {
    console.log("Auth status: Success, rendering page.");
    return <>{children}</>;
  }

  // 3. Nếu kiểm tra xong và không có user, trả về null trong khi chờ useEffect chuyển hướng
  console.log("Auth status: Not authenticated, waiting for redirect.");
  return null;
}
