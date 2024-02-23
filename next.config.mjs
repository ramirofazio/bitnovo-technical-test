/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    //? Config para que ande bien RainbowKit
    //? https://github.com/rainbow-me/rainbowkit/blob/main/examples/with-next/next.config.js
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;
