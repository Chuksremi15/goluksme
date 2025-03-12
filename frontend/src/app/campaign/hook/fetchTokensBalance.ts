import { Address, erc20Abi } from "viem";
import { UseClientReturnType, UsePublicClientReturnType } from "wagmi";

export interface TokenBalance {
  address: Address;
  balance: bigint;
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
  value: bigint;
}

export async function alchemyFetchTokenBalances(
  address: `0x${string}`,
  tokenAddresses: `0x${string}`[] | "erc20" = "erc20",
  client: UseClientReturnType
) {
  const alchemyResult = await (client?.request as any)({
    method: "alchemy_getTokenBalances",
    params: [address, tokenAddresses],
  });

  return await Promise.all(
    alchemyResult.tokenBalances.map(async (token: any) => {
      const metadata = await (client?.request as any)({
        method: "alchemy_getTokenMetadata",
        params: [token.contractAddress],
      });

      return {
        address: token.contractAddress,
        name: metadata.name ?? "",
        symbol: metadata.symbol ?? "",
        balance: BigInt(token.tokenBalance).toString(),
        decimals: metadata.decimals,
        logo: metadata.logo ?? "",
        value: 0n,
      };
    })
  );
}

export async function evmFetchTokenBalances(
  address: `0x${string}`,
  tokenAddresses: `0x${string}`[],
  publicClient: UsePublicClientReturnType
): Promise<TokenBalance[]> {
  return await Promise.all(
    tokenAddresses.map(async (tokenAddress) => {
      const contract = {
        address: tokenAddress,
        abi: erc20Abi,
      };

      const balance = await publicClient?.readContract({
        abi: contract.abi,
        address: contract.address,
        functionName: "balanceOf",
        args: [address],
      });

      const decimals = await publicClient?.readContract({
        abi: contract.abi,
        address: contract.address,
        functionName: "decimals",
      });

      const symbol = await publicClient?.readContract({
        abi: contract.abi,
        address: contract.address,
        functionName: "symbol",
      });

      const name = await publicClient?.readContract({
        abi: contract.abi,
        address: contract.address,
        functionName: "name",
      });

      return {
        address: tokenAddress,
        name: name as string,
        symbol: symbol as string,
        balance: BigInt(balance as bigint),
        decimals: Number(decimals),
        logo: "", // TODO: Fetch logo from Alchemy or use a default placeholder
        value: 0n,
      };
    })
  );
}

export interface TokenBalancesFetchStrategy {
  fetchBalances(
    address: string,
    tokenAddresses: `0x${string}`[] | "erc20"
  ): Promise<TokenBalance[]>;
}

export const evmFetchStrategy = (
  publicClient: UsePublicClientReturnType
): TokenBalancesFetchStrategy => {
  return {
    fetchBalances: async (
      address: string,
      tokenAddresses: `0x${string}`[]
    ): Promise<TokenBalance[]> => {
      return evmFetchTokenBalances(
        address as `0x${string}`,
        tokenAddresses,
        publicClient
      );
    },
  };
};

export const alchemyFetchStrategy = (
  client: UseClientReturnType
): TokenBalancesFetchStrategy => {
  return {
    fetchBalances: async (
      address: string,
      tokenAddresses: `0x${string}`[]
    ): Promise<TokenBalance[]> => {
      return await alchemyFetchTokenBalances(
        address as `0x${string}`,
        tokenAddresses,
        client
      );
    },
  };
};
