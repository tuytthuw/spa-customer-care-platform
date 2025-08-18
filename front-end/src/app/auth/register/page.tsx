// src/app/auth/register/page.tsx
import { RegisterForm } from "@/components/screens/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="block text-2xl font-bold">Tạo Tài Khoản</h1>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
