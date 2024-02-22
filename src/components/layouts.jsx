import { Mulish } from "next/font/google";
import Image from "next/image";
import { Suspense } from "react";

const mullish = Mulish({ subsets: ["latin"] });

export default function Layout({ children }) {
  return (
    <main className={mullish.className}>
      {children}
      <section className="absolute bottom-5 hidden xl:flex justify-center inset-x-0 ">
        <Image
          src="/footer-frame.png"
          alt="footer-frame"
          width={300}
          height={0}
          priority
          className="w-auto h-auto"
        />
      </section>
    </main>
  );
}
