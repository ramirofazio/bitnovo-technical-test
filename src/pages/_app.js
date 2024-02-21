import Layout from "@/components/layouts";
import { NextUIProvider } from "@nextui-org/react";
import "@/styles/globals.css";
import "remixicon/fonts/remixicon.css";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <NextUIProvider>
        <Toaster richColors={true} />
        <Component {...pageProps} />
      </NextUIProvider>
    </Layout>
  );
}
