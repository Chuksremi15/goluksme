import { hardhat, neonDevnet, neonMainnet, sepolia } from "viem/chains";

export const supportedCollaterals: { [p: number]: `0x${string}`[] } = {
  [hardhat.id]: [
    "0x6982508145454Ce325dDbE47a25d4ec3d2311933", // Mainnet pepe token address
    "0x514910771AF9Ca656af840dff83E8264EcF986CA", // Mainnet Link token address
    "0x44ff8620b8cA30902395A7bD3F2407e1A091BF73", // Virtual Link token address
    "0xadd39272E83895E7d3f244f696B7a25635F34234", //PEPU token address
    "0x340D2bdE5Eb28c1eed91B2f790723E3B160613B7", //VEE token address
    "0x761D38e5ddf6ccf6Cf7c55759d5210750B5D60F3", //ELON token address
  ],
};
