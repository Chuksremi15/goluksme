import { createClient, http } from "viem";

import * as chains from "viem/chains";
import { cookieStorage, createConfig, createStorage } from "wagmi";
import { metaMask, walletConnect } from "wagmi/connectors";

const MetaMaskOptions = {
  dappMetadata: {
    name: "frenFinance",
    url: "https://frenfinance.com",
  },
};

const chainsObj: readonly [chains.Chain, chains.Chain] = [
  chains.hardhat,
  chains.lukso,
];

const RPC_CHAIN_NAMES: Record<number, string> = {
  [chains.lukso.id]: "lukso-mainnet",
};

export const getHttpUrl = (chainId: number) => {
  const rpcChainName = RPC_CHAIN_NAMES[chainId];
  if (!rpcChainName) return undefined;

  return `https://${rpcChainName}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
};

export const wagmiConfig = createConfig({
  chains: chainsObj, // ✅ Only Lukso Mainnet is enabled
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
    }),
    metaMask(MetaMaskOptions),
  ],
  client({ chain }) {
    return createClient({
      chain,
      transport: http(getHttpUrl(chain.id)),
    });
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
});
