import PriceOracleAbi from "@/abis/PriceOracle.json";
import { priceOracleAddress } from "@/config/conts";

import { useReadContract } from "wagmi";

interface GetTokenValueReturn {
  tokenValue: bigint;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
}

export function useGetTokenValue({
  tokenAddress,
  amount,
}: {
  tokenAddress: `0x${string}` | undefined;
  amount: bigint | undefined;
}): GetTokenValueReturn {
  const { data, isLoading, error, isError } = useReadContract({
    address: priceOracleAddress,
    abi: PriceOracleAbi,
    functionName: "quote",
    args: [tokenAddress, amount],
  });

  return {
    tokenValue: data as bigint,
    isLoading,
    error: error as Error | null,
    isError,
  };
}
