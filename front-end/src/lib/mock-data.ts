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

// src/lib/mock-data.ts (thêm vào cuối file)

// src/lib/mock-data.ts (thêm vào cuối file)
import { Appointment } from "@/types/appointment";

export const mockAppointments: Appointment[] = [
  {
    id: "appt-1",
    serviceId: "1", // Chăm sóc da mặt chuyên sâu
    technicianId: "tech-1",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 ngày nữa
    status: "upcoming",
  },
  {
    id: "appt-2",
    serviceId: "2", // Massage thư giãn toàn thân
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 tuần nữa
    status: "upcoming",
  },
  {
    id: "appt-3",
    serviceId: "3", // Triệt lông
    technicianId: "tech-3",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 ngày trước
    status: "completed",
  },
  {
    id: "appt-4",
    serviceId: "1",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 ngày trước
    status: "cancelled",
  },
];

// src/lib/mock-data.ts (thêm vào cuối file)
export const mockUser = {
  id: "user-1",
  name: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  phone: "0987654321",
};

// src/lib/mock-data.ts (thêm vào cuối file)
import { Customer } from "@/types/customer";

export const mockCustomers: Customer[] = [
  {
    id: "cus-1",
    name: "Trần Thị Bích Hằng",
    email: "bichhang@example.com",
    phone: "0912345678",
    totalAppointments: 5,
    lastVisit: "2025-08-15T14:00:00.000Z",
  },
  {
    id: "cus-2",
    name: "Lê Minh Tuấn",
    email: "minhtuan@example.com",
    phone: "0987654321",
    totalAppointments: 2,
    lastVisit: "2025-08-18T10:30:00.000Z",
  },
  {
    id: "cus-3",
    name: "Phạm Hoài An",
    email: "hoaian@example.com",
    phone: "0905112233",
    totalAppointments: 8,
    lastVisit: "2025-07-30T16:00:00.000Z",
  },
  {
    id: "cus-4",
    name: "Võ Hoàng Yến",
    email: "hoangyen@example.com",
    phone: "0934567890",
    totalAppointments: 1,
    lastVisit: "2025-08-20T09:00:00.000Z",
  },
];

import { Staff } from "@/types/staff";

export const mockStaff: Staff[] = [
  {
    id: "tech-1",
    name: "Nguyễn Thu An",
    email: "thuan@myspa.com",
    phone: "0911223344",
    role: "technician",
    status: "active",
    password: "password",
  },
  {
    id: "tech-2",
    name: "Trần Minh Huy",
    email: "minhhuy@myspa.com",
    phone: "0922334455",
    role: "technician",
    status: "active",
    password: "password",
  },
  {
    id: "rec-1",
    name: "Phạm Kiều Trang",
    email: "kieutrang@myspa.com",
    phone: "0933445566",
    role: "receptionist",
    status: "active",
    password: "password",
  },
  {
    id: "mana-1",
    name: "Lê Anh Tuấn",
    email: "anhtuan@myspa.com",
    phone: "0944556677",
    role: "manager",
    status: "inactive",
    password: "password",
  },
];

import { WorkSchedule } from "@/types/work-schedule";

export const mockWorkSchedules: WorkSchedule[] = [
  {
    staffId: "tech-1",
    schedule: {
      monday: { isActive: true, startTime: "09:00", endTime: "18:00" },
      tuesday: { isActive: true, startTime: "09:00", endTime: "18:00" },
      wednesday: { isActive: true, startTime: "09:00", endTime: "18:00" },
      thursday: { isActive: false, startTime: "", endTime: "" },
      friday: { isActive: true, startTime: "09:00", endTime: "18:00" },
      saturday: { isActive: true, startTime: "10:00", endTime: "19:00" },
      sunday: { isActive: false, startTime: "", endTime: "" },
    },
  },
  {
    staffId: "tech-2",
    schedule: {
      monday: { isActive: false, startTime: "", endTime: "" },
      tuesday: { isActive: true, startTime: "10:00", endTime: "19:00" },
      wednesday: { isActive: true, startTime: "10:00", endTime: "19:00" },
      thursday: { isActive: true, startTime: "10:00", endTime: "19:00" },
      friday: { isActive: true, startTime: "10:00", endTime: "19:00" },
      saturday: { isActive: false, startTime: "", endTime: "" },
      sunday: { isActive: true, startTime: "10:00", endTime: "17:00" },
    },
  },
];

import { TreatmentPackage } from "@/types/treatment";

export const mockTreatmentPackages: TreatmentPackage[] = [
  {
    id: "tp-1",
    customerId: "user-1", // ID của mockUser
    serviceId: "1", // Chăm sóc da mặt chuyên sâu
    totalSessions: 10,
    completedSessions: 4,
    purchaseDate: "2025-07-15T10:00:00.000Z",
    sessions: [
      {
        id: "s1",
        date: "2025-07-20T14:00:00.000Z",
        technicianId: "tech-1",
        notes: "Buổi 1 ok.",
        status: "completed",
      },
      {
        id: "s2",
        date: "2025-07-27T14:00:00.000Z",
        technicianId: "tech-1",
        notes: "Da có cải thiện.",
        status: "completed",
      },
      {
        id: "s3",
        date: "2025-08-03T14:00:00.000Z",
        technicianId: "tech-2",
        notes: "Khách hàng hài lòng.",
        status: "completed",
      },
      {
        id: "s4",
        date: "2025-08-10T14:00:00.000Z",
        technicianId: "tech-1",
        notes: "",
        status: "completed",
      },
      {
        id: "s5",
        date: "2025-08-17T14:00:00.000Z",
        technicianId: "tech-1",
        notes: "",
        status: "upcoming",
      },
    ],
  },
  {
    id: "tp-2",
    customerId: "user-1",
    serviceId: "3", // Triệt lông công nghệ cao
    totalSessions: 8,
    completedSessions: 2,
    purchaseDate: "2025-08-01T11:30:00.000Z",
    sessions: [
      {
        id: "s6",
        date: "2025-08-05T10:00:00.000Z",
        technicianId: "tech-2",
        notes: "Buổi đầu tiên.",
        status: "completed",
      },
      {
        id: "s7",
        date: "2025-08-19T10:00:00.000Z",
        technicianId: "tech-2",
        notes: "",
        status: "completed",
      },
      {
        id: "s8",
        date: "2025-09-02T10:00:00.000Z",
        technicianId: "tech-2",
        notes: "",
        status: "upcoming",
      },
    ],
  },
];

import { Product } from "@/types/product";

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Serum dưỡng ẩm Hyaluronic Acid",
    price: 750000,
    stock: 50,
    imageUrl: "/images/product-1.jpg",
  },
  {
    id: "prod-2",
    name: "Kem chống nắng SPF 50+",
    price: 550000,
    stock: 100,
    imageUrl: "/images/product-2.jpg",
  },
  {
    id: "prod-3",
    name: "Mặt nạ đất sét làm sạch sâu",
    price: 450000,
    stock: 75,
    imageUrl: "/images/product-3.jpg",
  },
];

import { Conversation } from "@/types/conversation";

export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    customerId: "cus-1", // Trần Thị Bích Hằng
    lastMessage: "Chào bạn, mình muốn hỏi về liệu trình triệt lông.",
    lastMessageTimestamp: new Date().toISOString(),
    isRead: false,
    messages: [
      {
        id: "msg-1",
        sender: "bot",
        text: "Xin chào! Tôi có thể giúp gì cho bạn?",
        timestamp: "2025-08-25T10:00:00Z",
      },
      {
        id: "msg-2",
        sender: "customer",
        text: "Chào bạn, mình muốn hỏi về liệu trình triệt lông.",
        timestamp: "2025-08-25T10:01:00Z",
      },
    ],
  },
  {
    id: "conv-2",
    customerId: "cus-2", // Lê Minh Tuấn
    lastMessage: "Cảm ơn bạn nhiều nhé!",
    lastMessageTimestamp: "2025-08-24T15:30:00Z",
    isRead: true,
    messages: [
      {
        id: "msg-3",
        sender: "customer",
        text: "Lịch hẹn của tôi đã được xác nhận chưa?",
        timestamp: "2025-08-24T15:28:00Z",
      },
      {
        id: "msg-4",
        sender: "staff",
        text: "Chào anh Tuấn, lịch hẹn của mình đã được xác nhận ạ.",
        timestamp: "2025-08-24T15:29:00Z",
      },
      {
        id: "msg-5",
        sender: "customer",
        text: "Cảm ơn bạn nhiều nhé!",
        timestamp: "2025-08-24T15:30:00Z",
      },
    ],
  },
];
