"use client";

import React, { useCallback, useEffect, useState } from "react";
import { formatUnits, parseUnits } from "viem";

export interface AmountInputProps {
  amount: bigint;
  decimals: number;
  onAmountChangeAction: (amount: bigint) => void;
  step?: string; // Step as a string to handle decimals, e.g., "0.1"
  max: bigint;
  min: bigint;
  isCard?: boolean;
  stableCoinSymbol?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  decimals,
  onAmountChangeAction,
  min = 0n,
  max,
  isCard = false,
  stableCoinSymbol,
}) => {
  const [inputAmount, setInputAmount] = useState<string>(
    amount ? formatUnits(amount, decimals) : ""
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Validate input to allow only numbers and decimal point
    if (/^\d*(\.\d*)?$/.test(newValue)) {
      setInputAmount(newValue);
      if (newValue === "") {
        onAmountChangeAction(0n); // Handle empty input
        return;
      }

      const newAmount = parseUnits(newValue, decimals);
      if (newAmount >= min && newAmount <= max) {
        onAmountChangeAction(newAmount);
      } else if (newAmount < min) {
        onAmountChangeAction(min);
        setInputAmount(formatUnits(min, decimals));
      } else if (newAmount > max) {
        onAmountChangeAction(max);
        setInputAmount(formatUnits(max, decimals));
      }
    }
  };

  const handleMaxClick = useCallback(() => {
    const maxFormatted = formatUnits(max, decimals);
    setInputAmount(maxFormatted);
    onAmountChangeAction(max);
  }, [max, decimals, onAmountChangeAction]);

  return (
    <div className="flex text-sm font-medium text-center mx-4 gap-x-4 items-center">
      <input
        type="text"
        name="amount"
        id="amount"
        aria-label="amount"
        className={` ${
          inputAmount ? "" : "text-gray2"
        } text-lg bg-transparent text-center max-w-[110px] p-0 sm:leading-6 focus:outline-none focus:border-none focus:ring-0 `}
        inputMode="decimal"
        value={inputAmount}
        onChange={handleInputChange}
        placeholder="0.00"
      />

      <button
        onClick={handleMaxClick}
        aria-label="Set maximum amount"
        className="bg-blue-600 text-white text-xs font-semibold rounded-full px-3 py-1 cursor-pointer"
      >
        Max
      </button>
    </div>
  );
};
