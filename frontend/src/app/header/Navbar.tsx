"use client";

import Link from "next/link";
import * as React from "react";
import { ConnectWallet } from "./ConnectWallet";
import { useAccount } from "wagmi";
import { SelectChain } from "./SelectChain";
import { Button } from "@heroui/react";
import Logo from "../assets/logo.svg";

export function Navbar() {
  const { address } = useAccount();

  return (
    <div
      style={{ scrollbarWidth: "none" }}
      className="w-full  overflow-scroll  "
    >
      <div className="w-[520px] flex  gap-x-1 text-black">
        <Link href="/">
          <img
            src={Logo.src}
            alt="GoluksMe"
            className="mt-1 cursor-pointer w-28"
          />
        </Link>
        <div className="flex justify-center items-center gap-x-2">
          {/* <SelectChain /> */}
          <ConnectWallet />
        </div>
        <Link href="/create">
          <Button
            size="sm"
            className="ml-auto bg-white text-black flex font-medium justify-center items-center text-sm border px-4 font-body rounded-full border-gray-400 max-w-[140px] hover:bg-gray-200 cursor-pointer transition-all duration-500"
          >
            Start Campaign
          </Button>
        </Link>
        <Link href={`/campaign/${address}`}>
          <Button
            size="sm"
            className="ml-auto  bg-white text-black flex font-medium justify-center items-center text-sm border px-4 font-body rounded-full border-gray-400 max-w-[140px] hover:bg-gray-200 cursor-pointer transition-all duration-500"
          >
            My Campaign
          </Button>
        </Link>
      </div>
    </div>
  );
}
