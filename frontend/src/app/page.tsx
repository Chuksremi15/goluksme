"use client";

import React, { useEffect, useState } from "react";
import { PageWrapper } from "./components/PageWrapper";
import { CampaignEvent, FundraiserCard } from "./components/FundraiserCard";
import { useEventHistory } from "./hook/useEventHistory";
import { Button, Spinner } from "@heroui/react";
import Link from "next/link";

const Page = () => {
  // const { data: currentBlock } = useBlockNumber();

  const { data, isLoading, error } = useEventHistory({
    eventName: "CampaignCreated",
    fromBlock: 1n,
    blockData: true,
    transactionData: true,
    receiptData: true,
  });

  const [campaigns, setCampaigns] = useState<CampaignEvent[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const extractcampaignAddress = () => {
        const campaignArr: CampaignEvent[] = [];
        data.forEach((event) => {
          campaignArr.push(event.args);
        });

        return campaignArr;
      };

      const campaignArr = extractcampaignAddress();

      setCampaigns(campaignArr);
    }
  }, [data]);

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto bg-white border rounded-3xl shadow-md overflow-hidden my-8">
        <div className="p-8">
          <div className="uppercase tracking-wide text-2xl font-semibold text-pink-500 mb-2">
            The Social Good App
          </div>
          <p className="mt-2 text-slate-500">
            Empowering positive change through blockchain technology. Connect,
            contribute, and create meaningful impact in communities worldwide
            through transparent and efficient fundraising campaigns.
          </p>
          <div className="mt-6">
            <Link href="/create">
              <Button className="bg-pink-500  text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors duration-200">
                Start Campaign
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="tracking-wide text-2xl font-body text-dark mb-2">
        Active Campaigns
      </div>
      {isLoading ? (
        <div className="flex h-full items-center justify-center py-4 text-pink-500">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex text-red justify-center items-center mt-20">
          Can not fetch at the moment
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 pt-4">
          {campaigns.map((campaign, index) => (
            <FundraiserCard campaign={campaign} key={index} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default Page;
