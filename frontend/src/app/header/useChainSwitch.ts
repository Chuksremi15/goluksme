type AddableNetwork = {
  chainId: string; // hex string, e.g. '0x1' for Ethereum Mainnet
  chainName: string;
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export async function switchOrAddChain(targetChain: AddableNetwork) {
  if (!window.ethereum) {
    throw new Error("MetaMask is not available");
  }

  try {
    // Try switching first
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetChain.chainId }],
    });
  } catch (switchError: any) {
    // 4902 = Unrecognized chain -> try to add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [targetChain],
        });
      } catch (addError) {
        console.error("Failed to add chain:", addError);
        throw addError;
      }
    } else {
      console.error("Failed to switch chain:", switchError);
      throw switchError;
    }
  }
}
