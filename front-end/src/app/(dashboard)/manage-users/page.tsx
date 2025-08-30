"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/features/user/types";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { getUsers, updateUserStatus } from "@/features/user/api/user.api";
import { toast } from "sonner";

export default function ManageUsersPage() {
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      userId,
      newStatus,
    }: {
      userId: string;
      newStatus: "active" | "inactive";
    }) => updateUserStatus(userId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Cập nhật trạng thái tài khoản thành công!");
    },
    onError: (err) => {
      toast.error(`Cập nhật thất bại: ${err.message}`);
    },
  });

  const handleUpdateStatus = (
    userId: string,
    newStatus: "active" | "inactive"
  ) => {
    updateStatusMutation.mutate({ userId, newStatus });
  };

  if (isLoading) return <div>Đang tải danh sách người dùng...</div>;
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Tài khoản Người dùng</h1>
      </div>
      <DataTable
        columns={columns({ onUpdateStatus: handleUpdateStatus })}
        data={users}
      />
    </div>
  );
}
