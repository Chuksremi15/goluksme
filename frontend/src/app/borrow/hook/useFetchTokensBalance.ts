import { useAccount, useClient, usePublicClient } from "wagmi";
import {
  alchemyFetchStrategy,
  evmFetchStrategy,
  TokenBalance,
} from "./fetchTokensBalance";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useTokenBalances = (tokenAddresses: `0x${string}`[] | "erc20") => {
  const { chain, address } = useAccount();
  const client = useClient();
  const publicClient = usePublicClient();

  const isReady = !!chain && !!address && !!client && !!publicClient;

  const strategy = useMemo(() => {
    if (!isReady) return null;
    return chain!.name.startsWith("Hardhat")
      ? evmFetchStrategy(publicClient!)
      : alchemyFetchStrategy(client!);
  }, [chain, client, publicClient]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tokenBalances", address, JSON.stringify(tokenAddresses)], // Unique query key
    queryFn: () => strategy!.fetchBalances(address!, tokenAddresses),
    enabled: isReady && !!strategy, // Prevent execution when not ready
  });

  return useMemo(
    () => ({
      balances: data,
      isLoading,
      isError,
      error,
      isReady,
    }),
    [data, isLoading, isError, error, isReady]
  );
};
