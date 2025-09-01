export interface DaySchedule {
  isActive: boolean;
  startTime: string;
  endTime: string;
}

export interface WorkSchedule {
  staffId: string;
  schedule: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  };
  // Thêm các trường mới để quản lý đăng ký
  weekOf?: string; // Ví dụ: "2025-08-25" (Ngày đầu tuần)
  status?: "pending" | "approved" | "rejected";
}

// kiểu dữ liệu cho form đăng ký lịch
export type ScheduleRegistrationData = {
  schedule: {
    [key: string]: DaySchedule;
  };
};
