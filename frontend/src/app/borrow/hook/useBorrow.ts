import { useState } from "react";
import LoanFactoryABI from "@/abis/LoanFactory.json";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { Address } from "viem";

import useGoLuksMeAddress from "@/app/hook/useGoLuksMeAddress";

import { useTransactor } from "@/app/hook/useTransactor";
import { notification } from "@/app/components/utils/Notification";

export const useBorrow = (lender: Address) => {
  const { writeContractAsync } = useWriteContract();
  const { result: writeTxn } = useTransactor();
  const publicClient = usePublicClient();
  const contractAddress = useGoLuksMeAddress();
  const { address } = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);

  const borrow = async (amount: bigint) => {
    if (!publicClient) {
      throw new Error("Public client not initialized");
    }
    if (!contractAddress) {
      throw new Error("Contract Address is required");
    }

    if (!address) {
      throw new Error("Address is required");
    }

    try {
      setIsLoading(true);

      const { request } = await publicClient?.simulateContract({
        address: contractAddress as Address,
        abi: LoanFactoryABI,
        functionName: "borrow",
        args: [amount, lender],
        account: address,
      });

      const makeWriteWithParamsApprove = () => writeContractAsync(request);

      const trxHash = await writeTxn(makeWriteWithParamsApprove);

      if (trxHash) {
        setIsLoading(false);
        setIsSuccess(true);
        setIsError(false);
        setError(null);
      }
    } catch (error) {
      setIsLoading(false);
      setIsSuccess(false);
      setIsError(true);

      if (error instanceof Error) {
        notification.error({ message: error.message.slice(0, 100) });
      } else notification.error({ message: "An unknown error occurred" });

      setError(error as Error);
    }
  };

  return {
    borrow,
    isLoading,
    isSuccess,
    error,
    isError,
  };
};
