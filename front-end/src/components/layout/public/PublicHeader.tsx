"use client";

import Link from "next/link";
import {
  Sparkles,
  Menu,
  ShoppingCart,
  LogIn,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContexts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useCart, { CartItem } from "@/stores/cart-store"; // Sửa import
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator"; // Thêm import
import { ThemeToggle } from "@/components/common/ThemeToggle";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/services", label: "Dịch vụ" },
  { href: "/treatment-plans", label: "Liệu trình" },
  { href: "/products", label: "Sản phẩm" },
  { href: "/promotions", label: "Khuyến mãi" },
  { href: "/about", label: "Về chúng tôi" },
];

export default function PublicHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { items } = useCart();
  // Sửa lỗi typing cho reduce
  const cartItemCount = items.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );

  const renderNavLinks = (isMobile: boolean = false) =>
    navLinks.map((link) => {
      const isActive =
        link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
      const linkClass = cn(
        "transition-colors hover:text-primary",
        isActive ? "text-primary font-semibold" : "text-muted-foreground",
        isMobile && "block w-full text-left p-2 rounded-md hover:bg-muted"
      );

      if (isMobile) {
        return (
          <SheetClose asChild key={link.href}>
            <Link href={link.href} className={linkClass}>
              {link.label}
            </Link>
          </SheetClose>
        );
      }
      return (
        <Link key={link.href} href={link.href} className={linkClass}>
          {link.label}
        </Link>
      );
    });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Sparkles className="text-primary text-2xl mr-2" />
          <h1 className="text-xl font-bold">Serenity Spa</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {renderNavLinks()}
        </nav>

        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-primary" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {cartItemCount}
              </span>
            )}
          </Link>

          <ThemeToggle />

          {/* User/Auth Buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      {/* Sửa lỗi property 'avatar' */}
                      <AvatarImage
                        src={user.avatar || "/images/avatars/default.png"}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback>
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Trang điều khiển</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">
                    <LogIn className="mr-2 h-4 w-4" /> Đăng nhập
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">
                    <UserPlus className="mr-2 h-4 w-4" /> Đăng ký
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Mở menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {renderNavLinks(true)}
                  {!user && (
                    <>
                      <Separator />
                      <SheetClose asChild>
                        <Link href="/auth/login">
                          <Button variant="outline" className="w-full">
                            <LogIn className="mr-2 h-4 w-4" /> Đăng nhập
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/auth/register">
                          <Button className="w-full">
                            <UserPlus className="mr-2 h-4 w-4" /> Đăng ký
                          </Button>
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
