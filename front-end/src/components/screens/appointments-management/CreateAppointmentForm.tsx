"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { mockCustomers, mockServices, mockTechnicians } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

// --- Form Schema (Updated) ---
const appointmentFormSchema = z.object({
  customerId: z.string().min(1, { message: "Vui lòng chọn một khách hàng." }),
  serviceId: z.string().min(1, { message: "Vui lòng chọn một dịch vụ." }),
  technicianId: z.string().optional(),
});
type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

// --- Component Props ---
interface CreateAppointmentFormProps {
  selectedDate: Date;
  onFormSubmit: (data: any) => void;
  onClose: () => void;
}

export default function CreateAppointmentForm({
  selectedDate,
  onFormSubmit,
  onClose,
}: CreateAppointmentFormProps) {
  const [openCustomerSearch, setOpenCustomerSearch] = useState(false);

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
                        ? mockCustomers.find(
                            (customer) => customer.id === field.value
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
                        {mockCustomers.map((customer) => (
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
                        ))}
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
                  {mockServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Technician Select */}
        <FormField
          control={form.control}
          name="technicianId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kỹ thuật viên (Tùy chọn)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Hệ thống tự sắp xếp" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockTechnicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
