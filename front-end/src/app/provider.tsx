"use client";
import { AuthProvider } from "@/providers/auth-context";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
