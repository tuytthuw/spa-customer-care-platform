export interface Product {
  id: string;
  name: string;
  description: string;
  categories: string[];
  price: number;
  stock: number;
  imageUrl: string;
  imageUrls: string[];
  status: "active" | "inactive";
  isRetail: boolean;
  isConsumable: boolean;
  baseUnit: string; // Đơn vị cơ sở (vd: "chai", "lọ", "hũ")
  consumableUnit?: string; // Đơn vị tiêu hao (vd: "ml", "g")
  conversionRate?: number; // Tỷ lệ quy đổi (vd: 500)
}
