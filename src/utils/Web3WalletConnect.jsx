import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { goerli } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export default function Web3WalletConnect({ children }) {
  const queryClient = new QueryClient();

  const config = getDefaultConfig({
    appName: "bitnovo-technical-interview",
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
    chains: [goerli /* //?Agregar las demas testnest */],
    ssr: true,
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider coolMode={true}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
