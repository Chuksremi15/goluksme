import { Button, Modal, ModalContent, useDisclosure } from "@heroui/react";
import { WalletIcon } from "@web3icons/react";
import Image from "next/image";
import * as React from "react";
import { useConnect } from "wagmi";
import UpImage from "../assets/up.svg";

export function WalletOptions() {
  const { connectors, connectAsync } = useConnect();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button
        onPress={onOpen}
        size="sm"
        className="ml-auto bg-white text-black flex font-medium justify-center items-center text-sm border px-4 font-body rounded-full border-gray-400 max-w-[140px] hover:bg-gray-200 cursor-pointer transition-all duration-500"
      >
        Connect Wallet
      </Button>
      <Modal isOpen={isOpen} size={"xs"} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <div className="px-2 py-8 bg-base-200  flex flex-col gap-y-4 text-center ">
              <div>
                <h6 className="font-head text-xl text-black">Connect Wallet</h6>
              </div>
              <div className="flex flex-col gap-y-1 mt-1 ">
                {connectors
                  .filter(
                    (connector, index, self) =>
                      index === self.findIndex((c) => c.name === connector.name)
                  )
                  .map((connector) => (
                    <button
                      className="flex items-center font-head gap-x-3 border text-black rounded-lg p-4"
                      key={connector.uid}
                      onClick={() => connectAsync({ connector })}
                    >
                      {connector.id == "cloud.universalprofile" ? (
                        <Image
                          src={UpImage.src}
                          alt="Universal Profile"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <WalletIcon
                          name={
                            connector.name == "WalletConnect"
                              ? "wallet-connect"
                              : connector.name
                          }
                          size={32}
                          className="bg-white rounded"
                          variant="branded"
                        />
                      )}
                      {connector.name}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
