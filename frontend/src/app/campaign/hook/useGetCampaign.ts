import { Address } from "viem";
import { useReadContract } from "wagmi";
import { lukso } from "viem/chains";
import deployedContracts from "../../../../contracts/deployedContracts";
import { GenericContractsDeclaration } from "@/utils/scaffold-eth/contract";

export interface Campaign {
  owner: Address;
  title: string;
  dataId: string;
  target: bigint;
  totalDonations: bigint;
  totalWithdrawn: bigint;
  donationCount: bigint;
}

interface UseGetCampaignReturn {
  campaign: Campaign | null;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
}

export function useGetCampaign(owner: Address): UseGetCampaignReturn {
  const contracts = deployedContracts as GenericContractsDeclaration | null;
  const chainId = lukso.id;
  const deployedContractsOnChain = contracts ? contracts[chainId] : {};
  const contract = deployedContractsOnChain["CrowdFund"];
  const contractAddress = contract.address;

  const { data, isLoading, isError, error } = useReadContract({
    address: contractAddress as Address,
    abi: contract.abi,
    functionName: "getCampaign",
    args: [owner],
  }) as {
    data: [Address, string, string, bigint, bigint, bigint, bigint] | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };

  if (isError) {
    if (error instanceof Error) {
      console.error("Error fetching campaign:", error.message);
    } else {
      console.error("Error fetching campaign:", error);
    }
  }

  // Ensure `data` exists and is an array before mapping
  const campaign: Campaign | null = data
    ? {
        owner: data[0] as Address,
        title: data[1] as string,
        dataId: data[2] as string,
        target: BigInt(data[3]), // Ensure proper bigint handling
        totalDonations: BigInt(data[4]),
        totalWithdrawn: BigInt(data[5]),
        donationCount: BigInt(data[6]),
      }
    : null;

  return {
    campaign,
    isLoading,
    error,
    isError,
  };
}
