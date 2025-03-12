"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useBlockNumber } from "wagmi";
import { PageWrapper } from "./components/PageWrapper";
import { CampaignEvent, FundraiserCard } from "./components/FundraiserCard";
import { useEventHistory } from "./hook/useEventHistory";
import { Spinner } from "@heroui/react";

const page = () => {
  const { data: currentBlock } = useBlockNumber();

  const { data, isLoading, error } = useEventHistory({
    eventName: "CampaignCreated",
    fromBlock: 1n,
    blockData: true,
    transactionData: true,
    receiptData: true,
  });

  console.log("data", data);

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

export default page;
