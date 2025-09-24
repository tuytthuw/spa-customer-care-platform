import { Button } from "@/features/shared/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[calc(100vh-4rem)] w-full flex items-center justify-center text-center text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-50"
        style={{ backgroundImage: "url('/images/hero-background.jpg')" }}
      />

      {/* Content */}
      <div className="relative z-10 p-4 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
          Nơi Vẻ Đẹp & Sự Thư Giãn Hội Tụ
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/90">
          Hãy để chúng tôi chăm sóc bạn bằng những liệu pháp tốt nhất, mang lại
          sự tươi mới cho cả cơ thể và tâm hồn.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg" className="px-8 py-6 text-base">
            <Link href="/booking">Đặt Lịch Ngay</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="px-8 py-6 text-base bg-transparent border-white text-white hover:bg-white hover:text-primary"
          >
            <Link href="/services">Khám Phá Dịch Vụ</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
