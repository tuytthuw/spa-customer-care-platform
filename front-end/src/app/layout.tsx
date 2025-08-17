import ClientProviders from "@/app/provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
