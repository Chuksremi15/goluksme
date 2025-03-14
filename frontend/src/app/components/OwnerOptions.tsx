import { Button } from "@heroui/react";
import { useWithdraw } from "../campaign/hook/useWithdraw";
import { useCloseCampaign } from "../campaign/hook/useCloseCampaign";
import { useRouter } from "next/navigation";
import { formatEther } from "viem";
import { AddSocial } from "./AddSocial";

export const OwnerOptions = ({
  balance,
  dataId,
}: {
  balance: bigint;
  dataId: string;
}) => {
  const { withdraw, isLoading: isWithdrawLoading } = useWithdraw();
  const { closeCampaign, isLoading: isCloseCampaignLoading } =
    useCloseCampaign();

  const router = useRouter();

  return (
    <div className="py-4">
      <h3 className="font-body text-base">
        Balance: {formatEther(balance)} LYX
      </h3>
      <div className="flex  gap-x-2 mt-1">
        <Button
          size="sm"
          onPress={async () => {
            await withdraw();
          }}
          isLoading={isWithdrawLoading}
          className=" bg-white text-black flex font-medium justify-center items-center text-sm border px-4 font-body rounded-full border-gray-400 max-w-[150px] hover:bg-gray-200 cursor-pointer transition-all duration-500"
        >
          Withdraw
        </Button>
        <AddSocial dataId={dataId} />
        <Button
          size="sm"
          onPress={async () => {
            const trxHash = await closeCampaign();
            if (trxHash) router.replace("/");
          }}
          isLoading={isCloseCampaignLoading}
          className=" bg-white text-black flex font-medium justify-center items-center text-sm border px-4 font-body rounded-full border-gray-400 max-w-[150px] hover:bg-gray-200 cursor-pointer transition-all duration-500"
        >
          End Campaign
        </Button>
      </div>
    </div>
  );
};
