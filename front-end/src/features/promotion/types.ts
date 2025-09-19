export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  discountPercent: number;
  applicableServiceIds?: string[];
  applicablePlanIds?: string[];
  giftProductIds?: string[];
  startDate: string;
  endDate: string;
}
