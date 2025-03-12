"use client";

import React from "react";
import { Collaterals } from "../components/Collaterals";
import { useAccount } from "wagmi";
import { DebtCard } from "../components/DebtCard";
import { BorrowCard } from "../components/BorrowCard";
import { useGetLoan } from "../hook/useGetLoan";

const page = () => {
  const { chain } = useAccount();

  const { loan } = useGetLoan();

  console.log("loan", loan);

  console.log("chain", chain);

  return (
    <div>
      <div className="container mx-auto max-w-6xl px-4">
        <div className="h-full w-full  p-4 rounded-xl mt-6 bg-dark">
          <div className="grid h-full grid-cols-5 gap-x-2 mt-4">
            <div className="col-span-3 h-full border border-gray2 p-4 rounded-xl ">
              <h5 className="text-left text-lg">Collaterals</h5>
              <Collaterals />
            </div>

            <div className="flex flex-col gap-y-2 col-span-2">
              <BorrowCard />
              <DebtCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
