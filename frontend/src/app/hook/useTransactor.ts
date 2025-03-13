import { getParsedError } from "../utils/getParsedError";
import { useState } from "react";
import { Hash, SendTransactionParameters, TransactionReceipt } from "viem";
import * as chains from "viem/chains";
import { Config, useAccount, usePublicClient, useWalletClient } from "wagmi";
import { SendTransactionMutate } from "wagmi/query";
import { notification } from "../components/utils/Notification";

export type TransactorFuncOptions = {
  onBlockConfirmation?: (txnReceipt: TransactionReceipt) => void;
  blockConfirmations?: number;
};

/**
 * Gives the block explorer transaction URL, returns empty string if the network is a local chain
 */
export function getBlockExplorerTxLink(chainId: number, txnHash: string) {
  const chainNames = Object.keys(chains);

  const targetChainArr = chainNames.filter((chainName) => {
    const wagmiChain = chains[chainName as keyof typeof chains];
    return wagmiChain.id === chainId;
  });

  if (targetChainArr.length === 0) {
    return "";
  }

  const targetChain = targetChainArr[0] as keyof typeof chains;
  const blockExplorerTxURL = chains[targetChain]?.blockExplorers?.default?.url;

  if (!blockExplorerTxURL) {
    return "";
  }

  return `${blockExplorerTxURL}/tx/${txnHash}`;
}

type TransactionFunc = (
  tx:
    | (() => Promise<Hash>)
    | Parameters<SendTransactionMutate<Config, undefined>>[0],
  options?: TransactorFuncOptions
) => Promise<Hash | undefined>;

interface UseTransactorReturn {
  result: TransactionFunc;
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
  blockExplorerTxLink: string;
}

/**
 * Runs Transaction passed in to returned function showing UI feedback.
 * @param _walletClient - Optional wallet client to use. If not provided, will use the one from useWalletClient.
 * @returns function that takes in transaction function as callback, shows UI feedback for transaction and returns a promise of the transaction hash
 */
export const useTransactor = (): UseTransactorReturn => {
  const { chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [blockExplorerTxLink, setBlockExplorerTxLink] = useState("");

  const result: TransactionFunc = async (tx, options) => {
    if (!walletClient) {
      notification.error({ message: "Cannot access account" });
      return;
    }
    if (!publicClient) {
      notification.error({ message: "Cannot access account" });
      return;
    }

    let notificationId = null;
    let transactionHash: Hash | undefined = undefined;
    try {
      setIsLoading(true);

      notificationId = notification.loading({
        message: "Awaiting user confirmation",
      });

      if (typeof tx === "function") {
        // Tx is already prepared by the caller
        const result = await tx();
        transactionHash = result;
      } else if (tx != null) {
        transactionHash = await walletClient.sendTransaction(
          tx as SendTransactionParameters
        );
      } else {
        throw new Error("Incorrect transaction passed to transactor");
      }
      notification.remove(notificationId);

      const blockExplorerTxURL = chainId
        ? getBlockExplorerTxLink(chainId, transactionHash)
        : "";
      setBlockExplorerTxLink(blockExplorerTxURL);

      notificationId = notification.loading({
        message: "Waiting for transaction to complete.",
        blockExplorerLink: blockExplorerTxURL,
      });

      const transactionReceipt = await publicClient.waitForTransactionReceipt({
        hash: transactionHash,
        confirmations: options?.blockConfirmations,
        timeout: 600_000,
      });

      notification.remove(notificationId);

      notification.success({
        message: "Transaction successful!",
        blockExplorerLink: blockExplorerTxURL,
      });

      if (options?.onBlockConfirmation)
        options.onBlockConfirmation(transactionReceipt);
      setIsSuccess(true);
      setIsLoading(false);
    } catch (error: any) {
      if (notificationId) {
        notification.remove(notificationId);
      }

      const message = getParsedError(error);
      notification.error({ message });
      setError(error);
      setIsSuccess(false);
      setIsLoading(false);
    }

    return transactionHash;
  };

  return { result, error, isSuccess, isLoading, blockExplorerTxLink };
};
