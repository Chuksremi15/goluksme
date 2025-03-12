import Link from "next/link";
import { Campaign, useGetCampaign } from "../campaign/hook/useGetCampaign";
import { Address, formatEther } from "viem";
import { Spinner } from "@heroui/react";
import { useGetCampaignData } from "../services/campaign/getCampaig";

export interface CampaignEvent {
  owner: Address;
  title: string;
  dataId: string;
  target: bigint;
}

interface FundraiserCardProps {
  campaign: CampaignEvent;
}

export const FundraiserCard: React.FC<FundraiserCardProps> = ({ campaign }) => {
  const {
    campaign: campaignData,
    isLoading,
    error,
    isError,
  } = useGetCampaign(campaign.owner);

  const {
    data,
    isLoading: isDataLoading,
    error: isDataError,
  } = useGetCampaignData(campaign.dataId);

  return (
    <>
      {isLoading || isDataLoading ? (
        <div className="flex h-[200px] items-center justify-center py-4 text-pink-500">
          <Spinner />
        </div>
      ) : isError || !data || campaignData?.dataId != data._id ? (
        <></>
      ) : (
        <Link href={`/campaign/${campaign.owner}`} className="block">
          <div className="max-w-[200px] rounded-xl overflow-hidden border border-gray-200 shadow hover:shadow-lg transition-all duration-300">
            <img
              src={data.imgurl}
              alt={`${campaignData?.title}'s fundraiser`}
              className="hover:scale-105 transition-all duration-500"
            />
            <div className="p-4">
              <h3 className="text-lg font-body text-black leading-5">
                {campaignData?.title.split(" ").slice(0, 5).join(" ")}...
              </h3>
              <div className="mt-4 font-body">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Raised
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {campaignData && formatEther(campaignData.totalDonations)}{" "}
                    LYS
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Target
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {campaignData && formatEther(campaignData.target)} LYS
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  {campaignData && (
                    <div
                      className="bg-pink-500 h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          Number(
                            (campaignData.totalDonations * 100n) /
                              campaignData.target
                          ),
                          100
                        )}%`,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};
