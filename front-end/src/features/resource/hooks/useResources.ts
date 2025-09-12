import { useQuery } from "@tanstack/react-query";
import { getResources } from "@/features/resource/api/resource.api";

export const useResources = () => {
  return useQuery({
    queryKey: ["resources"], // <-- Query key duy nhất
    queryFn: getResources,
  });
};
