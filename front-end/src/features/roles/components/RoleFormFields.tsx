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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FEATURES, Permission } from "@/features/roles/types";

// Labels cho các tính năng để hiển thị trên UI
const featureLabels: Record<keyof typeof FEATURES, string> = {
  dashboard: "Bảng điều khiển",
  appointments: "Quản lý Lịch hẹn",
  customers: "Quản lý Khách hàng",
  staff: "Quản lý Nhân viên",
  services: "Dịch vụ & Liệu trình",
  products: "Sản phẩm",
  categories: "Danh mục",
  resources: "Phòng & Thiết bị",
  schedules: "Lịch làm việc",
  reports: "Báo cáo",
  users: "Tài khoản người dùng",
  roles: "Phân quyền",
  treatments: "Liệu trình (Khách hàng)",
  reviews: "Đánh giá (Khách hàng)",
  profile: "Hồ sơ cá nhân",
};

export default function RoleFormFields() {
  const { control, setValue } = useFormContext();

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên vai trò</FormLabel>
            <FormControl>
              <Input placeholder="VD: Quản lý chi nhánh" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Textarea placeholder="Mô tả ngắn về vai trò này..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator className="my-4" />
      <h3 className="text-lg font-medium mb-2">Phân quyền chi tiết</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Chọn các quyền hạn cho vai trò này. Quyền &quot;Thao tác&quot; sẽ bao
        gồm cả quyền &quot;Xem&quot;.
      </p>

      <div className="space-y-4">
        {Object.entries(featureLabels).map(([key, label]) => (
          <div key={key} className="border p-4 rounded-md">
            <h4 className="font-semibold mb-3">{label}</h4>
            <div className="flex items-center gap-8">
              <FormField
                control={control}
                name={`permissions.${key.toLowerCase()}`}
                render={({ field }) => (
                  <>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes("read")}
                          onCheckedChange={(checked) => {
                            const currentPermissions = field.value || [];
                            let newPermissions: Permission[];
                            if (checked) {
                              newPermissions = [...currentPermissions, "read"];
                            } else {
                              // Nếu bỏ quyền đọc, cũng bỏ luôn quyền ghi
                              newPermissions = [];
                            }
                            setValue(
                              `permissions.${key.toLowerCase()}`,
                              Array.from(new Set(newPermissions))
                            );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Xem</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes("write")}
                          onCheckedChange={(checked) => {
                            const currentPermissions = field.value || [];
                            let newPermissions: Permission[];
                            if (checked) {
                              // Nếu có quyền ghi, tự động có quyền đọc
                              newPermissions = [
                                ...currentPermissions,
                                "read",
                                "write",
                              ];
                            } else {
                              newPermissions = currentPermissions.filter(
                                (p: string) => p !== "write"
                              );
                            }
                            setValue(
                              `permissions.${key.toLowerCase()}`,
                              Array.from(new Set(newPermissions))
                            );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Thao tác</FormLabel>
                    </FormItem>
                  </>
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
