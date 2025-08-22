import FeaturedServices from "@/features/landing/FeaturedServices";
import HeroSection from "@/features/landing/HeroSection";
import TestimonialsSection from "@/features/landing/TestimonialsSection";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedServices />
      <TestimonialsSection />
      {/* Bạn có thể thêm các section khác ở đây, ví dụ: Về chúng tôi, Thư viện ảnh,... */}
    </div>
  );
}
