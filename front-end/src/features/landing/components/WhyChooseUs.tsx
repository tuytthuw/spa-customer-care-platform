// src/features/landing/components/WhyChooseUs.tsx

import { Card, CardContent } from "@/components/ui/card";
import { User, Heart, Leaf } from "lucide-react";
import Image from "next/image";

export default function WhyChooseUs() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Cột hình ảnh */}
          <div>
            <Image
              src="/images/service-1.jpg" // Sử dụng lại ảnh có sẵn
              alt="Không gian thư giãn tại Serenity Spa"
              width={500}
              height={600}
              className="rounded-lg object-cover w-full h-auto shadow-xl"
            />
          </div>

          {/* Cột nội dung */}
          <div className="space-y-8">
            <div className="text-left">
              <h2 className="text-3xl font-bold tracking-tight">
                Tại Sao Chọn Serenity Spa?
              </h2>
              <p className="text-muted-foreground mt-2">
                Nơi mỗi liệu trình là một hành trình tái tạo năng lượng và tôn
                vinh vẻ đẹp của bạn.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Đội Ngũ Chuyên Gia</h3>
                  <p className="text-muted-foreground">
                    Kỹ thuật viên giàu kinh nghiệm, được đào tạo chuyên sâu để
                    mang lại kết quả tốt nhất.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Sản Phẩm Tự Nhiên</h3>
                  <p className="text-muted-foreground">
                    Chúng tôi ưu tiên sử dụng các sản phẩm an toàn, lành tính có
                    nguồn gốc từ thiên nhiên.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Không Gian Thư Thái</h3>
                  <p className="text-muted-foreground">
                    Thiết kế tinh tế, ấm cúng cùng hương thơm dịu nhẹ giúp bạn
                    thư giãn tuyệt đối.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
