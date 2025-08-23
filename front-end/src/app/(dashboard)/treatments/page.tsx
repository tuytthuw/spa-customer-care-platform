"use client";

import TreatmentCard from "@/features/treatment/TreatmentCard";
import { mockTreatmentPackages } from "@/lib/mock-data";
import { useAuth } from "@/contexts/AuthContexts";

const TreatmentsPage = () => {
  // Trong ứng dụng thực tế, bạn sẽ lấy dữ liệu này dựa trên ID của người dùng đã đăng nhập
  const { user } = useAuth(); // Giả sử user.id là 'user-1'
  const customerPackages = mockTreatmentPackages.filter(
    (pkg) => pkg.customerId === user?.id
  );

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Liệu trình của tôi</h1>
      {customerPackages.length > 0 ? (
        <div className="space-y-6">
          {customerPackages.map((pkg) => (
            <TreatmentCard key={pkg.id} treatmentPackage={pkg} />
          ))}
        </div>
      ) : (
        <p>Bạn hiện không có liệu trình nào đang hoạt động.</p>
      )}
    </div>
  );
};

export default TreatmentsPage;
