"use client";

import { useState } from "react";
// 1. Import thêm các component cần thiết và dữ liệu mẫu mới
import {
  mockStaff,
  mockWorkSchedules,
  mockScheduleRequests,
} from "@/lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs
import ScheduleForm from "@/features/schedule/components/ScheduleForm";
import { WorkSchedule } from "@/features/schedule/types";
import { ScheduleRequestsTable } from "@/features/schedule/components/ScheduleRequestsTable"; // Import bảng phê duyệt
import { toast } from "sonner";

export default function WorkScheduleManagementPage() {
  // State cho Tab "Cấu hình lịch"
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  // State cho Tab "Yêu cầu đang chờ"
  const [requests, setRequests] =
    useState<WorkSchedule[]>(mockScheduleRequests);

  // --- Logic cho Tab "Cấu hình lịch" (Giữ nguyên) ---
  const selectedSchedule = mockWorkSchedules.find(
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

  // --- Logic cho Tab "Yêu cầu đang chờ" (Mới) ---
  const handleUpdateRequest = (
    staffId: string,
    weekOf: string,
    newStatus: "approved" | "rejected"
  ) => {
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

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Lịch làm việc</h1>
      </div>

      {/* 2. Sử dụng Tabs để chia giao diện */}
      <Tabs defaultValue="requests">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="requests">Yêu cầu đang chờ</TabsTrigger>
          <TabsTrigger value="config">Cấu hình lịch nhân viên</TabsTrigger>
        </TabsList>

        {/* Tab 1: Phê duyệt yêu cầu */}
        <TabsContent value="requests" className="mt-4">
          <ScheduleRequestsTable
            requests={requests.filter((r) => r.status === "pending")}
            onUpdateRequest={handleUpdateRequest}
          />
        </TabsContent>

        {/* Tab 2: Cấu hình lịch (Giao diện cũ của bạn) */}
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
                {mockStaff.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name} ({staff.role})
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
