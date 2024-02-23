import Layout from "@/components/layouts";
import { NextUIProvider } from "@nextui-org/react";
import "@/styles/globals.css";
import "remixicon/fonts/remixicon.css";
import { Toaster } from "sonner";
import Web3WalletConnect from "@/utils/Web3WalletConnect";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <NextUIProvider>
        <Toaster richColors={true} />
        <Web3WalletConnect>
          <Component {...pageProps} />
        </Web3WalletConnect>
      </NextUIProvider>
    </Layout>
  );
}
