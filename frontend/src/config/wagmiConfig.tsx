import {
  createClient,
  createTestClient,
  http,
  isAddress,
  defineChain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as chains from "viem/chains";
import { cookieStorage, createConfig, createStorage } from "wagmi";
import {
  // coinbaseWallet,
  injected,
  metaMask,
  mock,
  MockParameters,
  walletConnect,
} from "wagmi/connectors";

const MetaMaskOptions = {
  dappMetadata: {
    name: "frenFinance",
    url: "https://frenfinance.com",
  },
  // Other options.
};

const chainsObj: readonly [chains.Chain, ...chains.Chain[]] = [
  chains.hardhat,
  chains.lukso,
  chains.luksoTestnet,
];

const RPC_CHAIN_NAMES: Record<number, string> = {
  [chains.lukso.id]: "lukso-mainnet",
  [chains.luksoTestnet.id]: "lukso-testnet",
};

export const getHttpUrl = (chainId: number) => {
  const rpcChainName = RPC_CHAIN_NAMES[chainId];
  if (!rpcChainName) return undefined;

  if (chainId === chains.hardhat.id) {
    return "http://127.0.0.1:8545";
  }

  return `https://${rpcChainName}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
};

export const wagmiConfig = createConfig({
  chains: chainsObj,
  connectors: [
    // coinbaseWallet(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
    }),
    metaMask(MetaMaskOptions),
    // injected(),
    mock({
      accounts: [
        privateKeyToAccount(
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
        ).address,
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      ],
    }),
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
  //transports,
});

export function createMockConfig(
  addressOrPkey: `0x${string}`,
  features?: MockParameters["features"]
) {
  const account = isAddress(addressOrPkey)
    ? addressOrPkey
    : privateKeyToAccount(addressOrPkey);

  const address = typeof account === "string" ? account : account.address;
  return createConfig({
    connectors: [mock({ accounts: [address], features })],
    chains: [chains.hardhat],
    client: ({ chain }) =>
      createTestClient({
        account,
        chain: chains.hardhat,
        mode: "hardhat",
        transport: http(),
      }),
    ssr: true,
  });
}
