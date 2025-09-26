"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/features/user/types";
import { columns } from "./columns";
import { DataTable } from "@/features/shared/components/ui/data-table";
import { getUsers, updateUserStatus } from "@/features/user/api/user.api";
import { toast } from "sonner";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import FullPageLoader from "@/features/shared/components/common/FullPageLoader";

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

  if (isLoading) return <FullPageLoader />;
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <PageHeader title="Quản lý Người dùng" />
      <DataTable
        columns={columns({ onUpdateStatus: handleUpdateStatus })}
        data={users}
      />
    </div>
  );
}
