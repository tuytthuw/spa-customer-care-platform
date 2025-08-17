// lib/data.ts
export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  imageUrl: string;
};

export const services: Service[] = [
  {
    id: "1",
    name: "Chăm sóc da mặt chuyên sâu",
    description:
      "Liệu trình chăm sóc da mặt toàn diện giúp làm sạch sâu, loại bỏ tế bào chết, cung cấp dưỡng chất và phục hồi làn da. Phù hợp với mọi loại da.",
    price: 500000,
    duration: 60,
    category: "Chăm sóc da",
    imageUrl: "https://via.placeholder.com/400x300?text=Facial+Care",
  },
  {
    id: "2",
    name: "Massage thư giãn toàn thân",
    description:
      "Massage toàn thân với tinh dầu thiên nhiên giúp giảm căng thẳng, mệt mỏi, cải thiện tuần hoàn máu và mang lại cảm giác thư thái tuyệt đối.",
    price: 700000,
    duration: 90,
    category: "Massage",
    imageUrl: "https://via.placeholder.com/400x300?text=Body+Massage",
  },
  {
    id: "3",
    name: "Triệt lông công nghệ cao",
    description:
      "Sử dụng công nghệ Diode Laser tiên tiến để loại bỏ lông không mong muốn một cách hiệu quả, an toàn và lâu dài, giúp da mịn màng hơn.",
    price: 1200000,
    duration: 45,
    category: "Triệt lông",
    imageUrl: "https://via.placeholder.com/400x300?text=Hair+Removal",
  },
  {
    id: "4",
    name: "Gội đầu dưỡng sinh",
    description:
      "Kết hợp giữa gội đầu và các kỹ thuật bấm huyệt vùng đầu, vai, gáy giúp đả thông kinh mạch, giảm đau đầu và mang lại sự sảng khoái.",
    price: 350000,
    duration: 75,
    category: "Chăm sóc tóc",
    imageUrl: "https://via.placeholder.com/400x300?text=Herbal+Shampoo",
  },
];
