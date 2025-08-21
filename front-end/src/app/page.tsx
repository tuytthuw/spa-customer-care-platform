import FeaturedServices from "@/components/screens/landing/FeaturedServices";
import HeroSection from "@/components/screens/landing/HeroSection";
import TestimonialsSection from "@/components/screens/landing/TestimonialsSection";

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
