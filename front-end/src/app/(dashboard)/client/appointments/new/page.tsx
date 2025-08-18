"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import { SERVICES } from "@/features/services/seed";
import { useAuth } from "@/providers/auth-context";
import { useAppointments } from "@/features/appointments/store";
import { ymd, toIso, addMinIso } from "@/lib/dt";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { CalendarIcon, Clock } from "lucide-react";

// Nếu dự án bạn chưa có util cn, dùng hàm cx đơn giản thay thế:
const cx = (...c: Array<string | false | undefined>) =>
  c.filter(Boolean).join(" ");

const schema = z.object({
  date: z.string(), // yyyy-MM-dd
  time: z.string(), // HH:mm
  serviceId: z.string().min(1, "Chọn dịch vụ"),
});
type FormValues = z.infer<typeof schema>;

export default function ClientNewAppointmentPage() {
  const { user } = useAuth();
  const add = useAppointments((s) => s.add); // lấy state thô, không filter ở đây
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: ymd(new Date()),
      time: "09:00",
      serviceId: SERVICES[0]?.id ?? "",
    },
    mode: "onBlur",
  });

  if (!user) return <div className="p-4">Vui lòng đăng nhập.</div>;

  const onSubmit = (data: FormValues) => {
    const svc = SERVICES.find((s) => s.id === data.serviceId)!;
    const start = toIso(new Date(`${data.date}T${data.time}:00`));
    const end = addMinIso(start, svc.durationMin);

    add({
      serviceId: svc.id,
      serviceName: svc.name,
      start,
      end,
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
    });

    router.push("/client/appointments/my");
  };

  return (
    <div className="space-y-4 max-w-lg">
      <h1 className="text-2xl font-semibold">Đặt lịch</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ngày */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Ngày <span className="text-red-500">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className={cx(
                            "justify-start",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? field.value : "Chọn ngày"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(d) =>
                          field.onChange(d ? format(d, "yyyy-MM-dd") : "")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Giờ */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Giờ <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                    <FormControl>
                      <Input
                        type="time"
                        step={60}
                        className="pl-9"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Dịch vụ */}
          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Dịch vụ <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn dịch vụ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SERVICES.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} — {s.durationMin} phút
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            Tạo lịch
          </Button>
        </form>
      </Form>
    </div>
  );
}
