"use client";

import React, { useEffect, useState } from "react";

import img1 from "../../assets/1.jpeg";

import { Address, formatEther, formatUnits } from "viem";
import { truncateAddress } from "@/app/utils/helpers";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/app/components/PageWrapper";
import { AmountInput } from "@/app/components/AmountInput";
import { Button, Spinner } from "@heroui/react";
import { CircularProgressBar } from "@/app/components/CircularProgressBar";
import { useGetCampaign } from "../hook/useGetCampaign";
import { useGetCampaignData } from "@/app/services/campaign/getCampaig";
import { CollapsibleParagraph } from "@/app/components/CollapsibleParagraph";

interface CampaignData {
  title: string;
  description: string;
  goal: number;
  currentAmount: number;
  deadline: Date;
  creator: Address;
}

interface CopyableAddressProps {
  address: Address;
}

const CopyableAddress = ({ address }: CopyableAddressProps) => {
  const [copied, setCopied] = useState(false);

  return (
    <span
      onClick={() => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-sm ml-1 cursor-pointer flex flex-col transition-all duration-500"
    >
      <span>
        {truncateAddress(address)}
        <button
          className="ml-2 text-blue-500 hover:text-blue-700"
          aria-label="Copy Address"
        >
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-clipboard-check"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"
              />
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-clipboard"
              viewBox="0 0 16 16"
            >
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
            </svg>
          )}
        </button>
      </span>
    </span>
  );
};

const Campaign: React.FC = () => {
  const { id } = useParams();

  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    campaign: campaignData,
    isLoading,
    error,
  } = useGetCampaign(typeof id === "string" ? BigInt(id) : BigInt(0));

  const {
    data,
    isLoading: isDataLoading,
    error: isDataError,
  } = useGetCampaignData(campaignData?.dataId ?? "");

  console.log("campaignData", campaignData);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        // TODO: Replace with actual API call
        const mockData: CampaignData = {
          title: "Christopher potter",
          description: "This is a sample campaign description",
          goal: 1000,
          currentAmount: 500,
          deadline: new Date("2024-12-31"),
          creator: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        };

        setCampaign(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching campaign:", error);
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4">
        <h5 className="text-red-500 text-xl font-medium">Campaign not found</h5>
      </div>
    );
  }

  return (
    <PageWrapper>
      {isLoading || isDataLoading ? (
        <div className="flex h-full items-center justify-center py-4 text-pink-500">
          <Spinner />
        </div>
      ) : error || !data ? (
        <></>
      ) : (
        <div className="mt-2 shadow rounded-lg px-6 pt-4 text-black relative">
          <div className="ml-auto w-32">
            {campaignData && <CopyableAddress address={campaignData.owner} />}
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

          {data.socialMedia && (
            <p className="text-sm  text-gray-600 mt-2 underline cursor-pointer">
              View post on social media
            </p>
          )}

          <div className="mt-4 flex relative ">
            <div>
              <h3 className="font-head text-2xl">
                {" "}
                {campaignData && formatEther(campaignData.fundsRaised)} LKS
                raised
              </h3>
              <h3 className="font-body text-base">
                {" "}
                {campaignData && formatEther(campaignData.target)} LKS target
              </h3>
            </div>
            <div className="relative ml-auto h-[65px] w-[65px]">
              {campaignData && (
                <>
                  <CircularProgressBar
                    percentage={Math.round(
                      Number(
                        (campaignData.fundsRaised / campaignData.target) * 100n
                      )
                    )}
                    size={65}
                    strokeWidth={8}
                    color="text-[#41A072]"
                  />

                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center  text-sm">
                    {(campaignData.fundsRaised / campaignData.target) * 100n}%
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
                  {Number(formatEther(4000n)).toFixed(2)} ~ $
                  {Number(formatUnits(3022n, 6)).toFixed(2)}
                </span>
              </p>
            </div>
            <AmountInput
              amount={0n}
              decimals={18}
              onAmountChangeAction={(amount: bigint) => {
                // Handle amount change
              }}
              max={1000n}
              min={0n}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-pink-600 text-white font-semibold py-4 px-4 rounded-md  focus:outline-none mt-6 mb-4  cursor-pointer"
          >
            Donate
          </Button>
        </div>
      )}
    </PageWrapper>
  );
};

export default Campaign;
