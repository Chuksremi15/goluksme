import { TokenIcon } from "@web3icons/react";
import React, { useEffect, useState } from "react";

import { AmountInput } from "./AmountInput";

import { TokenBalance } from "../hook/fetchTokensBalance";
import { Address, formatEther, formatUnits } from "viem";
import { useGetTokenValue } from "../hook/useGetTokenValue";

import useApprove from "../hook/useApprove";

export const CollateralCard = ({
  token,
  name,
  symbol,
  handleAssetChange,
  min = 0n,
}: {
  token: TokenBalance;
  name: string;
  symbol: string;
  min?: bigint;
  handleAssetChange: (address: Address, amount: bigint) => void;
}) => {
  const [amount, setAmount] = useState<bigint>(0n);

  const { tokenValue, isLoading, isError } = useGetTokenValue({
    tokenAddress: token.address,
    amount: token.balance,
  });

  const {
    isApproved,
    approvedLoading,
    error,
    handleApproveClick,
    allowance,
    isLoadingAllowance,
    setIsApproved,
  } = useApprove(token, amount);

  useEffect(() => {
    if (allowance) {
      setIsApproved(allowance >= amount);
    }
  }, [allowance, min, amount]);

  return (
    <div className="grid grid-cols-5 bg-tablebg rounded-xl p-2">
      <div className="flex gap-x-2 col-span-2">
        {/* <TokenIcon
          className="bg-blue rounded-full"
          symbol={symbol}
          variant="background"
          size="44"
        /> */}

        <TokenIcon
          className="bg-blue rounded-full flex items-center justify-center"
          symbol={symbol}
          variant="background"
          size="44"
          fallback={
            <div className="bg-gray2 rounded-full w-11 h-11 flex items-center justify-center text-white font-bold">
              {symbol?.substring(0, 2).toUpperCase()}
            </div>
          }
        />
        <p className="text-left flex flex-col">
          <span>{name}</span>
          <span className="text-sm">
            {Number(formatEther(token.balance)).toFixed(4)} ~ $
            {tokenValue && Number(formatUnits(tokenValue, 6)).toFixed(2)}
          </span>
        </p>
      </div>

      <div className="flex gap-x-1 col-span-3 ">
        {!isLoadingAllowance &&
          (allowance ? (
            <AmountInput
              amount={allowance}
              decimals={token.decimals}
              onAmountChangeAction={(e) => {
                setAmount(e);
                handleAssetChange(token.address, e);
              }}
              max={token.balance}
              min={0n}
            />
          ) : (
            <AmountInput
              amount={0n}
              decimals={token.decimals}
              onAmountChangeAction={(e) => {
                setAmount(e);
                handleAssetChange(token.address, e);
              }}
              max={token.balance}
              min={0n}
            />
          ))}

        {amount > 0n && (
          <div className="col-span-1 flex items-center justify-center">
            <button
              onClick={handleApproveClick}
              // disabled={approvedLoading || isApproved} // Disable while processing
              className={`${isApproved ? "bg-green-600" : "bg-gradient-to-r from-blue to-orange"}  gap-2 px-3 font-semibold py-1.5 my-auto text-xs text-gray-900  rounded-2xl transition-all duration-300`}
            >
              {approvedLoading
                ? "Approving..."
                : isApproved
                  ? "Approved"
                  : "Approve"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
