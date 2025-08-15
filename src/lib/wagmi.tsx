import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig, http, cookieStorage, createStorage } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia, polygonAmoy } from "viem/chains";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "demo"; // for WalletConnect
const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;

const config = getDefaultConfig({
  appName: "Token Lock DApp",
  projectId,
  chains: [sepolia, polygonAmoy],
  ssr: false,
  transports: {
    [sepolia.id]: http(alchemyKey ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}` : undefined),
    [polygonAmoy.id]: http(alchemyKey ? `https://polygon-amoy.g.alchemy.com/v2/${alchemyKey}` : undefined),
  },
  storage: createStorage({ storage: cookieStorage }),
});

const queryClient = new QueryClient();

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ borderRadius: "large" })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}