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

export const mockAppointments = [
  {
    id: "1",
    serviceName: "Chăm sóc da mặt chuyên sâu",
    customerName: "Nguyễn Văn A", // Thêm tên khách hàng
    technician: "Trần Thị B",
    technicianId: "tech-01", // Thêm ID kỹ thuật viên
    date: "2025-09-15",
    time: "14:00",
    status: "completed",
  },
  {
    id: "2",
    serviceName: "Massage thư giãn toàn thân",
    customerName: "Lê Thị C", // Thêm tên khách hàng
    technician: "Trần Thị B",
    technicianId: "tech-01", // Thêm ID kỹ thuật viên
    date: "2025-09-20",
    time: "10:30",
    status: "upcoming",
  },
  {
    id: "3",
    serviceName: "Triệt lông công nghệ cao",
    customerName: "Phạm Văn D", // Thêm tên khách hàng
    technician: "Nguyễn Văn E",
    technicianId: "tech-02", // Kỹ thuật viên khác
    date: "2025-09-20",
    time: "11:30",
    status: "upcoming",
  },
  // Thêm một vài lịch hẹn nữa cho ngày 20 để danh sách dài hơn
  {
    id: "4",
    serviceName: "Chăm sóc móng tay",
    customerName: "Đặng Thị F",
    technician: "Trần Thị B",
    technicianId: "tech-01",
    date: "2025-09-20",
    time: "14:00",
    status: "upcoming",
  },
];
