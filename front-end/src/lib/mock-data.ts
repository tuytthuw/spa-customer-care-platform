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
import { Technician } from "@/types/technician";

export const mockTechnicians: Technician[] = [
  {
    id: "tech-1",
    name: "Nguyễn Thu An",
    specialty: "Chăm sóc da mặt",
    avatarUrl: "/images/avatars/avatar-1.jpg",
  },
  {
    id: "tech-2",
    name: "Trần Minh Huy",
    specialty: "Massage trị liệu",
    avatarUrl: "/images/avatars/avatar-2.jpg",
  },
  {
    id: "tech-3",
    name: "Lê Ngọc Bích",
    specialty: "Triệt lông & Laser",
    avatarUrl: "/images/avatars/avatar-3.jpg",
  },
];

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
