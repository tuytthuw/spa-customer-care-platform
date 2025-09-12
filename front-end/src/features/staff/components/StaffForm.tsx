"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Service } from "@/features/service/types";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface StaffFormFieldsProps {
  services: Service[];
}

export default function StaffFormFields({ services }: StaffFormFieldsProps) {
  const { control, watch } = useFormContext();
  const selectedRole = watch("role");

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Họ và tên</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Số điện thoại</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vai trò</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò cho nhân viên" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="technician">Kỹ thuật viên</SelectItem>
                <SelectItem value="receptionist">Lễ tân</SelectItem>
                <SelectItem value="manager">Quản lý</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {selectedRole === "technician" && (
        <FormField
          control={control}
          name="serviceIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">
                  Các dịch vụ có thể thực hiện
                </FormLabel>
              </div>
              <div className="space-y-2">
                {services.map((service) => (
                  <FormField
                    key={service.id}
                    control={control}
                    name="serviceIds"
                    render={({ field }) => (
                      <FormItem
                        key={service.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(service.id)}
                            onCheckedChange={(checked) => {
                              const currentIds = field.value || [];
                              return checked
                                ? field.onChange([...currentIds, service.id])
                                : field.onChange(
                                    currentIds.filter(
                                      (value: string) => value !== service.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {service.name}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={control}
        name="avatar"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ảnh đại diện (Tùy chọn)</FormLabel>
            <FormControl>
              <ImageUploader onFileSelect={(file) => field.onChange(file)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
