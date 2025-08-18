// src/app/auth/callback/google/page.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loginWithGoogle } from "@/actions/auth"; // 1. Import action

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    const handleGoogleLogin = async (authCode: string) => {
      const result = await loginWithGoogle(authCode);
      if (result.success) {
        router.push("/dashboard");
      } else {
        router.push(`/auth/login?error=${result.error}`);
      }
    };

    if (error) {
      console.error("Lỗi xác thực Google:", error);
      router.push("/auth/login?error=GoogleAuthenticationFailed");
      return;
    }

    if (code) {
      // 2. Gọi action để gửi code cho back-end
      handleGoogleLogin(code);
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Đang xử lý đăng nhập...</p>
    </div>
  );
}
