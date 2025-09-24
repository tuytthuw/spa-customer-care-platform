import { Card, CardContent } from "@/features/shared/components/ui/card";
import Image from "next/image";

const testimonials = [
  {
    name: "Chị Minh Anh",
    quote:
      "Không gian ở đây thật tuyệt vời, rất thư giãn. Kỹ thuật viên tay nghề cao, mình rất hài lòng với dịch vụ chăm sóc da.",
    avatar: "/images/avatars/avatar-1.jpg",
  },
  {
    name: "Anh Quốc Bảo",
    quote:
      "Mình đã sử dụng dịch vụ massage vai gáy và cảm thấy đỡ mỏi hẳn. Chắc chắn sẽ quay lại thường xuyên.",
    avatar: "/images/avatars/avatar-2.jpg",
  },
  {
    name: "Chị Lan Phương",
    quote:
      "Dịch vụ triệt lông rất hiệu quả và không hề đau rát. Nhân viên tư vấn nhiệt tình, chu đáo. 10 điểm!",
    avatar: "/images/avatars/avatar-3.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <p className="text-muted-foreground mt-2">
            Lắng nghe những chia sẻ chân thực từ những khách hàng đã trải
            nghiệm.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 text-center">
              <CardContent>
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="rounded-full mx-auto mb-4"
                />
                <p className="text-muted-foreground italic mb-4">
                  "{testimonial.quote}"
                </p>
                <p className="font-semibold">{testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
