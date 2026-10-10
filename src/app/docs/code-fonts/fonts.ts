import {
  Fira_Code,
  IBM_Plex_Mono,
  Inconsolata,
  Roboto_Mono,
  Source_Code_Pro,
  Ubuntu_Mono,
} from "next/font/google";

// test-only fonts; preload off so they only download when this page renders them
const firaCode = Fira_Code({ variable: "--font-test-fira", subsets: ["latin"], preload: false });
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-test-plex",
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
});
const sourceCodePro = Source_Code_Pro({
  variable: "--font-test-source",
  subsets: ["latin"],
  preload: false,
});
const robotoMono = Roboto_Mono({ variable: "--font-test-roboto", subsets: ["latin"], preload: false });
const inconsolata = Inconsolata({
  variable: "--font-test-inconsolata",
  subsets: ["latin"],
  preload: false,
});
const ubuntuMono = Ubuntu_Mono({
  variable: "--font-test-ubuntu",
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
});

export const testFontVariables = [
  firaCode,
  ibmPlexMono,
  sourceCodePro,
  robotoMono,
  inconsolata,
  ubuntuMono,
]
  .map((font) => font.variable)
  .join(" ");
