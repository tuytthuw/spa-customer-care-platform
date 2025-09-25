"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { useStaffs } from "@/features/staff/hooks/useStaffs";
import { FullPageLoader } from "@/features/shared/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { ScheduleRequestsTable } from "@/features/schedule/components/ScheduleRequestsTable";

export default function WorkScheduleManagementPage() {
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const { data: staff = [], isLoading: isLoadingStaff } = useStaffs();

  // Tạm thời vẫn dùng mock data cho requests và schedules vì chưa có API
  // Sẽ cần thay thế bằng useQuery khi có API tương ứng
  const [requests, setRequests] = useState<WorkSchedule[]>([]); // Khởi tạo rỗng
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([]); // Khởi tạo rỗng

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

  const handleUpdateRequest = (
    staffId: string,
    weekOf: string,
    newStatus: "approved" | "rejected"
  ) => {
    // Logic này sẽ được thay bằng mutation khi có API
    console.log(
      `Updating request for ${staffId} for week ${weekOf} to ${newStatus}`
    );
    setRequests((currentRequests) =>
      currentRequests.map((req) =>
        req.staffId === staffId && req.weekOf === weekOf
          ? { ...req, status: newStatus }
          : req
      )
    );
    if (newStatus === "approved") {
      toast.success("Yêu cầu đã được phê duyệt.");
    } else {
      toast.info("Yêu cầu đã bị từ chối.");
    }
  };

  if (isLoadingStaff) {
    return <FullPageLoader text="Đang tải dữ liệu nhân viên..." />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Lịch làm việc</h1>
      </div>

      <Tabs defaultValue="requests">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="requests">Yêu cầu đang chờ</TabsTrigger>
          <TabsTrigger value="config">Cấu hình lịch nhân viên</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-4">
          {/* THÊM COMPONENT VÀO ĐÂY */}
          <ScheduleRequestsTable
            requests={requests}
            staff={staff}
            onUpdateRequest={handleUpdateRequest}
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
                {/* BƯỚC 5: SỬ DỤNG DỮ LIỆU NHÂN VIÊN THẬT */}
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
