import { Mulish } from "next/font/google";
import Image from "next/image";
import Web3WalletConnect from "@/utils/Web3WalletConnect";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";

const mullish = Mulish({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <NextUIProvider>
      <Web3WalletConnect>
        <main className={mullish.className}>
          <Toaster richColors={true} />
          {children}
          <footer className="absolute bottom-5 hidden xl:flex justify-center inset-x-0">
            <Image
              src="/footer-frame.png"
              alt="footer-frame"
              width={300}
              height={50}
              priority
              className="w-auto h-auto"
            />
          </footer>
        </main>
      </Web3WalletConnect>
    </NextUIProvider>
  );
}
