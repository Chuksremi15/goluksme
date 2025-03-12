import LoanFactoryABI from "@/abis/LoanFactory.json";
import { notification } from "@/app/components/utils/Notification";
import useGoLuksMeAddress from "@/app/hook/useGoLuksMeAddress";
import { useTransactor } from "@/app/hook/useTransactor";
import { GoLuksMeAddresses } from "@/config/conts";
import { useState } from "react";
import { Address, Hex } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";

interface UseSupplyCollateralReturn {
  supplyCollateral: (
    collaterals: { token: Address; amount: bigint }[] | undefined
  ) => Promise<Hex | undefined>;
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
  isError: boolean;
}

export function useSupplyCollateral(): UseSupplyCollateralReturn {
  const { address } = useAccount();

  const contractAddress = useGoLuksMeAddress();

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const { result: writeTxn } = useTransactor();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);

  const supplyCollateral = async (
    collaterals: { token: Address; amount: bigint }[] | undefined
  ) => {
    try {
      if (collaterals?.length == 0) {
        setError(new Error("Collaterals is required"));
        notification.error({ message: "Collaterals is required" });
        setIsSuccess(false);
        setIsError(true);
        return;
      }

      if (!publicClient) {
        setError(new Error("Public client not initialized"));
        setIsSuccess(false);
        setIsError(true);
        return;
      }

      setIsLoading(true);
      const simulateData = await publicClient.simulateContract({
        address: contractAddress,
        abi: LoanFactoryABI,
        functionName: "supplyCollateral",
        account: address,
        args: [collaterals],
      });
      if (!simulateData?.request) {
        setError(
          new Error("Failed to simulate liquidation notice transaction")
        );
        setIsLoading(false);
        setIsError(false);
        setIsSuccess(false);
      }
      const makeWriteWithParamsFund = () =>
        writeContractAsync(simulateData.request);
      const result = await writeTxn(makeWriteWithParamsFund);

      if (result) {
        setIsSuccess(true);
        return result;
      }
    } catch (error) {
      setIsSuccess(false);
      setError(
        error instanceof Error
          ? error
          : new Error("Failed to issue liquidation notice")
      );
      if (error instanceof Error) {
        notification.error({ message: error.message.slice(0, 100) });

        console.log("error", error);
      } else notification.error({ message: "An unknown error occurred" });
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return { supplyCollateral, isLoading, isSuccess, error, isError };
}
