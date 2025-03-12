import { Button, Modal, ModalContent, useDisclosure } from "@heroui/react";

import { useConnect } from "wagmi";
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import { useState } from "react";

export const Share = ({ url, title }: { url: string; title: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, "_blank", "noopener,noreferrer");
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <Button
        type="submit"
        onPress={onOpen}
        className="w-full bg-pink-600 text-white font-semibold py-4 px-4 rounded-md"
      >
        Share Campaign
      </Button>

      <Modal isOpen={isOpen} size={"sm"} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose: any) => (
            <div className="px-2 py-8 bg-base-200  flex flex-col gap-y-4 text-center ">
              <div>
                <h6 className="font-head text-xl text-black">
                  Reach more donors by sharing
                </h6>
                <Button
                  className="mx-auto w-32 bg-white text-black flex font-medium justify-center items-center text-sm border px-4 font-body rounded-full border-gray-400 max-w-[150px] hover:bg-gray-200 cursor-pointer transition-all duration-500 mt-2"
                  onPress={copyToClipboard}
                >
                  {copied ? "Copied" : "Copy Link"}
                </Button>
              </div>
              <div className="flex flex-col gap-y-1 mt-1 ">
                <div className="p-2 flex flex-col items-center space-y-4">
                  <div className="flex space-x-4">
                    <button onClick={shareToFacebook}>
                      <FacebookIcon size={40} round />
                    </button>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TwitterIcon size={40} round />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedinIcon size={40} round />
                    </a>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsappIcon size={40} round />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
