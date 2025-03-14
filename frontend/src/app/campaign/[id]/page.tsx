"use client";

import React, { useState } from "react";

import { formatEther } from "viem";

import { useParams } from "next/navigation";
import { PageWrapper } from "@/app/components/PageWrapper";
import { AmountInput } from "@/app/components/AmountInput";
import { Button, Spinner } from "@heroui/react";
import { CircularProgressBar } from "@/app/components/CircularProgressBar";
import { useGetCampaign } from "../hook/useGetCampaign";
import { useGetCampaignData } from "@/app/services/campaign/getCampaig";
import { CollapsibleParagraph } from "@/app/components/CollapsibleParagraph";
import { CopyableAddress } from "@/app/components/CopyableAddress";
import { useBalance, useAccount } from "wagmi";
import { useDonate } from "../hook/useDonate";
import { Share } from "@/app/components/Share";
import { notification } from "@/app/components/utils/Notification";
import { OwnerOptions } from "@/app/components/OwnerOptions";
import { Profile } from "@/app/components/Profile";

const Campaign: React.FC = () => {
  const { id } = useParams();
  const { address } = useAccount();
  const [amount, setAmount] = useState<bigint>(0n);

  const {
    campaign: campaignData,
    isLoading,
    isError: isGetCampaigError,
  } = useGetCampaign(
    id && /^0x[a-fA-F0-9]{40}$/.test(id.toString())
      ? (id.toString() as `0x${string}`)
      : ("0x0" as `0x${string}`)
  );

  const { data, isLoading: isDataLoading } = useGetCampaignData(
    campaignData?.dataId ?? ""
  );

  const { data: balance } = useBalance({
    address: address,
  });

  const { donate, isLoading: isDonateLoading } = useDonate();

  if (isLoading || isDataLoading) {
    return (
      <PageWrapper>
        <div className="flex h-full items-center justify-center py-4 text-pink-500">
          <Spinner />
        </div>
      </PageWrapper>
    );
  }
  if (isGetCampaigError || !data) {
    return (
      <PageWrapper>
        <div className="text-black p-4 shadow rounded mt-10">
          Unable to fetch campaign for the address
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="mt-2 shadow rounded-2xl px-6 pt-4 pb-6 text-black relative">
        {campaignData && address == campaignData?.owner && (
          <OwnerOptions
            balance={campaignData.totalDonations - campaignData.totalWithdrawn}
            dataId={campaignData.dataId}
          />
        )}

        <div className="ml-auto ">
          {campaignData?.owner && (
            <div className="flex justify-between items-top">
              <Profile address={campaignData.owner} showName={true} />
              <CopyableAddress address={campaignData.owner} />
            </div>
          )}
        </div>
        <div className="">
          <h3 className="text-xl font-head text-black">
            {campaignData?.title}
          </h3>
        </div>
        <img
          src={data.imgurl}
          alt={`${campaignData?.title}'s fundraiser`}
          className=" rounded-xl mt-1"
        />

        <CollapsibleParagraph text={data.description} />

        {data.socialMediaLink && (
          <a href={data.socialMediaLink} target="_blank">
            <p className="text-sm  text-gray-600 mt-2 underline cursor-pointer">
              View post on social media
            </p>
          </a>
        )}

        <div className="mt-4 flex relative ">
          <div>
            <h3 className="font-head text-2xl">
              {" "}
              {campaignData && formatEther(campaignData.totalDonations)} LYX
              raised
            </h3>
            <h3 className="font-body text-base">
              {" "}
              {campaignData && formatEther(campaignData.target)} LYX target
            </h3>
          </div>
          <div className="relative ml-auto h-[65px] w-[65px]">
            {campaignData && (
              <>
                <CircularProgressBar
                  percentage={Math.round(
                    Number(
                      (campaignData.totalDonations * 100n) / campaignData.target
                    )
                  )}
                  size={65}
                  strokeWidth={8}
                  color="text-[#41A072]"
                />

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center  text-sm">
                  {Number(
                    (campaignData.totalDonations * 100n) / campaignData.target
                  )}
                  %
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-5 flex justify-between">
          <div className="flex gap-x-2 col-span-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                fill="#FE005B"
                fillRule="evenodd"
                d="m13.475 3.4 5.15 3.006A2.99 2.99 0 0 1 20.1 8.991v6.015c0 1.065-.564 2.05-1.476 2.585l-5.149 3.008a2.92 2.92 0 0 1-2.95 0l-5.15-3.008A3 3 0 0 1 3.9 15.006V8.99a3 3 0 0 1 1.475-2.585l5.15-3.005a2.92 2.92 0 0 1 2.95 0m1.08 11.88 1.532-2.683q.039-.07.069-.142a1.2 1.2 0 0 0-.075-1.052L14.549 8.72a1.17 1.17 0 0 0-1.02-.597h-3.063c-.422 0-.812.227-1.022.597l-1.531 2.683c-.21.37-.21.824 0 1.194l1.534 2.683a1.18 1.18 0 0 0 1.021.597h3.066q.04 0 .079-.002c.391-.027.746-.248.942-.595"
                clipRule="evenodd"
              />
            </svg>

            <p className="text-left flex flex-col ">
              <span>Lukso</span>
              <span className="text-sm">
                {balance
                  ? Number(formatEther(balance.value)).toFixed(2)
                  : "0.00"}
                {/* ~ $
                  {Number(formatUnits(3022n, 6)).toFixed(2)} */}
              </span>
            </p>
          </div>
          <AmountInput
            amount={0n}
            decimals={18}
            onAmountChangeAction={(amount: bigint) => {
              setAmount(amount);
            }}
            max={balance ? balance.value : 0n}
            min={0n}
          />
        </div>
        <Button
          type="submit"
          onPress={async () => {
            if (campaignData?.owner) {
              await donate(campaignData.owner, amount);
            } else {
              notification.error({
                message: "Campaign owner address not found",
              });
            }
          }}
          isLoading={isDonateLoading}
          className="w-full bg-pink-500 text-white font-semibold py-4 px-4 rounded-md  focus:outline-none mt-6 mb-2  cursor-pointer"
        >
          Donate
        </Button>
        <Share url={window.location.href} title={campaignData?.title || ""} />
      </div>
    </PageWrapper>
  );
};

export default Campaign;
