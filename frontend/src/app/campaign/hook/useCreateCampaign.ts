import { useState } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { Address } from "viem";
import { useTransactor } from "@/app/hook/useTransactor";
import { notification } from "@/app/components/utils/Notification";
import deployedContracts from "../../../../contracts/deployedContracts";
import { GenericContractsDeclaration } from "@/utils/scaffold-eth/contract";
import { lukso } from "viem/chains";

export const useCreateCampaign = () => {
  const { writeContractAsync } = useWriteContract();
  const { result: writeTxn } = useTransactor();
  const publicClient = usePublicClient();

  const { address } = useAccount();

  const contracts = deployedContracts as GenericContractsDeclaration | null;
  const chainId = lukso.id;
  const deployedContractsOnChain = contracts ? contracts[chainId] : {};
  const contract = deployedContractsOnChain["CrowdFund"];
  const contractAddress = contract.address;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);

  const createCampaign = async (
    title: string,
    dataId: string,
    target: bigint
  ) => {
    if (!publicClient) throw new Error("Public client not initialized");
    if (!contractAddress) throw new Error("Contract Address is required");
    if (!address) throw new Error("User address is required");
    if (target <= 0n) throw new Error("Target must be greater than zero");

    try {
      setIsLoading(true);
      const { request } = await publicClient.simulateContract({
        address: contractAddress as Address,
        abi: contract.abi,
        functionName: "createCampaign",
        args: [title, dataId, target],
        account: address,
      });

      const makeWriteTxn = () => writeContractAsync(request);
      const trxHash = await writeTxn(makeWriteTxn);

      if (trxHash) {
        setIsLoading(false);
        setIsSuccess(true);
        setIsError(false);
        setError(null);

        return trxHash;
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
    createCampaign,
    isLoading,
    isSuccess,
    error,
    isError,
  };
};
