"use client";

import { Suspense } from "react";
import { useAccount } from "wagmi";
// import { Account } from "../Account";
import { WalletOptions } from "./WalletOptions";
import { Loading } from "../components/utils/Loading";
import { Account } from "./Account";

export function ConnectWallet() {
  const { isConnected } = useAccount();

  return (
    <Suspense fallback={<Loading />}>
      {isConnected ? <Account /> : <WalletOptions />}
    </Suspense>
  );
}
