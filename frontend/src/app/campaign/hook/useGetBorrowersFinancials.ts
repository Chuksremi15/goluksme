import LoanFactoryABI from "@/abis/LoanFactory.json";
import { notification } from "@/app/components/utils/Notification";
import useGoLuksMeAddress from "@/app/hook/useGoLuksMeAddress";
import { Address } from "viem";
import { useAccount, useReadContract } from "wagmi";

interface BorrowerFinancials {
  collateralValue: bigint;
  borrowCapacity: bigint;
  totalDebt: bigint;
  collateralRatio: bigint;
  liquidatable: boolean;
}

interface UseGetBorrowersFinancialsReturn {
  financials: any;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
}

export function useGetBorrowersFinancials(): UseGetBorrowersFinancialsReturn {
  const { address } = useAccount();
  const contractAddress = useGoLuksMeAddress();

  const { data, isLoading, isError, error } = useReadContract({
    address: contractAddress as Address,
    abi: LoanFactoryABI,
    functionName: "getBorrowerFinancials",
    args: [address],
  });

  return {
    financials: data as [bigint, bigint, bigint, bigint, boolean],
    isLoading,
    error,
    isError,
  };
}
