import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Lets a phone on the home network load the dev server by the laptop's address
  allowedDevOrigins: ["192.168.*.*"],
  // Next 16 only serves the qualities listed here; 100 is for the portrait
  images: {
    qualities: [75, 100],
    // Project and page images live in the assets bucket
    remotePatterns: [{ protocol: "https", hostname: "assets.jaygriff.com" }],
  },
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
