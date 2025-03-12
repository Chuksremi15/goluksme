import { Address } from "viem";
import { hardhat } from "viem/chains";

interface GoLuksMeAddressType {
  [key: number]: Address;
}

export const GoLuksMeAddresses: GoLuksMeAddressType = {
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
};

export const priceOracleAddress = "0x2B07F89c9F574a890F5B8b7FddAfbBaE40f6Fde2";

export const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
