"use client";

import ProfileFormFields from "@/features/user/components/ProfileFormFields";
import ChangePasswordForm from "@/features/user/components/ChangePasswordForm";
import CustomerPreferencesForm from "@/features/customer/components/CustomerPreferencesForm";
import { useAuth } from "@/contexts/AuthContexts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomers,
  updateCustomerProfile,
} from "@/features/customer/api/customer.api";
import {
  getStaffProfiles,
  updateStaffProfile,
} from "@/features/staff/api/staff.api";
import { FullCustomerProfile } from "@/features/customer/types";
import { FullStaffProfile } from "@/features/staff/types";
import { PageHeader } from "@/features/shared/components/common/PageHeader";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/features/shared/components/ui/tabs";
import { toast } from "sonner";
import { PersonFormValues } from "@/lib/schemas";
import { Customer } from "@/features/customer/types";
import { Staff } from "@/features/staff/types";
import { FullPageLoader } from "@/features/shared/components/ui/spinner";
import NotificationSettingsForm from "@/features/customer/components/NotificationSettingsForm"; // ✅ MỚI
import { LoyaltyCard } from "@/features/customer/components/LoyaltyCard";

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // --- Data Fetching ---
  const { data: customers = [], isLoading: loadingCustomers } = useQuery<
    FullCustomerProfile[]
  >({
    queryKey: ["customers"],
    queryFn: getCustomers,
    enabled: !!user,
  });

  const { data: staff = [], isLoading: loadingStaff } = useQuery<
    FullStaffProfile[]
  >({
    queryKey: ["staff"],
    queryFn: getStaffProfiles,
    enabled: !!user,
  });

  // --- Data Processing ---
  const technicians: Staff[] = staff.filter((s) => s.role === "technician");
  let userProfile: FullCustomerProfile | FullStaffProfile | undefined;
  if (user?.role === "customer") {
    userProfile = customers.find((c) => c.userId === user.id);
  } else {
    userProfile = staff.find((s) => s.userId === user?.id);
  }

  // --- Mutations ---
  const profileUpdateMutation = useMutation<
    Customer | Staff,
    Error,
    PersonFormValues
  >({
    mutationFn: (data: PersonFormValues) => {
      if (!userProfile) throw new Error("Không tìm thấy hồ sơ người dùng.");

      const profileData = {
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
      };
      if (user?.role === "customer") {
        return updateCustomerProfile(userProfile.id, profileData);
      } else {
        return updateStaffProfile(userProfile.id, profileData);
      }
    },
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error) => toast.error(`Cập nhật thất bại: ${error.message}`),
  });

  // --- Render Logic ---
  const isLoading = loadingCustomers || loadingStaff;

  if (!user || isLoading) {
    return <FullPageLoader text="Đang tải thông tin hồ sơ..." />;
  }

  if (!userProfile) {
    return <div className="p-6">Không tìm thấy thông tin hồ sơ chi tiết.</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageHeader title="Cài đặt Tài khoản" />

      {/* ✅ BỐ CỤC TABS MỚI */}
      <Tabs defaultValue="profile" className="mt-6">
        <TabsList>
          <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
          {user.role === "customer" && (
            <>
              {" "}
              <TabsTrigger value="loyalty">Thẻ thành viên</TabsTrigger>
              <TabsTrigger value="preferences">Tùy chọn cá nhân</TabsTrigger>
              <TabsTrigger value="notifications">Thông báo</TabsTrigger>{" "}
              {/* ✅ MỚI */}
            </>
          )}
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        {/* Tab 1: Hồ sơ */}
        <TabsContent value="profile" className="mt-4">
          <ProfileFormFields
            defaultValues={{
              name: userProfile.name,
              email: user.email,
              phone: userProfile.phone || "",
              avatar: userProfile.avatar || "",
            }}
            onSubmit={profileUpdateMutation.mutate}
            isSubmitting={profileUpdateMutation.isPending}
          />
        </TabsContent>

        {user.role === "customer" && (
          <TabsContent value="loyalty" className="mt-4">
            <LoyaltyCard customer={userProfile as FullCustomerProfile} />
          </TabsContent>
        )}

        {/* Tab 2: Tùy chọn (Chỉ cho khách hàng) */}
        {user.role === "customer" && (
          <TabsContent value="preferences" className="mt-4">
            <CustomerPreferencesForm
              customer={userProfile as FullCustomerProfile}
              technicians={technicians}
            />
          </TabsContent>
        )}

        {/* ✅ MỚI: Tab 3: Thông báo */}
        {user.role === "customer" && (
          <TabsContent value="notifications" className="mt-4">
            <NotificationSettingsForm
              customer={userProfile as FullCustomerProfile}
            />
          </TabsContent>
        )}

        {/* Tab 3: Bảo mật */}
        <TabsContent value="security" className="mt-4">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
