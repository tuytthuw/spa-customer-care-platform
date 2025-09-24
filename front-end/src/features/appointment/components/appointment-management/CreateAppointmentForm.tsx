"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/features/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/features/shared/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/features/shared/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

// ✅ BƯỚC 1: IMPORT CÁC HOOKS VÀ TYPES THẬT
import { useCustomers } from "@/features/customer/hooks/useCustomers";
import { useServices } from "@/features/service/hooks/useServices";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import { useResources } from "@/features/resource/hooks/useResources";
import { FullCustomerProfile } from "@/features/customer/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types";

// --- Form Schema (Updated) ---
const appointmentFormSchema = z.object({
  customerId: z.string().min(1, { message: "Vui lòng chọn một khách hàng." }),
  serviceId: z.string().min(1, { message: "Vui lòng chọn một dịch vụ." }),
  technicianId: z.string().optional(),
  resourceId: z.string().optional(),
});
type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

// --- Component Props ---
interface CreateAppointmentFormProps {
  selectedDate: Date;
  onFormSubmit: (
    data: AppointmentFormValues & { date: string; status: string }
  ) => void; // ✅ Sửa kiểu dữ liệu của onFormSubmit
  onClose: () => void;
}

export default function CreateAppointmentForm({
  selectedDate,
  onFormSubmit,
  onClose,
}: CreateAppointmentFormProps) {
  const [openCustomerSearch, setOpenCustomerSearch] = useState(false);

  // ✅ BƯỚC 2: GỌI CÁC HOOKS ĐỂ LẤY DỮ LIỆU THẬT
  const { data: customers = [] } = useCustomers();
  const { data: services = [] } = useServices();
  const { data: staff = [] } = useStaffs();
  const { data: resources = [] } = useResources();

  const technicians = staff.filter((s) => s.role === "technician");

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      customerId: "",
      serviceId: "",
    },
  });

  function onSubmit(data: AppointmentFormValues) {
    const finalData = {
      ...data,
      date: selectedDate.toISOString(),
      status: "upcoming",
    };
    onFormSubmit(finalData);
    onClose();
  }

  const rooms = resources.filter((r) => r.type === "room");
  const equipments = resources.filter((r) => r.type === "equipment");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        {/* Customer Search ComboBox */}
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tìm kiếm khách hàng</FormLabel>
              <Popover
                open={openCustomerSearch}
                onOpenChange={setOpenCustomerSearch}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? customers.find(
                            (customer: FullCustomerProfile) =>
                              customer.id === field.value // ✅ Thêm kiểu dữ liệu
                          )?.name
                        : "Chọn khách hàng..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[550px] p-0">
                  <Command>
                    <CommandInput placeholder="Tìm theo tên hoặc SĐT..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy khách hàng.</CommandEmpty>
                      <CommandGroup>
                        {customers.map(
                          (
                            customer: FullCustomerProfile // ✅ Thêm kiểu dữ liệu
                          ) => (
                            <CommandItem
                              value={customer.name}
                              key={customer.id}
                              onSelect={() => {
                                form.setValue("customerId", customer.id);
                                setOpenCustomerSearch(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  customer.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {customer.name} - {customer.phone}
                            </CommandItem>
                          )
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Service Select */}
        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dịch vụ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn một dịch vụ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.map(
                    (
                      service: Service // ✅ Thêm kiểu dữ liệu
                    ) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="technicianId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kỹ thuật viên</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Tự sắp xếp" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {technicians.map(
                      (
                        tech: Staff // ✅ Thêm kiểu dữ liệu
                      ) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resourceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phòng/Thiết bị</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Không chọn" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rooms.length > 0 && (
                      <FormLabel className="px-2 py-1.5 text-xs">
                        Phòng/Giường
                      </FormLabel>
                    )}
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                    {equipments.length > 0 && (
                      <FormLabel className="px-2 py-1.5 text-xs">
                        Thiết bị
                      </FormLabel>
                    )}
                    {equipments.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit">Tạo lịch hẹn</Button>
        </div>
      </form>
    </Form>
  );
}
