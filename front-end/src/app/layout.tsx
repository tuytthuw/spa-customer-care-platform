// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContexts"; // 1. Import AuthProvider
import ReactQueryProvider from "@/components/providers/ReactQueryProvider"; // 1. Import provider mới
import { Toaster } from "@/components/ui/sonner";

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
        <ReactQueryProvider>
          {" "}
          {/* 2. Bọc ngoài cùng */}
          <AuthProvider>
            <main>{children}</main>
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
