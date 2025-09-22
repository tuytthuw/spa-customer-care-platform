import FeaturedServices from "@/features/landing/components/FeaturedServices";
import HeroSection from "@/features/landing/components/HeroSection";
import TestimonialsSection from "@/features/landing/components/TestimonialsSection";
import WhyChooseUs from "@/features/landing/components/WhyChooseUs";

export default function HomePage() {
  return (
    <div>
      <FeaturedServices />
      <WhyChooseUs />
      <TestimonialsSection />
      {/* Trong tương lai, bạn có thể thêm các section khác như:
        <FeaturedProducts />
        <BookingCTA /> 
      */}
    </div>
  );
}
