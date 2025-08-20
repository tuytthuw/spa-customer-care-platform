// src/lib/mock-data.ts
import { Service } from "@/types/service";

export const mockServices: Service[] = [
  {
    id: "1",
    name: "Chăm sóc da mặt chuyên sâu",
    description:
      "Liệu trình làm sạch, tẩy tế bào chết, massage và đắp mặt nạ, giúp da sáng khỏe và mịn màng.",
    price: 500000,
    duration: 60,
    category: "Chăm sóc da",
    imageUrl: "/images/service-1.jpg", // Bạn cần chuẩn bị vài ảnh mẫu trong public/images
  },
  {
    id: "2",
    name: "Massage thư giãn toàn thân",
    description:
      "Sử dụng tinh dầu thiên nhiên kết hợp các động tác massage chuyên nghiệp giúp giảm căng thẳng, mệt mỏi.",
    price: 700000,
    duration: 90,
    category: "Massage",
    imageUrl: "/images/service-2.jpg",
  },
  {
    id: "3",
    name: "Triệt lông công nghệ cao",
    description:
      "Công nghệ Diode Laser an toàn và hiệu quả, giúp loại bỏ lông không mong muốn và làm sáng vùng da.",
    price: 1200000,
    duration: 45,
    category: "Triệt lông",
    imageUrl: "/images/service-3.jpg",
  },
  // Thêm các dịch vụ khác nếu bạn muốn
];
