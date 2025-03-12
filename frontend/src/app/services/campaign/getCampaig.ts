import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCampaignData = async (id: string) => {
  const response = await axios.post("/api/campaign/fetch", { id });

  return response.data.campaign;
};

export function useGetCampaignData(id: string) {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: () => fetchCampaignData(id),
    enabled: !!id, // Prevents execution if ID is missing
    refetchOnMount: true, // Always refetch when the component mounts
    refetchOnWindowFocus: true,
  });
}
