"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useAccount, useChainId, useDisconnect } from "wagmi";
import { truncateAddress } from "../utils/helpers";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import axios from "axios";
import { useEffect } from "react";
import { useChainMonitor } from "./useChainMonitor";
import { switchOrAddChain } from "./useChainSwitch";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const chainId = useChainId();

  const walletNetworkChain = useChainMonitor();

  useEffect(() => {
    const login = async () => {
      if (!address) return;

      try {
        await axios.post("/api/auth/login/", { address });
        // Store the JWT in a cookie
      } catch (error) {
        console.error("Error logging in:", error);
      }
    };
    if (address) {
      login();
    }
  }, [address]);

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Handle disconnect event
  const handleDisconnect = () => {
    logout(); // Delete the JWT when the wallet is disconnected
    disconnect(); // Disconnect the wallet
  };

  const handleSwitchChain = async () => {
    await switchOrAddChain({
      chainId: "0x1069", // 4201 in hex
      chainName: "LUKSO Testnet",
      rpcUrls: ["https://rpc.testnet.lukso.network"],
      blockExplorerUrls: ["https://explorer.execution.testnet.lukso.network"],
      nativeCurrency: {
        name: "LUKSO",
        symbol: "LYXt",
        decimals: 18,
      },
    });
  };

  if (walletNetworkChain !== chainId) {
    return (
      <Dropdown>
        <DropdownTrigger>
          <div className="w-[150px] flex items-center justify-center cursor-pointer  rounded-full   bg-rose-500 text-white">
            <p className="my-auto text-sm" data-testid="walletAddress">
              Wrong Network
            </p>
            <MdOutlineKeyboardArrowDown size={"30px"} />
          </div>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Static Actions"
          color={"default"}
          variant={"flat"}
        >
          <DropdownItem
            onPress={handleSwitchChain}
            key="disconect"
            className="text-danger text-center border border-gray-400 font-body  rounded-full"
          >
            Switch Chain
          </DropdownItem>
          <DropdownItem
            onPress={handleDisconnect}
            key="disconect"
            className="text-danger text-center border border-gray-400 font-body  rounded-full"
          >
            Disconnect
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <div className="flex gap-x-2 cursor-pointer items-center justify-center border border-gray-400 rounded-full px-2">
          <p className="my-auto text-sm" data-testid="walletAddress">
            {address ? truncateAddress(address) : "Not connected"}
          </p>
          <MdOutlineKeyboardArrowDown size={"30px"} />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        color={"default"}
        variant={"flat"}
      >
        <DropdownItem
          onPress={handleDisconnect}
          key="disconect"
          className="text-danger text-center border border-gray-400 font-body  rounded-full"
        >
          Disconnect
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
