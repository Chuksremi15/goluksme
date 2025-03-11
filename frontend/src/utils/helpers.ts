import { Address } from "viem";

export function truncateAddress(
  address?: Address,
  start?: number,
  end?: number
): string {
  if (!address || address.length !== 42) {
    return "";
  }

  const startAddr: string = address.slice(0, start ?? 5); // First 6 characters (0x + 4 digits)
  const endAddr: string = address.slice(end ?? -4); // Last 3 characters

  return `${startAddr}...${endAddr}`;
}
