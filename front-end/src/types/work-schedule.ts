export interface DaySchedule {
  isActive: boolean;
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "18:00"
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
}
