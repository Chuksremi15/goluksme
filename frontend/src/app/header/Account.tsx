"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useAccount, useDisconnect } from "wagmi";
import { truncateAddress } from "../utils/helpers";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import axios from "axios";
import { useEffect } from "react";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

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
