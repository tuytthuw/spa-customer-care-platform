// src/app/auth/verify-otp/page.tsx

import { OtpForm } from "@/components/screens/auth/otp-form";

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <OtpForm />
    </div>
  );
}
