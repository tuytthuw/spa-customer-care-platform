// src/app/(dashboard)/profile/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hồ Sơ Của Tôi</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Sử dụng user? để đảm bảo user không phải là null */}
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và Tên</Label>
              <Input id="fullName" defaultValue={user?.name || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ""}
                disabled
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            {/* Sửa dòng này: Dùng user?.phone và cung cấp giá trị rỗng nếu không tồn tại */}
            <Input id="phone" defaultValue={user?.phone || ""} />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Lưu Thay Đổi</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfilePage;
