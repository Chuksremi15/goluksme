import { useState } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { useTransactor } from "@/app/hook/useTransactor";
import { notification } from "@/app/components/utils/Notification";
import deployedContracts from "../../../../contracts/deployedContracts";
import { GenericContractsDeclaration } from "@/utils/scaffold-eth/contract";
import { hardhat } from "viem/chains";
import { Address } from "viem";

export const useWithdraw = () => {
  const { writeContractAsync } = useWriteContract();
  const { result: writeTxn, isLoading: isTransactorLoading } = useTransactor();
  const publicClient = usePublicClient();

  const contracts = deployedContracts as GenericContractsDeclaration | null;
  const chainId = hardhat.id;
  const deployedContractsOnChain = contracts ? contracts[chainId] : {};
  const contract = deployedContractsOnChain["CrowdFund"];
  const contractAddress = contract.address;

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
        abi: contract.abi,
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
