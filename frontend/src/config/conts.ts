import { Address } from "viem";
import { hardhat } from "viem/chains";

interface GoLuksMeAddressType {
  [key: number]: Address;
}

export const GoLuksMeAddresses: GoLuksMeAddressType = {
  [hardhat.id]: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
};

export const priceOracleAddress = "0x2B07F89c9F574a890F5B8b7FddAfbBaE40f6Fde2";

export const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
