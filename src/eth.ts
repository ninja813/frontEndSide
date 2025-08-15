import { ethers } from "ethers";

export const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7"; // 11155111

export function getContractAddress() {
  const addr = import.meta.env.VITE_CONTRACT_ADDRESS;
  if (!addr) throw new Error("VITE_CONTRACT_ADDRESS missing in .env");
  return addr;
}

export async function getProvider() {
  if (!window.ethereum) throw new Error("No injected provider (MetaMask not found)");
  return new ethers.BrowserProvider(window.ethereum);
}

export async function ensureSepolia(provider: ethers.BrowserProvider) {
  const network = await provider.getNetwork();
  if (network.chainId !== 11155111n) {
    // try switch, then add
    try {
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }]
      });
    } catch (e: any) {
      if (e?.code === 4902) {
        await window.ethereum?.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: SEPOLIA_CHAIN_ID_HEX,
            rpcUrls: ["https://rpc.sepolia.org"],
            chainName: "Sepolia",
            nativeCurrency: { name: "SepoliaETH", symbol: "SEP", decimals: 18 },
            blockExplorerUrls: ["https://sepolia.etherscan.io"]
          }]
        });
      } else {
        throw e;
      }
    }
  }
}

export async function getSigner() {
  const provider = await getProvider();
  await ensureSepolia(provider);
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}
