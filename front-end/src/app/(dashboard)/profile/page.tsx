// Trong thực tế, trang này cần 'use client' để lấy dữ liệu từ context
// Nhưng để đơn giản, ta sẽ dùng Server Component với dữ liệu giả
import ProfileForm from "@/features/user/components/ProfileForm";
import { mockUser } from "@/lib/mock-data";

// Mô phỏng việc lấy dữ liệu người dùng hiện tại
const getCurrentUser = async () => {
  // Thay thế bằng logic lấy user từ session hoặc context
  return Promise.resolve(mockUser);
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Hồ sơ của tôi</h1>
      <ProfileForm
        defaultValues={{
          name: user.name,
          email: user.email,
          phone: user.phone || "",
        }}
      />
    </div>
  );
}
