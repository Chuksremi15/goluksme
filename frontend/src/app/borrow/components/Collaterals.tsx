import React, { useState } from "react";

import { Button } from "@heroui/react";
import { useTokenBalances } from "../hook/useFetchTokensBalance";
import { supportedCollaterals } from "./collateral";
import { hardhat } from "viem/chains";
import { Address } from "viem";
import { CollateralCard } from "./CollateralCard";
import { useSupplyCollateral } from "../hook/useSupplyCollateral";
import useGoLuksMeAddress from "@/app/hook/useGoLuksMeAddress";

export const Collaterals = () => {
  const { balances, isLoading: isBalanceLoading } = useTokenBalances(
    supportedCollaterals[hardhat.id]
  );

  const { supplyCollateral, isLoading } = useSupplyCollateral();

  const [collaterals, setCollaterals] = useState<
    { token: Address; amount: bigint }[]
  >([]);

  const [error, setError] = useState<string | null>(null);

  const handleAssetChange = (token: Address, amount: bigint) => {
    setCollaterals((prev) => {
      const existingCollateral = prev.find(
        (collateral) => collateral.token === token
      );

      if (amount === 0n) {
        // Remove the collateral if the amount is zero
        setError(null); // Clear error if any
        return prev.filter((collateral) => collateral.token !== token);
      }

      if (existingCollateral) {
        // Update the existing collateral amount
        setError(null); // Clear error if any
        return prev.map((collateral) =>
          collateral.token === token ? { ...collateral, amount } : collateral
        );
      } else {
        // Add new collateral if length is less than 5
        if (prev.length < 5) {
          setError(null); // Clear error if any
          return [...prev, { token, amount }];
        } else {
          setError(
            "Collaterals can not be more that 5, set an existing collateral input to 0 to remove"
          );
          return prev;
        }
      }
    });
  };

  const handleClearAll = () => {
    setCollaterals([]);
  };

  return (
    <div>
      <p className="text-sm text-gray">Supply Max of 5 Collaterrals</p>

      {error && <div className="text-sm text-red">{error}</div>}
      <div className="flex flex-col gap-y-2 h-[500px] overflow-y-scroll mt-5">
        {isBalanceLoading ? (
          <></>
        ) : (
          balances?.map((token) => (
            <CollateralCard
              token={token}
              key={token.address}
              name={token.name}
              symbol={token.symbol.toLocaleLowerCase()}
              handleAssetChange={handleAssetChange}
            />
          ))
        )}
      </div>
      <div className="flex items-center justify-center gap-x-2  py-4">
        <Button
          onPress={(onOpen: any) => onOpen}
          className="flex items-center justify-items-center px-6 py-3 font-body rounded-full"
        >
          Withdraw Collateral
        </Button>
        <Button
          onPress={async () => {
            await supplyCollateral(collaterals);
          }}
          isLoading={isLoading}
          className="flex items-center justify-items-center px-6 py-3 font-body rounded-full"
        >
          Supply {collaterals.length < 2 ? "Collateral" : "Collaterals"}
        </Button>
      </div>
    </div>
  );
};
