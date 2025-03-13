"use client";

import { Button } from "@heroui/react";
import { useAccount, useSwitchChain } from "wagmi";
import { useEffect } from "react";

const LUKSO_MAINNET_ID = 42_000; // Lukso Mainnet Chain ID

export const SelectChain = () => {
  const { switchChainAsync } = useSwitchChain();
  const { chain, isConnected } = useAccount();

  const switchToLukso = async () => {
    if (chain?.id !== LUKSO_MAINNET_ID) {
      try {
        await switchChainAsync({
          chainId: LUKSO_MAINNET_ID,
        });
      } catch (error) {
        console.error("Failed to switch to Lukso:", error);
      }
    }
  };

  // Automatically switch to Lukso on mount
  useEffect(() => {
    console.log("isConnected:", isConnected);
    console.log("Current Chain ID:", chain?.id);
    console.log("switchChainAsync exists:", !!switchChainAsync);

    if (isConnected) {
      switchToLukso();
    }
  }, [isConnected, chain?.id, switchChainAsync]);

  return (
    <>
      {isConnected ? (
        <Button
          className="capitalize px-8 border border-black text-black rounded-full"
          size="sm"
          color={"default"}
          variant={"bordered"}
          onPress={switchToLukso}
        >
          {chain?.name || "Unknown Chain"}
        </Button>
      ) : null}
    </>
  );
};
