"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/shared/components/ui/tabs";
import ScheduleForm from "@/features/schedule/components/ScheduleForm";
import { WorkSchedule } from "@/features/schedule/types";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import FullPageLoader from "@/features/shared/components/common/FullPageLoader";
import { ScheduleRequestsTable } from "@/features/schedule/components/ScheduleRequestsTable";
import { getWorkSchedules } from "@/features/schedule/api/schedule.api"; // Giả sử có API này
import { useState } from "react";

// --- MOCK API FUNCTION (Sẽ được thay thế bằng API thật) ---
async function updateScheduleStatus(
  staffId: string,
  weekOf: string,
  status: "approved" | "rejected"
) {
  console.log(
    `Updating schedule for ${staffId}, week of ${weekOf} to ${status}`
  );
  // Giả lập độ trễ mạng
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };
}
// --- KẾT THÚC MOCK ---

export default function WorkScheduleManagementPage() {
  const queryClient = useQueryClient();
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  // 1. Tải dữ liệu thật bằng useQuery
  const { data: staff = [], isLoading: isLoadingStaff } = useStaffs();
  const { data: workSchedules = [], isLoading: isLoadingSchedules } = useQuery({
    queryKey: ["workSchedules"],
    queryFn: getWorkSchedules,
  });

  // 2. Tạo mutation để xử lý cập nhật
  const { mutate: handleUpdateRequest, isPending: isUpdating } = useMutation({
    mutationFn: ({
      staffId,
      weekOf,
      newStatus,
    }: {
      staffId: string;
      weekOf: string;
      newStatus: "approved" | "rejected";
    }) => updateScheduleStatus(staffId, weekOf, newStatus),
    onSuccess: (_, variables) => {
      if (variables.newStatus === "approved") {
        toast.success("Yêu cầu đã được phê duyệt.");
      } else {
        toast.info("Yêu cầu đã bị từ chối.");
      }
      queryClient.invalidateQueries({ queryKey: ["workSchedules"] });
    },
    onError: (error) => {
      toast.error(`Có lỗi xảy ra: ${error.message}`);
    },
  });

  // 3. Lọc ra các yêu cầu đang chờ từ dữ liệu thật
  const pendingRequests = useMemo(
    () => workSchedules.filter((req) => req.status === "pending"),
    [workSchedules]
  );

  const selectedSchedule = workSchedules.find(
    (s) => s.staffId === selectedStaffId
  );

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

  if (isLoadingStaff || isLoadingSchedules) {
    return <FullPageLoader />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Lịch làm việc</h1>
      </div>

      <Tabs defaultValue="requests">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="requests">
            Yêu cầu đang chờ ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="config">Cấu hình lịch nhân viên</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-4">
          <ScheduleRequestsTable
            requests={pendingRequests}
            staff={staff}
            onUpdateRequest={handleUpdateRequest as any}
            isUpdating={isUpdating}
          />
        </TabsContent>
        <TabsContent value="config" className="mt-4">
          <div className="mb-8 max-w-sm">
            <label className="block text-sm font-medium mb-2">
              Chọn nhân viên
            </label>
            <Select onValueChange={setSelectedStaffId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn một nhân viên để cấu hình..." />
              </SelectTrigger>
              <SelectContent>
                {staff.map((staffMember) => (
                  <SelectItem key={staffMember.id} value={staffMember.id}>
                    {staffMember.name} ({staffMember.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedStaffId && (
            <ScheduleForm initialData={selectedSchedule || defaultSchedule} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
