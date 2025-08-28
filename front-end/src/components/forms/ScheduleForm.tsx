"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkSchedule } from "@/types/work-schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ScheduleFormProps {
  initialData: WorkSchedule;
}

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
const dayLabels: Record<(typeof daysOfWeek)[number], string> = {
  monday: "Thứ Hai",
  tuesday: "Thứ Ba",
  wednesday: "Thứ Tư",
  thursday: "Thứ Năm",
  friday: "Thứ Sáu",
  saturday: "Thứ Bảy",
  sunday: "Chủ Nhật",
};

export default function ScheduleForm({ initialData }: ScheduleFormProps) {
  const form = useForm({
    defaultValues: {
      schedule: daysOfWeek.map((day) => initialData.schedule[day]),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "schedule",
  });

  function onSubmit(data: any) {
    // Chuyển đổi dữ liệu mảng trở lại thành object
    const finalSchedule: WorkSchedule["schedule"] = daysOfWeek.reduce(
      (acc, day, index) => {
        acc[day] = data.schedule[index];
        return acc;
      },
      {} as WorkSchedule["schedule"]
    );

    console.log("Lịch làm việc đã lưu:", {
      staffId: initialData.staffId,
      schedule: finalSchedule,
    });
    toast.success("Cập nhật lịch làm việc thành công!");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cấu hình lịch làm việc</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fields.map((field, index) => {
              const dayKey = daysOfWeek[index];
              return (
                <div
                  key={field.id}
                  className="grid grid-cols-4 items-center gap-4 p-4 border rounded-md"
                >
                  <FormField
                    control={form.control}
                    name={`schedule.${index}.isActive`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0 font-semibold">
                          {dayLabels[dayKey]}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`schedule.${index}.startTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            disabled={!form.watch(`schedule.${index}.isActive`)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`schedule.${index}.endTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            disabled={!form.watch(`schedule.${index}.isActive`)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}
            <div className="flex justify-end pt-4">
              <Button type="submit">Lưu Lịch làm việc</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
