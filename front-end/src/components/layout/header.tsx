import Link from "next/link";

export const Header = () => {
  return (
    <header className="border-b">
      <div className="container h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg">
          SPA System
        </Link>

        {/* Navigation */}
        <nav>{/* Chúng ta sẽ thêm các link điều hướng ở đây sau */}</nav>

        {/* Auth Buttons */}
        <div>{/* Nút Đăng nhập / Đăng ký sẽ ở đây */}</div>
      </div>
    </header>
  );
};
