// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContexts"; // 1. Import AuthProvider
import Link from "next/link";
import Header from "@/components/layout/Header"; // Import component Header

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MySpa - Chăm sóc sắc đẹp",
  description: "Nền tảng chăm sóc khách hàng spa chuyên nghiệp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
