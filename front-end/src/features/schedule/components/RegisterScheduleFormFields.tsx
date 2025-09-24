"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/features/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
} from "@/features/shared/components/ui/form";

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
  off: { name: "Nghỉ" },
  morning: { name: "Ca Sáng (8h-12h)" },
  afternoon: { name: "Ca Chiều (13h-17h)" },
  full: { name: "Cả ngày (8h-17h)" },
} as const;

export default function RegisterScheduleFormFields() {
  const { control } = useFormContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {daysOfWeek.map((day) => (
        <FormField
          control={control}
          name={`schedule.${day.key}`}
          key={day.key}
          render={({ field }) => (
            <FormItem className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={day.key} className="col-span-1">
                {day.name}
              </Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="col-span-2">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ca" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(shiftOptions).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
