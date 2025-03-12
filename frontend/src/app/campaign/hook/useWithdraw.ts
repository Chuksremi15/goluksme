import { useState } from "react";
import CrowdFundABI from "@/abis/CrowdFund.json";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { Address } from "viem";

import useGoLuksMeAddress from "@/app/hook/useGoLuksMeAddress";
import { useTransactor } from "@/app/hook/useTransactor";
import { notification } from "@/app/components/utils/Notification";

export const useWithdraw = () => {
  const { writeContractAsync } = useWriteContract();
  const { result: writeTxn, isLoading: isTransactorLoading } = useTransactor();
  const publicClient = usePublicClient();
  const contractAddress = useGoLuksMeAddress();
  const { address } = useAccount();

  const [isWithdrawLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);

  const withdraw = async () => {
    try {
      if (!publicClient) throw new Error("Public client not initialized");
      if (!contractAddress) throw new Error("Contract Address is required");
      if (!address) throw new Error("User address is required");

      setIsLoading(true);
      const { request } = await publicClient.simulateContract({
        address: contractAddress as Address,
        abi: CrowdFundABI,
        functionName: "withdraw",
        account: address,
      });

      const makeWriteTxn = () => writeContractAsync(request);
      const trxHash = await writeTxn(makeWriteTxn);

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

      const errorMessage =
        error instanceof Error
          ? error.message.slice(0, 100)
          : "An unknown error occurred";
      notification.error({ message: errorMessage });
      setError(error as Error);
    }
  };

  return {
    withdraw,
    isLoading: isTransactorLoading && isWithdrawLoading,
    isSuccess,
    error,
    isError,
  };
};
