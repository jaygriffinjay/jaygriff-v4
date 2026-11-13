// goatboat: 327503d7-04e3-43b8-96c0-6c62d2162792
import Image from "next/image";
import NextLink from "next/link";
import { FileTextIcon, GithubIcon, LinkedinIcon, MailIcon } from "lucide-react";
import { renderSVG } from "uqr";
import { Title } from "@/components/typography";
import { Logo } from "@/components/site/logo";
import { DialogTitle } from "@/components/ui/dialog";
import { requireVisible } from "@/lib/page-meta";
import { QrButton } from "./qr-button";
import styles from "./page.module.css";

const SITE = "https://jaygriff.com";

/** `kind` heads the QR card and `detail` is the address shown under it; `qr` is what the code holds, so it's absolute even where the row's own link isn't. */
const links: { href: string; label: string; kind: string; detail: string; icon: React.ReactNode; qr: string }[] = [
  { href: "/", label: "jaygriff.com", kind: "Website", detail: "jaygriff.com", icon: <Logo data-logo />, qr: SITE },
  { href: "mailto:jay@jaygriff.com", label: "Email", kind: "Email", detail: "jay@jaygriff.com", icon: <MailIcon />, qr: "mailto:jay@jaygriff.com" },
  { href: "/resume", label: "Resume", kind: "Resume", detail: "jaygriff.com/resume", icon: <FileTextIcon />, qr: `${SITE}/resume` },
  { href: "https://github.com/jaygriffinjay", label: "GitHub", kind: "GitHub", detail: "github.com/jaygriffinjay", icon: <GithubIcon />, qr: "https://github.com/jaygriffinjay" },
  { href: "https://linkedin.com/in/jaygriffinjay", label: "LinkedIn", kind: "LinkedIn", detail: "linkedin.com/in/jaygriffinjay", icon: <LinkedinIcon />, qr: "https://linkedin.com/in/jaygriffinjay" },
];

// Black on white whatever the theme, with a quiet zone, so every camera reads it
const qrImage = (text: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(renderSVG(text, { ecc: "M", border: 2, blackColor: "#000", whiteColor: "#fff" }))}`;

/** Where to reach me: email, resume and profiles, each a big tappable row. */
export default async function ContactPage() {
  await requireVisible();
  return (
    <main className={styles.page}>
      <div className={styles.top}>
        <Image src="/images/me2.jpg" alt="Jay Griffin" width={200} height={200} quality={100} priority className={styles.portrait} />
        <Title>
          <span className={styles.name}>Jay Griffin</span>
        </Title>
      </div>

      <nav className={styles.links} aria-label="Contact links">
        {links.map(({ href, label, kind, detail, icon, qr }) => {
          const external = href.startsWith("http");
          const content = (
            <>
              <span className={styles.iconSlot} aria-hidden="true">
                {icon}
              </span>
              <span className={styles.label}>{label}</span>
              <span className={styles.arrow} aria-hidden="true">
                ↗
              </span>
            </>
          );
          return (
            <div key={href} className={styles.item}>
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={styles.row}>
                  {content}
                </a>
              ) : (
                <NextLink href={href} className={styles.row}>
                  {content}
                </NextLink>
              )}
              <QrButton label={label}>
                <Image src="/images/me2.jpg" alt="Jay Griffin" width={200} height={200} quality={100} className={styles.cardPortrait} />
                <p className={styles.cardName}>Jay Griffin</p>
                <div className={styles.cardHeading}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    {icon}
                  </span>
                  <DialogTitle className={styles.cardKind}>{kind}</DialogTitle>
                </div>
                <p className={styles.cardDetail}>{detail}</p>
                {/* a generated SVG data URI, so the optimiser has nothing to do */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrImage(qr)} alt={`QR code for ${label}`} className={styles.cardCode} />
              </QrButton>
            </div>
          );
        })}
      </nav>
    </main>
  );
}
