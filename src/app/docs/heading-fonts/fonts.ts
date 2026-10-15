import {
  Albert_Sans,
  Archivo,
  Archivo_Narrow,
  Barlow_Condensed,
  Bricolage_Grotesque,
  DM_Sans,
  Familjen_Grotesk,
  Figtree,
  Fraunces,
  Geologica,
  Hanken_Grotesk,
  Host_Grotesk,
  Hubot_Sans,
  Instrument_Sans,
  Instrument_Serif,
  Inter_Tight,
  Lexend,
  Manrope,
  Mona_Sans,
  Newsreader,
  Onest,
  Oswald,
  Outfit,
  Plus_Jakarta_Sans,
  Poppins,
  Public_Sans,
  Red_Hat_Display,
  Rethink_Sans,
  Schibsted_Grotesk,
  Sofia_Sans_Condensed,
  Sora,
  Space_Grotesk,
  Syne,
  Unbounded,
  Urbanist,
  Work_Sans,
} from "next/font/google";

// Test-only fonts. Each sets --sample-font on its own sample; preload off so they only download on this page.
// next/font only accepts literal options, so every call spells them out.
const outfit = Outfit({ variable: "--sample-font", subsets: ["latin"], preload: false });
const jakarta = Plus_Jakarta_Sans({ variable: "--sample-font", subsets: ["latin"], preload: false });
const manrope = Manrope({ variable: "--sample-font", subsets: ["latin"], preload: false });
const sora = Sora({ variable: "--sample-font", subsets: ["latin"], preload: false });
const urbanist = Urbanist({ variable: "--sample-font", subsets: ["latin"], preload: false });
const lexend = Lexend({ variable: "--sample-font", subsets: ["latin"], preload: false });
const dmSans = DM_Sans({ variable: "--sample-font", subsets: ["latin"], preload: false });
const figtree = Figtree({ variable: "--sample-font", subsets: ["latin"], preload: false });
const poppins = Poppins({ variable: "--sample-font", subsets: ["latin"], preload: false, weight: ["600", "700"] });

const spaceGrotesk = Space_Grotesk({ variable: "--sample-font", subsets: ["latin"], preload: false });
const bricolage = Bricolage_Grotesque({ variable: "--sample-font", subsets: ["latin"], preload: false });
const familjen = Familjen_Grotesk({ variable: "--sample-font", subsets: ["latin"], preload: false });
const schibsted = Schibsted_Grotesk({ variable: "--sample-font", subsets: ["latin"], preload: false });
const hanken = Hanken_Grotesk({ variable: "--sample-font", subsets: ["latin"], preload: false });
const hostGrotesk = Host_Grotesk({ variable: "--sample-font", subsets: ["latin"], preload: false });
const archivo = Archivo({ variable: "--sample-font", subsets: ["latin"], preload: false });
const publicSans = Public_Sans({ variable: "--sample-font", subsets: ["latin"], preload: false });
const onest = Onest({ variable: "--sample-font", subsets: ["latin"], preload: false });
const instrumentSans = Instrument_Sans({ variable: "--sample-font", subsets: ["latin"], preload: false });
const albertSans = Albert_Sans({ variable: "--sample-font", subsets: ["latin"], preload: false });
const rethink = Rethink_Sans({ variable: "--sample-font", subsets: ["latin"], preload: false });
const monaSans = Mona_Sans({ variable: "--sample-font", subsets: ["latin"], preload: false });
const hubotSans = Hubot_Sans({ variable: "--sample-font", subsets: ["latin"], preload: false });

const interTight = Inter_Tight({ variable: "--sample-font", subsets: ["latin"], preload: false });
const archivoNarrow = Archivo_Narrow({ variable: "--sample-font", subsets: ["latin"], preload: false });
const barlowCondensed = Barlow_Condensed({
  variable: "--sample-font",
  subsets: ["latin"],
  preload: false,
  weight: ["600", "700"],
});
const oswald = Oswald({ variable: "--sample-font", subsets: ["latin"], preload: false });
const sofiaCondensed = Sofia_Sans_Condensed({ variable: "--sample-font", subsets: ["latin"], preload: false });

const redHat = Red_Hat_Display({ variable: "--sample-font", subsets: ["latin"], preload: false });
const workSans = Work_Sans({ variable: "--sample-font", subsets: ["latin"], preload: false });
const geologica = Geologica({ variable: "--sample-font", subsets: ["latin"], preload: false });
const syne = Syne({ variable: "--sample-font", subsets: ["latin"], preload: false });
const unbounded = Unbounded({ variable: "--sample-font", subsets: ["latin"], preload: false });

const fraunces = Fraunces({ variable: "--sample-font", subsets: ["latin"], preload: false });
const newsreader = Newsreader({ variable: "--sample-font", subsets: ["latin"], preload: false });
const instrumentSerif = Instrument_Serif({ variable: "--sample-font", subsets: ["latin"], preload: false, weight: "400" });

type Font = { variable: string };
const group = (label: string, fonts: [string, Font][]) => ({
  label,
  fonts: fonts.map(([name, font]) => ({ name, className: font.variable })),
});

export const fontGroups = [
  group("Geometric sans", [
    ["Outfit", outfit],
    ["Plus Jakarta Sans", jakarta],
    ["Manrope", manrope],
    ["Sora", sora],
    ["Urbanist", urbanist],
    ["Lexend", lexend],
    ["DM Sans", dmSans],
    ["Figtree", figtree],
    ["Poppins", poppins],
  ]),
  group("Grotesk / neo-grotesk", [
    ["Space Grotesk", spaceGrotesk],
    ["Bricolage Grotesque", bricolage],
    ["Familjen Grotesk", familjen],
    ["Schibsted Grotesk", schibsted],
    ["Hanken Grotesk", hanken],
    ["Host Grotesk", hostGrotesk],
    ["Archivo", archivo],
    ["Public Sans", publicSans],
    ["Onest", onest],
    ["Instrument Sans", instrumentSans],
    ["Albert Sans", albertSans],
    ["Rethink Sans", rethink],
    ["Mona Sans (GitHub's)", monaSans],
    ["Hubot Sans (GitHub's)", hubotSans],
  ]),
  group("Tight & condensed", [
    ["Inter Tight", interTight],
    ["Archivo Narrow", archivoNarrow],
    ["Barlow Condensed", barlowCondensed],
    ["Oswald", oswald],
    ["Sofia Sans Condensed", sofiaCondensed],
  ]),
  group("Display sans", [
    ["Red Hat Display", redHat],
    ["Work Sans", workSans],
    ["Geologica", geologica],
    ["Syne", syne],
    ["Unbounded", unbounded],
  ]),
  group("Serif, for comparison", [
    ["Fraunces", fraunces],
    ["Newsreader", newsreader],
    ["Instrument Serif (regular weight only)", instrumentSerif],
  ]),
];
