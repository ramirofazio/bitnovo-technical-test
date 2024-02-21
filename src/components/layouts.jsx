import { Mulish } from "next/font/google";

export default function Layout({ children }) {
  return (
    <main className={Mulish({ subsets: ["latin"] }).className}>{children}</main>
  );
}
