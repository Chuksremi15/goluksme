import { createClient, http } from "viem";

import * as chains from "viem/chains";
import { cookieStorage, createConfig, createStorage } from "wagmi";
import { metaMask, walletConnect } from "wagmi/connectors";

const MetaMaskOptions = {
  dappMetadata: {
    name: "golyxme",
    url: "https://golyxme.vercel.app/",
  },
};

const chainsObj: readonly [chains.Chain] = [chains.lukso];

const RPC_CHAIN_NAMES: Record<number, string> = {
  [chains.lukso.id]: "lukso-mainnet",
};

export const getHttpUrl = (chainId: number) => {
  const rpcChainName = RPC_CHAIN_NAMES[chainId];
  if (!rpcChainName) return undefined;

  return `https://rpc.mainnet.lukso.network`;
};

export const wagmiConfig = createConfig({
  chains: chainsObj, // ✅ Only Lukso Mainnet is enabled
  connectors: [
    walletConnect({
      projectId:
        process.env.NEXT_PUBLIC_WC_PROJECT_ID! ||
        "3a8170812b534d0ff9d794f19a901d64",
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
