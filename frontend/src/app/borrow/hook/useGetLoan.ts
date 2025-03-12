import LoanFactoryABI from "@/abis/LoanFactory.json";
import useGoLuksMeAddress from "@/app/hook/useGoLuksMeAddress";
import { Address } from "viem";
import { useAccount, useReadContract } from "wagmi";

interface Collateral {
  token: Address;
  amount: bigint;
}

export interface ActiveAmount {
  createdDate: bigint;
  prevAccumulatedInterest: bigint;
  amount: bigint;
  timestamp: bigint;
  totalInterestRate: bigint;
  lender: Address;
}

interface Loan {
  stableCoin: Address;
  activeAmount: ActiveAmount[];
  collaterals: Collateral[];
  isActive: boolean;
}

interface UseGetLoanReturn {
  loan: Loan | null;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
}

export function useGetLoan(): UseGetLoanReturn {
  const { address } = useAccount();
  const contractAddress = useGoLuksMeAddress();

  const { data, isLoading, isError, error } = useReadContract({
    address: contractAddress as Address,
    abi: LoanFactoryABI,
    functionName: "getLoan",
    args: [address],
  });

  return {
    loan: data as Loan | null,
    isLoading,
    error,
    isError,
  };
}
