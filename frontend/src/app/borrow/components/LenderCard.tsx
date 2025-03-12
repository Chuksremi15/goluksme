import { useEventHistory } from "@/app/hook/useEventHistory";
import { useFetchPoolBalance } from "@/app/lender/hooks/useFetchPoolBalance";
import { lenderData, LenderData } from "@/app/mockData/lenderData";
import { truncateAddress } from "@/app/utils/helpers";
import { Button, Spinner } from "@heroui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsCopy } from "react-icons/bs";
import { Address, formatUnits } from "viem";
import { useBlockNumber } from "wagmi";

// New component definition to be placed in a separate file:
interface CopyableAddressProps {
  address: Address;
}

const CopyableAddress = ({ address }: CopyableAddressProps) => {
  const [copied, setCopied] = useState(false);

  return (
    <span className="text-sm ml-1 cursor-pointer flex flex-col transition-all duration-500">
      <span>
        {truncateAddress(address)}
        <button
          onClick={() => {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="ml-2 text-blue-500 hover:text-blue-700"
          aria-label="Copy Address"
        >
          <BsCopy />
        </button>
      </span>
      {copied && (
        <span className="ml-auto text-xs text-green-500">Copied!</span>
      )}
    </span>
  );
};

export const LenderCard = ({
  lender,
  lenderAddress,
}: {
  lender: LenderData;
  lenderAddress: string | string[] | undefined;
}) => {
  const { data: currentBlock } = useBlockNumber();

  const { data, isLoading, error } = useEventHistory({
    eventName: "NewLender",
    fromBlock: currentBlock ? 11895839n : 0n,
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

  const [sortedlenderData, setLenderData] = useState(lenderData);

  const { poolBalance, isLoading: isLoadingPoolBalance } = useFetchPoolBalance(
    lenderAddress ? (lenderAddress as Address) : (pools[0] as Address)
  );

  console.log("pools[0]", pools[0]);

  return (
    <div>
      {isLoading || isLoadingPoolBalance ? (
        <div className="w-full h-[100px] flex items-center justify-center ">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col bg-gray-800  py-2  shadow-lg border-b border-gray2 hover:bg-gray-750 transition">
          <div className="flex justify-between">
            <div className="text-sm flex flex-col text-gray-300">
              <span className="text-xs text-gray">Pool Balance</span>
              <span className="text-white text-2xl ml-1">
                ${poolBalance ? formatUnits(poolBalance, 6) : "N/A"}
              </span>
            </div>

            <div className="text-white flex flex-col  justify-between">
              <CopyableAddress
                address={
                  lenderAddress
                    ? (lenderAddress as Address)
                    : (pools[0] as Address)
                }
              />
              <Link href="/pools" prefetch={true}>
                <Button
                  className="text-xs rounded-full bg-gradient-to-r from-blue to-orange"
                  onPress={() => {
                    console.log("clicked");
                  }}
                  size="sm"
                >
                  Choose Pool
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col text-sm">
            <div className="mt-2 text-gray-300 flex justify-between">
              <span className="text-white">Low Cap APY:</span>
              <span className="text-green ml-1">{lender.minAPY}</span>
            </div>
            <div className="mt-2 text-gray-300 flex justify-between">
              <span className="text-white">Mid Cap APY:</span>

              <span className=" ml-1">{lender.midAPY}</span>
            </div>
            <div className="mt-2 text-gray-300 flex justify-between">
              <span className="text-white">High Cap APY:</span>
              <span className=" ml-1">{lender.maxAPY}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
