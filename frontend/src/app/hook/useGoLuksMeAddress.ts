import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { GoLuksMeAddresses } from "@/config/conts";

export default function useGolAddress(): Address {
  const { chainId } = useAccount();

  const [address, setAddress] = useState<Address>();
  useEffect(() => {
    if (chainId) {
      setAddress(GoLuksMeAddresses[chainId]);
    }
  }, [chainId]);
  return address as Address;
}
