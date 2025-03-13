import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlockieAvatar } from "./BlockieAvatar";
import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";
import lsp3ProfileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json";

import { keccak256 } from "viem";
import { truncateAddress } from "../utils/helpers";

function getAddressColor(address: `0x${string}`): string {
  // Regular expression to validate an Ethereum address
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;

  // Ensure the input is a valid Ethereum address
  if (!addressRegex.test(address)) {
    throw new Error("Invalid Ethereum address");
  }

  // Compute the keccak256 hash of the address
  const hash: string = keccak256(address);

  // Extract the first 6 hex characters from the hash (ignore the '0x' prefix)
  const color: string = `#${hash.slice(2, 8)}`;

  return color;
}

function getFirst4Hex(address: string): string {
  // Ensure the address is valid and has the expected length
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error("Invalid Ethereum address");
  }

  // Remove '0x' prefix and return the first 4 characters
  return address.slice(2, 6);
}

const luksoNetworks = [
  {
    name: "LUKSO Mainnet",
    chainId: 42,
    rpcUrl: "https://42.rpc.thirdweb.com",
    ipfsGateway: "https://api.universalprofile.cloud/ipfs",
    explorer: "https://explorer.execution.mainnet.lukso.network/",
    token: "LYX",
  },
  {
    name: "LUKSO Testnet",
    chainId: 4201,
    rpcUrl: "https://4201.rpc.thirdweb.com",
    ipfsGateway: "https://api.universalprofile.cloud/ipfs",
    explorer: "https://explorer.execution.testnet.lukso.network/",
    token: "LYXt",
  },
];

interface Profile {
  name: string;
  description: string;
  tags: string[];
  links: Link[];
  profileImage: Image[];
  backgroundImage: Image[];
}

interface Link {
  title: string;
  url: string;
}

interface Image {
  width: number;
  height: number;
  hashFunction: string;
  hash: string;
  url: string;
}

type Props = {
  address: `0x${string}`;
  showName?: boolean;
};

export function Profile({ address, showName }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const network = luksoNetworks[0];

        // Instanciate the LSP3-based smart contract
        const erc725js = new ERC725(
          lsp3ProfileSchema as ERC725JSONSchema[],
          address,
          network.rpcUrl,
          {
            ipfsGateway: network.ipfsGateway,
          }
        );

        const profileMetadata = await erc725js.fetchData("LSP3Profile");

        if (
          profileMetadata.value &&
          typeof profileMetadata.value === "object" &&
          "LSP3Profile" in profileMetadata.value
        ) {
          setProfile(profileMetadata.value.LSP3Profile);
        }
      } catch (error) {
        console.error("Cannot fetch Hero data", error);
      }
    })();
  }, [address]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 aspect-square rounded-full"
        style={{ backgroundColor: getAddressColor(address) }}
      >
        <Link
          href={`https://universaleverything.io/${address}`}
          target="_blank"
        >
          {!profile?.profileImage || profile.profileImage.length === 0 ? (
            <BlockieAvatar
              address={address}
              // @ts-ignore
              size={"100%"}
            />
          ) : (
            <div className="relative w-16 aspect-square rounded-full object-cover">
              <Image
                src={profile.profileImage[0].url.replace(
                  "ipfs://",
                  "https://api.universalprofile.cloud/ipfs/"
                )}
                alt="Profile"
                fill
                className="rounded-full"
              />
            </div>
          )}
        </Link>
      </div>

      {showName && (
        <div className="text-xs mt-1 text-center text-black lowercase cursor-pointer">
          {profile ? `@${profile.name}` : truncateAddress(address)}
          {profile && (
            <span className="text-purple-400 whitespace-nowrap">
              #{getFirst4Hex(address)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
