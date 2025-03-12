import { Spinner } from "@heroui/react";
import Image from "next/image";
import React from "react";
import { Toast, toast, ToastPosition } from "react-hot-toast";

type NotificationProps = {
  status: "success" | "info" | "loading" | "error" | "warning";
  duration?: number;
  position?: ToastPosition;
  message?: string;
  blockExplorerLink?: string;
};

type NotificationOptions = Pick<
  NotificationProps,
  "message" | "blockExplorerLink" | "duration" | "position"
>;

const ENUM_STATUSES_COLOR = {
  success: "#00CC99",
  loading: "#5458F7",
  error: "#EB5757",
  info: "#5458F7",
  warning: "#F2C94C",
};
const ENUM_STATUSES_IMG = {
  success: "/icons/notification/success.svg",
  loading: "/icons/notification/info.svg",
  error: "/icons/notification/error.svg",
  info: "/icons/notification/info.svg",
  warning: "/icons/notification/warning.svg",
};

const DEFAULT_DURATION = 4000;
const DEFAULT_POSITION: ToastPosition = "top-center";

/**
 * Custom Notification
 */
export const Notification = ({
  message,
  status,
  duration = DEFAULT_DURATION,
  position = DEFAULT_POSITION,
  blockExplorerLink,
}: NotificationProps) => {
  return toast.custom(
    (t: Toast) => (
      <div
        className={`flex flex-row items-start justify-between min-w-36 rounded-[5px] border-l-[5px] border-l-[#00CC99] shadow-center shadow-accent bg-tablebg py-1 px-3 transform-gpu font-head relative transition-all duration-500 ease-in-out space-x-2
        ${
          position.substring(0, 3) == "top"
            ? `hover:translate-y-1 ${t.visible ? "top-0" : "-top-96"}`
            : `hover:-translate-y-1 ${t.visible ? "bottom-0" : "-bottom-96"}`
        }`}
        style={{
          borderLeftColor: ENUM_STATUSES_COLOR[status],
        }}
      >
        <div
          className={`overflow-x-hidden text-base break-words whitespace-pre-line `}
        >
          <div className="flex gap-x-3 cursor-default">
            {status === "loading" ? (
              <Spinner color={"white"} size={"sm"} />
            ) : (
              <Image
                className=""
                alt=""
                width={30}
                height={30}
                src={ENUM_STATUSES_IMG[status]}
                unoptimized={true}
              />
            )}

            <div>
              <p className="my-0 text-base capitalize">{status}</p>
              {message && <p className="my-0 text-xs">{message}</p>}
              {blockExplorerLink && blockExplorerLink.length > 0 ? (
                <a
                  href={blockExplorerLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block link text-xs underline"
                >
                  check out transaction
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      duration: status === "loading" ? Infinity : duration,
      position,
    }
  );
};

export const notification = {
  success: (options?: NotificationOptions) => {
    return Notification({ status: "success", ...options });
  },
  info: (options?: NotificationOptions) => {
    return Notification({ status: "info", ...options });
  },
  warning: (options?: NotificationOptions) => {
    return Notification({ status: "warning", ...options });
  },
  error: (options?: NotificationOptions) => {
    return Notification({ status: "error", ...options });
  },
  loading: (options?: NotificationOptions) => {
    return Notification({ status: "loading", ...options });
  },
  remove: (toastId: string) => {
    toast.remove(toastId);
  },
};
