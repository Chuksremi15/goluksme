import { TokenIcon } from "@web3icons/react";
import React from "react";
import { AmountInput } from "./AmountInput";
import { Button, Spinner } from "@heroui/react";
import { useGetBorrowersFinancials } from "../hook/useGetBorrowersFinancials";
import { formatUnits } from "viem";
import PayDebtModal from "./PayDebtModal";

export const DebtCard = () => {
  const { financials, isLoading } = useGetBorrowersFinancials();

  return (
    <div className=" border border-gray2 py-4 px-6 rounded-xl h-full ">
      <div className="h-[50%]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center py-4">
            <span className="text-white">
              <Spinner />
            </span>
          </div>
        ) : (
          <div className="">
            <p className="text-gray text-sm">Position Summary</p>
            <div className="mt-4 text-base font-[500] flex items-center justify-between">
              <span>Pool Collateral Balance:</span>{" "}
              <span>
                ${financials ? formatUnits(BigInt(financials[0]), 6) : "0"}
              </span>
            </div>

            <div className="mt-4 text-base font-[500] flex items-center justify-between">
              <span>Liquidation Point:</span>{" "}
              <span>
                {financials ? formatUnits(BigInt(financials[3]), 6) : "0"}
              </span>
            </div>
            <div className="mt-4 text-base font-[500] flex items-center justify-between">
              <span>Pool Debt:</span>{" "}
              <span>
                ${financials ? formatUnits(BigInt(financials[2]), 6) : "0"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center h-[50%] justify-center">
        <PayDebtModal />
      </div>
    </div>
  );
};
