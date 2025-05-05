import { useEffect, useState } from "react";

export function useChainMonitor() {
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    const getInitialChainId = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const hexId = await window.ethereum.request({
            method: "eth_chainId",
          });
          setChainId(parseInt(hexId, 16));
        } catch (err) {
          console.error("Failed to fetch initial chain ID:", err);
        }
      }
    };

    const handleChainChanged = (hexId: string) => {
      const id = parseInt(hexId, 16);

      setChainId(id);
    };

    if (window.ethereum) {
      getInitialChainId();
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  return chainId;
}
