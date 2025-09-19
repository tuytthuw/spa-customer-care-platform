import { useQuery } from "@tanstack/react-query";
import { getPromotions } from "../api/promotion.api";

export const usePromotions = () => {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: getPromotions,
  });
};
