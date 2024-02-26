/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    //? Configuracion para que ande bien `RainbowKit`.
    //? https://github.com/rainbow-me/rainbowkit/blob/main/examples/with-next/next.config.js
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    remotePatterns: ["payments.pre-bnvo.com"],
  },
};

export default nextConfig;
