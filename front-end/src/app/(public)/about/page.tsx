// src/app/(public)/about/page.tsx

import Image from "next/image";
import { User, Heart, Leaf } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center text-center bg-muted">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <Image
          src="/images/service-2.jpg" // Sử dụng lại một ảnh có sẵn làm nền
          alt="Không gian Serenity Spa"
          fill
          className="object-cover"
        />
        <div className="relative z-20 p-4">
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Về Serenity Spa
          </h1>
          <p className="text-xl mt-2 text-white/90">
            Hành trình kiến tạo vẻ đẹp và sự thư thái
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Sứ mệnh */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">
              Sứ Mệnh Của Chúng Tôi
            </h2>
            <p className="text-lg text-muted-foreground">
              Tại Serenity Spa, chúng tôi tin rằng vẻ đẹp thực sự đến từ sự cân
              bằng giữa thể chất và tinh thần. Sứ mệnh của chúng tôi là tạo ra
              một không gian yên bình, nơi bạn có thể trút bỏ mọi căng thẳng,
              tái tạo năng lượng và tìm lại vẻ đẹp tự nhiên nhất của chính mình.
            </p>
          </div>

          {/* Các giá trị cốt lõi */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đội Ngũ Chuyên Gia</h3>
              <p className="text-muted-foreground">
                Đội ngũ kỹ thuật viên của chúng tôi được đào tạo chuyên sâu,
                giàu kinh nghiệm và luôn tận tâm với từng khách hàng.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dịch Vụ Tận Tâm</h3>
              <p className="text-muted-foreground">
                Chúng tôi cam kết mang đến trải nghiệm cá nhân hóa, lắng nghe và
                thấu hiểu nhu cầu của bạn để đưa ra liệu trình phù hợp nhất.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sản Phẩm Tự Nhiên</h3>
              <p className="text-muted-foreground">
                Ưu tiên sử dụng các sản phẩm có nguồn gốc từ thiên nhiên, an
                toàn, lành tính và mang lại hiệu quả bền vững cho làn da.
              </p>
            </div>
          </div>

          {/* Không gian Spa */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-semibold mb-4">
                Không Gian Thư Thái
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Serenity Spa được thiết kế với tông màu ấm cúng, hương thơm tinh
                dầu dịu nhẹ và âm nhạc du dương. Mỗi góc nhỏ tại spa đều được
                chăm chút tỉ mỉ để mang lại cho bạn cảm giác thoải mái và thư
                giãn tuyệt đối, tách biệt khỏi sự ồn ào của cuộc sống thường
                nhật.
              </p>
            </div>
            <div>
              <Image
                src="/images/service-1.jpg" // Sử dụng lại ảnh có sẵn
                alt="Góc thư giãn tại Serenity Spa"
                width={500}
                height={400}
                className="rounded-lg object-cover w-full shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
