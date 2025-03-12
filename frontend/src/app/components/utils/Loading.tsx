import { Spinner } from "@heroui/react";

export function Loading({
  color = "default",
  size = "sm",
}: {
  color?:
    | "default"
    | "current"
    | "white"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
  size?: "sm" | "md" | "lg";
}) {
  return <Spinner size={size} color={color} />;
}
