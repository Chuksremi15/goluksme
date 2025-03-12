import { useState, useEffect } from "react";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { Address, erc20Abi, formatEther, formatUnits, zeroAddress } from "viem";

import useGoLuksMeAddress from "@/app/hook/useGoLuksMeAddress";
import { TokenBalance } from "./fetchTokensBalance";
import { useTransactor } from "@/app/hook/useTransactor";
import { notification } from "@/app/components/utils/Notification";

const useApprove = (token: TokenBalance, amount: bigint) => {
  const { writeContractAsync } = useWriteContract();
  const { result: writeTxn } = useTransactor();

  const publicClient = usePublicClient();

  const contractAddress = useGoLuksMeAddress();
  const { address } = useAccount();

  const [isApproved, setIsApproved] = useState(false);
  const [approvedLoading, setApprovedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: allowance, isLoading: isLoadingAllowance } = useReadContract({
    address: token.address as Address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address || zeroAddress, contractAddress],
  });

  const handleApproveClick = async () => {
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
      const { request } = await publicClient?.simulateContract({
        address: token.address as Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [contractAddress, amount],
        account: address,
      });

      if (token.balance > 0n && request && amount > 0n) {
        setApprovedLoading(true);

        const makeWriteWithParamsApprove = () => writeContractAsync(request);

        const approveTrxHash = await writeTxn(makeWriteWithParamsApprove);

        if (approveTrxHash) setIsApproved(true);

        setApprovedLoading(false);
        setError(null); // Clear error if any
      }
    } catch (error) {
      setApprovedLoading(false);
      if (error instanceof Error) {
        notification.error({ message: error.message.slice(0, 100) });
      } else notification.error({ message: "An unknown error occurred" });

      setError("An error occurred while processing the approval.");
    }
  };

  return {
    isApproved,
    approvedLoading,
    error,
    setIsApproved,
    handleApproveClick,
    allowance,
    isLoadingAllowance,
  };
};

export default useApprove;
