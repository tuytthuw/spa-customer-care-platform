"use client";

import { useState } from "react";
import { mockStaff, mockWorkSchedules } from "@/lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ScheduleForm from "@/components/screens/work-schedule-management/ScheduleForm";
import { WorkSchedule } from "@/types/work-schedule";

export default function WorkScheduleManagementPage() {
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const selectedSchedule = mockWorkSchedules.find(
    (s) => s.staffId === selectedStaffId
  );

  // Tạo lịch mặc định cho nhân viên chưa có lịch
  const defaultSchedule: WorkSchedule = {
    staffId: selectedStaffId || "",
    schedule: {
      monday: { isActive: false, startTime: "09:00", endTime: "18:00" },
      tuesday: { isActive: false, startTime: "09:00", endTime: "18:00" },
      wednesday: { isActive: false, startTime: "09:00", endTime: "18:00" },
      thursday: { isActive: false, startTime: "09:00", endTime: "18:00" },
      friday: { isActive: false, startTime: "09:00", endTime: "18:00" },
      saturday: { isActive: false, startTime: "09:00", endTime: "18:00" },
      sunday: { isActive: false, startTime: "09:00", endTime: "18:00" },
    },
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cấu hình Lịch làm việc</h1>
      </div>
      <div className="mb-8 max-w-sm">
        <label className="block text-sm font-medium mb-2">Chọn nhân viên</label>
        <Select onValueChange={setSelectedStaffId}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn một nhân viên để cấu hình..." />
          </SelectTrigger>
          <SelectContent>
            {mockStaff.map((staff) => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.name} ({staff.role})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedStaffId && (
        <ScheduleForm initialData={selectedSchedule || defaultSchedule} />
      )}
    </div>
  );
}
