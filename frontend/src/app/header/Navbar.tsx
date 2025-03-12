"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { ConnectWallet } from "./ConnectWallet";
import { useAccount, useDisconnect } from "wagmi";
import { SelectChain } from "./SelectChain";
import { Button } from "@heroui/react";
import Logo from "../assets/logo.svg";

{
  /* <Image
className="dark:invert"
src="/next.svg"
alt="Next.js logo"
width={180}
height={38}
priority
/>


font-[family-name:var(--font-geist-mono)]

<code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold"> */
}

export function Navbar() {
  const { address } = useAccount();
  const navLinks = [
    {
      linkPath: "/pools",
      displayText: "pools",
      subNav: [],
    },
    {
      linkPath: "/lender",
      displayText: "Supply",
      subNav: [],
    },
    {
      linkPath: "/analytics",
      displayText: "Analytics",
      subNav: [],
    },
  ];

  const pathname = usePathname();

  const isActive = (linkPath: string, subNav: string[]) => {
    return (
      pathname === linkPath ||
      subNav.some((sub) => pathname.includes(`${linkPath}/${sub}`))
    );
  };

  return (
    <div
      style={{ scrollbarWidth: "none" }}
      className="w-full  overflow-scroll  "
    >
      <div className="w-[700px] flex justify-center items-center gap-x-2 text-black">
        <Link href="/">
          <img
            src={Logo.src}
            alt="GoluksMe"
            className="mt-1 cursor-pointer w-28"
          />
        </Link>
        <div className="flex justify-center items-center gap-x-2">
          <SelectChain />
          <ConnectWallet />
        </div>
        <Link href="/create">
          <Button
            size="sm"
            className="ml-auto bg-white text-black flex font-medium justify-center items-center text-sm border px-4 font-body rounded-full border-gray-400 max-w-[150px] hover:bg-gray-200 cursor-pointer transition-all duration-500"
          >
            Start a GoluksMe
          </Button>
        </Link>
        <Link href={`/campaign/${address}`}>
          <Button
            size="sm"
            className="ml-auto  bg-white text-black flex font-medium justify-center items-center text-sm border px-4 font-body rounded-full border-gray-400 max-w-[150px] hover:bg-gray-200 cursor-pointer transition-all duration-500"
          >
            My Campaign
          </Button>
        </Link>
      </div>
    </div>
  );
}
