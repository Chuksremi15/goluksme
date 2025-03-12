"use client";

import { ReactNode, useCallback, useState } from "react";
import { State, WagmiProvider } from "wagmi"; // Adjust the import based on your setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMockConfig, wagmiConfig } from "@/config/wagmiConfig";
import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "react-hot-toast";

type ProvidersProps = {
  children: ReactNode;
  initialState: State | undefined; // Replace 'any' with the actual type if available
};

const Providers = ({ children, initialState }: ProvidersProps) => {
  const [queryClient] = useState(() => new QueryClient());
  const [wagmiConfig_, setWagmiConfig] = useState(wagmiConfig);

  const _setupAccount = useCallback(
    (...args: Parameters<Window["_setupAccount"]>) => {
      const config = createMockConfig(...args);
      // @ts-ignore
      setWagmiConfig(config);
    },
    []
  );
  //@ts-ignore
  if (typeof window !== "undefined") window._setupAccount = _setupAccount;

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider>
          {children}
          <Toaster />
        </HeroUIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
