"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegisterScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: any) => void;
}

const daysOfWeek = [
  { key: "monday", name: "Thứ Hai" },
  { key: "tuesday", name: "Thứ Ba" },
  { key: "wednesday", name: "Thứ Tư" },
  { key: "thursday", name: "Thứ Năm" },
  { key: "friday", name: "Thứ Sáu" },
  { key: "saturday", name: "Thứ Bảy" },
  { key: "sunday", name: "Chủ Nhật" },
];

const shiftOptions = {
  off: { name: "Nghỉ", isActive: false, startTime: "", endTime: "" },
  morning: {
    name: "Ca Sáng (8h-12h)",
    isActive: true,
    startTime: "08:00",
    endTime: "12:00",
  },
  afternoon: {
    name: "Ca Chiều (13h-17h)",
    isActive: true,
    startTime: "13:00",
    endTime: "17:00",
  },
  full: {
    name: "Cả ngày (8h-17h)",
    isActive: true,
    startTime: "08:00",
    endTime: "17:00",
  },
} as const;

type ShiftKey = keyof typeof shiftOptions;

// --- SỬA LỖI Ở ĐÂY: ĐỊNH NGHĨA TYPE CHO SCHEDULE STATE ---
type ScheduleState = {
  [key: string]: ShiftKey;
};

export const RegisterScheduleModal = ({
  isOpen,
  onClose,
  onSave,
}: RegisterScheduleModalProps) => {
  const [schedule, setSchedule] = useState<ScheduleState>(() => {
    const initialState: ScheduleState = {};
    daysOfWeek.forEach((day) => (initialState[day.key] = "off"));
    return initialState;
  });

  const handleShiftChange = (dayKey: string, shiftKey: ShiftKey) => {
    // Thêm (prev: ScheduleState) để định nghĩa kiểu cho 'prev'
    setSchedule((prev: ScheduleState) => ({ ...prev, [dayKey]: shiftKey }));
  };

  const handleSave = () => {
    const finalSchedule = {
      schedule: Object.entries(schedule).reduce((acc, [day, shift]) => {
        acc[day] = shiftOptions[shift as ShiftKey];
        return acc;
      }, {} as any),
    };
    onSave(finalSchedule);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Đăng ký lịch làm việc tuần tới</DialogTitle>
          <DialogDescription>
            Chọn ca làm việc mong muốn cho từng ngày. Yêu cầu sẽ được gửi đến
            quản lý để phê duyệt.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {daysOfWeek.map((day) => (
            <div key={day.key} className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={day.key} className="col-span-1">
                {day.name}
              </Label>
              <Select
                onValueChange={(value: ShiftKey) =>
                  handleShiftChange(day.key, value)
                }
                defaultValue={schedule[day.key]}
              >
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Chọn ca" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(shiftOptions).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Gửi đăng ký</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
