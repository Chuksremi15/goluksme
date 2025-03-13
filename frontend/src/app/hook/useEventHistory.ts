import CrowdFundABI from "@/abis/CrowdFund.json";
import { useEffect, useState } from "react";
import { Abi, AbiEvent, BlockTag } from "viem";
import { usePublicClient } from "wagmi";
import deployedContracts from "../../../contracts/deployedContracts";
import { GenericContractsDeclaration } from "@/utils/scaffold-eth/contract";
import { hardhat } from "viem/chains";

/**
 * @dev reads events from a deployed contract
 * @param config - The config settings
 * @param config.contractName - deployed contract name
 * @param config.eventName - name of the event to listen for
 * @param config.fromBlock - the block number to start reading events from
 * @param config.filters - filters to be applied to the event (parameterName: value)
 * @param config.blockData - if set to true it will return the block data for each event (default: false)
 * @param config.transactionData - if set to true it will return the transaction data for each event (default: false)
 * @param config.receiptData - if set to true it will return the receipt data for each event (default: false)
 */
export const useEventHistory = ({
  eventName,
  fromBlock,
  blockData,
  transactionData,
  receiptData,
}: {
  eventName: string;
  fromBlock: bigint | BlockTag | undefined;
  filters?: Record<string, any>;
  blockData?: boolean;
  transactionData?: boolean;
  receiptData?: boolean;
}) => {
  const [events, setEvents] = useState<any[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  const publicClient = usePublicClient();

  const contracts = deployedContracts as GenericContractsDeclaration | null;
  const chainId = hardhat.id;
  const deployedContractsOnChain = contracts ? contracts[chainId] : {};
  const contract = deployedContractsOnChain["CrowdFund"];
  const contractAddress = contract.address;

  useEffect(() => {
    async function readEvents() {
      try {
        if (!publicClient) {
          throw new Error("Publiclient not defined");
        }

        const event = (CrowdFundABI as Abi).find(
          (part) => part.type === "event" && part.name === eventName
        ) as AbiEvent;

        const logs = await publicClient.getLogs({
          address: contractAddress,
          event,
          fromBlock,
        });

        const newEvents = [];
        for (let i = logs.length - 1; i >= 0; i--) {
          newEvents.push({
            log: logs[i],
            args: logs[i].args,
          });
        }
        setEvents(newEvents);
        setError(undefined);
      } catch (e: any) {
        console.error(e);
        setEvents(undefined);
        setError(e);
      } finally {
        setIsLoading(false);
      }
    }

    readEvents();
  }, [
    publicClient,
    fromBlock,
    eventName,
    contractAddress,
    blockData,
    transactionData,
    receiptData,
  ]);

  return {
    data: events,
    isLoading: isLoading,
    error: error,
  };
};
