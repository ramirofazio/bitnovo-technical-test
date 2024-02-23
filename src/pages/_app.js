import RootLayout from "@/components/layouts/RootLayout";
import "@/styles/globals.css";
import "remixicon/fonts/remixicon.css";

export default function App({ Component, pageProps }) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}
