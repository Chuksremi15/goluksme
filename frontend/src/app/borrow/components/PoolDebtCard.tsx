import React, { useState } from "react";
import { AmountInput } from "./AmountInput";
import { TokenBalance } from "../hook/fetchTokensBalance";

import { useGetTokenValue } from "../hook/useGetTokenValue";

import { USDCAddress } from "@/config/conts";
import { ActiveAmount } from "../hook/useGetLoan";
import { calculateDebt } from "@/app/utils/calculateDebt";
import { Button } from "@heroui/react";

import { truncateAddress } from "@/app/utils/helpers";
import { formatUnits } from "viem";

export const PoolDebtCard = ({
  tokenDetails,
  activeLoan,
}: {
  tokenDetails: TokenBalance;
  activeLoan: ActiveAmount;
}) => {
  const [amount, setAmount] = useState<bigint>(0n);

  const { tokenValue, isLoading, isError } = useGetTokenValue({
    tokenAddress: tokenDetails.address || USDCAddress,
    amount: tokenDetails.balance || 0n,
  });

  //   const [debt, setDebt] = useState(0n);

  const debt = calculateDebt({
    amount: activeLoan.amount,
    timestamp: activeLoan.timestamp,
    totalInterestRate: activeLoan.totalInterestRate,
    prevAccumulatedInterest: activeLoan.prevAccumulatedInterest,
  });

  return (
    <div className="grid grid-cols-5 bg-tablebg rounded-xl py-4 px-2">
      <div className="flex gap-x-2 col-span-2">
        {/* <TokenIcon
          className="bg-blue rounded-full flex items-center justify-center"
          symbol={tokenDetails.symbol || "USDC"}
          variant="background"
          size="44"
          fallback={
            <div className="bg-gray2 rounded-full w-11 h-11 flex items-center justify-center text-white font-bold">
              {tokenDetails.symbol?.substring(0, 2).toUpperCase()}
            </div>
          }
        /> */}
        <p className="text-left flex flex-col">
          <span>
            <span className="text-lg">
              {Number(formatUnits(debt, tokenDetails.decimals)).toFixed(4)}
            </span>{" "}
            <span className="text-sm">
              {" "}
              {tokenDetails.symbol}~ $
              {debt &&
                Number(formatUnits(debt, tokenDetails.decimals)).toFixed(2)}
            </span>
          </span>

          <span className="text-sm">{truncateAddress(activeLoan.lender)}</span>
        </p>
      </div>

      <div className="flex gap-x-1 col-span-3 ">
        <AmountInput
          amount={0n}
          decimals={tokenDetails.decimals || 6}
          onAmountChangeAction={(e) => {
            setAmount(e);
          }}
          max={debt}
          min={0n}
        />

        {amount > 0n && (
          <div className="col-span-1 flex items-center justify-center">
            <Button
              onPress={() => {}}
              className="flex items-center text-sm px-6 py-1 font-body rounded-full"
            >
              Pay Debt
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
