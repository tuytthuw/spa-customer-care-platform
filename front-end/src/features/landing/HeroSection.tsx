import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-white">
      {/* Lớp phủ màu tối để làm nổi bật chữ */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      {/* Ảnh nền */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-background.jpg')" }}
      ></div>

      {/* Nội dung */}
      <div className="relative z-20 text-center p-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-4">
          Nơi Vẻ Đẹp & Sự Thư Giãn Hội Tụ
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Hãy để chúng tôi chăm sóc bạn bằng những liệu pháp tốt nhất, mang lại
          sự tươi mới cho cả cơ thể và tâm hồn.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/booking">Đặt Lịch Ngay</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
          >
            <Link href="/services">Xem Dịch Vụ</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
