import { Geist, Geist_Mono, JetBrains_Mono, Sekuya } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// display face for the site name, carried over from jaygriff v2
export const sekuya = Sekuya({
  variable: "--font-sekuya",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  // Next has no fallback metrics for Sekuya; skip the size-adjusted fallback instead of warning
  adjustFontFallback: false,
});

export const fontVariables = [geistSans, geistMono, jetbrainsMono, sekuya]
  .map((f) => f.variable)
  .join(" ");
