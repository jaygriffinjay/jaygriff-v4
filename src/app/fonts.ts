import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const jetbrainsMono = localFont({
  variable: "--font-jetbrains-mono",
  // self-hosted from JetBrains' release: Google's subsets drop the box-drawing, block and arrow glyphs
  src: [
    { path: "./fonts/JetBrainsMono-Variable.woff2", weight: "100 800", style: "normal" },
    { path: "./fonts/JetBrainsMono-Italic-Variable.woff2", weight: "100 800", style: "italic" },
  ],
});

// display face for the site name, carried over from jaygriff v2; self-hosted because
// next/font/google has no fallback metrics for it and warns on every build
export const sekuya = localFont({
  variable: "--font-sekuya",
  src: "./fonts/Sekuya-Regular.ttf",
  weight: "400",
  display: "swap",
});

export const fontVariables = [geistSans, geistMono, jetbrainsMono, sekuya]
  .map((f) => f.variable)
  .join(" ");
