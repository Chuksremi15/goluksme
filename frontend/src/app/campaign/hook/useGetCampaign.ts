import { Address } from "viem";
import { useReadContract } from "wagmi";
import useGoLuksMeAddress from "@/app/hook/useGoLuksMeAddress";
import CrowdFundABI from "@/abis/CrowdFund.json";

export interface Campaign {
  owner: Address;
  title: string;
  dataId: string;
  target: bigint;
  deadline: bigint;
  fundsRaised: bigint;
  withdrawn: boolean;
}

interface UseGetCampaignReturn {
  campaign: Campaign | null;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
}

export function useGetCampaign(id: bigint): UseGetCampaignReturn {
  const contractAddress = useGoLuksMeAddress();

  const { data, isLoading, isError, error } = useReadContract({
    address: contractAddress as Address,
    abi: CrowdFundABI,
    functionName: "getCampaign",
    args: [id],
  }) as {
    data: [Address, string, string, bigint, bigint, bigint, boolean] | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };

  // Ensure `data` exists and is an array before mapping
  const campaign: Campaign | null = data
    ? {
        owner: data[0] as Address,
        title: data[1] as string,
        dataId: data[2] as string,
        target: BigInt(data[3]), // Ensure proper bigint handling
        deadline: BigInt(data[4]),
        fundsRaised: BigInt(data[5]),
        withdrawn: Boolean(data[6]),
      }
    : null;

  return {
    campaign,
    isLoading,
    error,
    isError,
  };
}
