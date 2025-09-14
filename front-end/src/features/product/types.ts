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
}
