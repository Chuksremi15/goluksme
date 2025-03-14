"use client";

import { ReactNode, useState } from "react";
import { State, WagmiProvider } from "wagmi"; // Adjust the import based on your setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/config/wagmiConfig";
import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "react-hot-toast";
import { UPProvider } from "@/contexts/UPProviderContext";

type ProvidersProps = {
  children: ReactNode;
  initialState: State | undefined; // Replace 'any' with the actual type if available
};

const Providers = ({ children, initialState }: ProvidersProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <UPProvider>
          <HeroUIProvider>
            {children}
            <Toaster />
          </HeroUIProvider>
        </UPProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
