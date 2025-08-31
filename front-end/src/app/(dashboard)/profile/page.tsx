"use client";

import ProfileForm from "@/features/user/components/ProfileForm";
import { useAuth } from "@/contexts/AuthContexts";
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/features/customer/api/customer.api";
import { getStaffProfiles } from "@/features/staff/api/staff.api";
import { FullCustomerProfile } from "@/features/customer/types";
import { FullStaffProfile } from "@/features/staff/types";

export default function ProfilePage() {
  const { user } = useAuth();

  // Fetch both customer and staff profiles
  const { data: customers = [], isLoading: loadingCustomers } = useQuery<
    FullCustomerProfile[]
  >({
    queryKey: ["customers", user?.id],
    queryFn: getCustomers,
    enabled: !!user && user.role === "customer",
  });

  const { data: staff = [], isLoading: loadingStaff } = useQuery<
    FullStaffProfile[]
  >({
    queryKey: ["staff", user?.id],
    queryFn: getStaffProfiles,
    enabled: !!user && user.role !== "customer",
  });

  const isLoading = loadingCustomers || loadingStaff;

  if (!user || isLoading) {
    return <div className="p-6">Đang tải thông tin hồ sơ...</div>;
  }

  let userProfile;
  if (user.role === "customer") {
    userProfile = customers.find((c) => c.userId === user.id);
  } else {
    userProfile = staff.find((s) => s.userId === user.id);
  }

  if (!userProfile) {
    return <div className="p-6">Không tìm thấy thông tin hồ sơ chi tiết.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Hồ sơ của tôi</h1>
      <ProfileForm
        defaultValues={{
          name: userProfile.name,
          email: user.email,
          phone: userProfile.phone || "",
          avatar: userProfile.avatar || "",
        }}
      />
    </div>
  );
}
