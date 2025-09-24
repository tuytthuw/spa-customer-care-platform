// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContexts"; // 1. Import AuthProvider
import ReactQueryProvider from "@/features/shared/providers/ReactQueryProvider"; // 1. Import provider mới
import { Toaster } from "@/features/shared/components/ui/sonner";
import { ThemeProvider } from "@/features/shared/providers/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <AuthProvider>
              <main>{children}</main>
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
