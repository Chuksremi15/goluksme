"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
} from "@heroui/react";
import { useAccount, useConfig, useSwitchChain } from "wagmi";
import { Chain } from "viem";

export const SelectChain = () => {
  // const { chains: configChain } = useConfig();

  const { chains, switchChainAsync } = useSwitchChain();

  let { chain, isConnected } = useAccount();

  const switchChain = async (id: number) => {
    const filteredChain: Chain[] = chains.filter(
      (chain) => chain.id === chain.id
    );

    await switchChainAsync({
      addEthereumChainParameter: {
        iconUrls: ["https://example.com/icon.png"],
      },
      chainId: id,
    });
  };

  return (
    <>
      {isConnected ? (
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="capitalize px-8 border border-black text-black rounded-full"
              size="sm"
              color={"default"}
              variant={"bordered"}
            >
              {chain ? <>{chain.name}</> : <>Select Chain</>}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Dropdown Variants"
            color={"default"}
            variant={"flat"}
          >
            {chains.map((chain) => (
              <DropdownItem
                onPress={() => switchChain(chain.id)}
                key={chain.id}
                className="text-black"
              >
                {chain.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      ) : (
        <></>
      )}
    </>
  );
};
