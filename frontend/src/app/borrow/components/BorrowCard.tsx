import React, { useEffect, useState } from "react";
import { LenderCard } from "./LenderCard";
import { lenderData } from "@/app/mockData/lenderData";
import { TokenIcon } from "@web3icons/react";
import { AmountInput } from "./AmountInput";
import { Button } from "@heroui/react";
import { useBorrow } from "../hook/useBorrow";
import { useGetTokenValue } from "../hook/useGetTokenValue";
import { Address, formatUnits } from "viem";
import { useTokenBalances } from "../hook/useFetchTokensBalance";
import { USDCAddress } from "@/config/conts";
import { useGetBorrowersFinancials } from "../hook/useGetBorrowersFinancials";
import { useParams } from "next/navigation";
import { useEventHistory } from "@/app/hook/useEventHistory";

export const BorrowCard = () => {
  const params = useParams();
  const lenderAddress = params.lender_address;

  const { data, isLoading, error } = useEventHistory({
    eventName: "NewLender",
    fromBlock: 11895839n,
    blockData: true,
    transactionData: true,
    receiptData: true,
  });

  const [pools, setPools] = useState<string[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      console.log(data);
      console.log(data[0]?.args?.lender);

      const extractLenderAddress = () => {
        const lenderArr: string[] = [];
        data.forEach((event) => {
          lenderArr.push(event.args?.lender);
        });

        return lenderArr;
      };

      const lenderArr = extractLenderAddress();

      setPools(lenderArr);
    }
  }, [data]);

  const { balances, isLoading: isBalanceLoading } = useTokenBalances([
    USDCAddress,
  ]);

  const { financials, isLoading: isLoadingFinancials } =
    useGetBorrowersFinancials();

  const [amount, setAmount] = useState<bigint>(0n);

  const { tokenValue } = useGetTokenValue({
    tokenAddress: balances && balances[0].address,
    amount: balances && balances[0].balance,
  });

  const handleChange = (amount: bigint) => {
    setAmount(amount);
  };

  const { borrow, isLoading: isBorrowLoading } = useBorrow(
    lenderAddress ? (lenderAddress as Address) : (pools[0] as Address)
  );

  return (
    <div className="h-full border border-gray2 py-4 px-6 rounded-xl w-full">
      <LenderCard lender={lenderData[0]} lenderAddress={lenderAddress} />

      {isBalanceLoading || isLoadingFinancials ? (
        <div></div>
      ) : (
        balances && (
          <>
            <div className="mt-4 text-base font-[500] flex items-center justify-between">
              <span>Borrow Capacity:</span>{" "}
              <span> ${financials ? formatUnits(financials[1], 6) : "0"}</span>
            </div>

            <div className=" w-full pt-5">
              <div className="flex">
                <p className="text-left flex gap-x-2 items-center">
                  <TokenIcon
                    className="bg-blue rounded-full"
                    symbol={balances[0].symbol}
                    variant="background"
                    size="24"
                  />

                  <span className="text-base">{balances[0].symbol}</span>
                  <span className="text-sm">
                    {Number(
                      formatUnits(balances[0].balance, balances[0].decimals)
                    ).toFixed(2)}{" "}
                    ~ $
                    {tokenValue &&
                      Number(formatUnits(tokenValue, 6)).toFixed(2)}
                  </span>
                </p>
              </div>

              <div className="flex justify-between pt-8">
                <AmountInput
                  amount={0n}
                  decimals={balances[0].decimals}
                  onAmountChangeAction={(e) => {
                    setAmount(e);
                    handleChange(e);
                  }}
                  max={financials ? financials[1] : 0}
                  min={0n}
                />
                <Button
                  onPress={() => {
                    borrow(amount);
                  }}
                  isDisabled={BigInt(amount) === 0n}
                  isLoading={isBorrowLoading}
                  size="md"
                  className="flex items-center text-sm px-12 py-1 font-body rounded-full"
                >
                  Borrow
                </Button>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};
