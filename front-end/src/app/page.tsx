import FeaturedServices from "@/components/screens/langding/HeroSection";
import HeroSection from "@/components/screens/langding/FeaturedServices";
import TestimonialsSection from "@/components/screens/langding/TestimonialsSection";

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
