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

export function extractIndexedAddresses(log?: {
  topics: (`0x${string}` | Uint8Array)[];
}): string[] {
  if (!log || !Array.isArray(log.topics) || log.topics.length <= 1) {
    console.error("Log is undefined or has insufficient topics");
    return [];
  }
  const topic = log.topics[1];
  if (typeof topic === "string" && topic.startsWith("0x")) {
    // Extract the 20-byte address from the 32-byte topic (remove padding)
    return [`0x${topic.slice(26)}`]; // Ethereum addresses are the last 40 hex chars
  } else {
    console.error("Invalid topic format:", topic);
    return [];
  }
}
