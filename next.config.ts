import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Lets a phone on the home network or the tailnet load the dev server by the laptop's address
  allowedDevOrigins: ["192.168.*.*", "100.*.*.*", "*.ts.net"],
  // Next 16 only serves the qualities listed here; 100 is for the portrait
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cloudflare-image-loader.ts",
    deviceSizes: [640, 1080, 1920],
    imageSizes: [32, 48, 64, 96, 128, 200, 400],
    qualities: [75, 100],
    // Project and page images live in the assets bucket
    remotePatterns: [{ protocol: "https", hostname: "assets.jaygriff.com" }],
  },
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
