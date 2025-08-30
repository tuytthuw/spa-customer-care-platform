// src/app/auth/login/page.tsx
import { LoginForm } from "@/features/auth/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="block text-2xl font-bold">Đăng Nhập</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
