import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    domains: ["static.wikia.nocookie.net"],
  },
};

export default nextConfig;
