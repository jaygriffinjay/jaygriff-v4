import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Lets a phone on the home network load the dev server by the laptop's address
  allowedDevOrigins: ["192.168.*.*"],
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
