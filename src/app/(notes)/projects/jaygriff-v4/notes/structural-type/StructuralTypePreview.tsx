"use client";

import { useEffect, useId, useState } from "react";
import NextLink from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { SiteNav } from "@/components/site/nav";
import { H2, Paragraph, Small } from "@/components/typography";
import { cn } from "@/lib/utils";
import styles from "./StructuralTypePreview.module.css";

type Font = {
  id: string;
  family: string;
  type: string;
  category: string;
  subsets: string[];
  weights: number[];
  styles: string[];
};

const CATALOG_URL = "https://api.fontsource.org/v1/fonts";
const SPECIMEN =
  "Welcome to my website where I do my work and publish it too! On here I document my development work, share my thoughts, and maybe even post some personal stuff. More Jay Griffin Home Projects Posts Notes About Read Stuff My Work Elsewhere GitHub LinkedIn Resume Other Stuff Contact License Source";

function quoteCssString(value: string) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/[\r\n]/g, " ")}"`;
}

function stylesheetUrl(font: Font) {
  const regular = font.weights.includes(400) ? 400 : font.weights[0];
  const weights = [...new Set([regular, ...(font.weights.includes(700) ? [700] : [])])];
  const query = new URLSearchParams({
    family: `${font.family}:wght@${weights.join(";")}`,
    text: SPECIMEN,
    display: "swap",
  });
  return `https://fonts.googleapis.com/css2?${query}`;
}

export function StructuralTypePreview({ className }: { className?: string }) {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [interWeight, setInterWeight] = useState(400);
  const [interOpticalSize, setInterOpticalSize] = useState(16);
  const listId = `font-families-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const previewId = `font-preview-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const interPreviewId = `inter-preview-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const selected = fonts[selectedIndex];

  useEffect(() => {
    let active = true;

    fetch(CATALOG_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Font catalog request failed");
        return response.json() as Promise<Font[]>;
      })
      .then((catalog) => {
        if (!active) return;
        const available = catalog
          .filter(
            (font) =>
              font.type === "google" &&
              font.subsets?.includes("latin") &&
              font.styles?.includes("normal") &&
              font.weights?.length > 0,
          )
          .sort((a, b) => a.family.localeCompare(b.family));
        const initialIndex = Math.max(0, available.findIndex((font) => font.family === "Geist"));
        setFonts(available);
        setSelectedIndex(initialIndex);
        setQuery(available[initialIndex]?.family ?? "");
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selected) return;

    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = stylesheetUrl(selected);
    stylesheet.dataset.fontPreview = previewId;

    const fontRule = document.createElement("style");
    fontRule.dataset.fontPreview = previewId;
    fontRule.textContent = `#${previewId}, #${previewId} header a { font-family: ${quoteCssString(selected.family)}, var(--font-geist-sans), sans-serif; }`;

    document.head.append(stylesheet, fontRule);
    return () => {
      stylesheet.remove();
      fontRule.remove();
    };
  }, [previewId, selected]);

  useEffect(() => {
    const fontRule = document.createElement("style");
    fontRule.dataset.interPreview = interPreviewId;
    fontRule.textContent = `#${interPreviewId}, #${interPreviewId} header a { font-variation-settings: "wght" ${interWeight}, "opsz" ${interOpticalSize}; } #${interPreviewId} header a { font-family: inherit; }`;
    document.head.append(fontRule);
    return () => fontRule.remove();
  }, [interOpticalSize, interPreviewId, interWeight]);

  const selectIndex = (index: number) => {
    if (!fonts.length) return;
    const nextIndex = (index + fonts.length) % fonts.length;
    setSelectedIndex(nextIndex);
    setQuery(fonts[nextIndex].family);
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    const matchIndex = fonts.findIndex(
      (font) => font.family.toLocaleLowerCase() === value.trim().toLocaleLowerCase(),
    );
    if (matchIndex >= 0) setSelectedIndex(matchIndex);
  };

  const commitQuery = () => {
    const matchIndex = fonts.findIndex(
      (font) => font.family.toLocaleLowerCase() === query.trim().toLocaleLowerCase(),
    );
    setQuery(matchIndex >= 0 ? fonts[matchIndex].family : selected?.family ?? "");
    if (matchIndex >= 0) setSelectedIndex(matchIndex);
  };

  return (
    <section className={cn(styles.preview, className)} aria-label="Structural type specimen">
      <div className={styles.toolbar}>
        <label className={styles.pickerLabel}>
          <span className={styles.labelText}>Google font</span>
          <input
            className={styles.picker}
            type="search"
            list={listId}
            value={query}
            onChange={(event) => updateQuery(event.currentTarget.value)}
            onBlur={commitQuery}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitQuery();
            }}
            placeholder={loading ? "Loading font catalog" : "Search fonts"}
            aria-label="Search Google Fonts"
            autoComplete="off"
            disabled={loading || failed}
          />
          <datalist id={listId}>
            {fonts.map((font) => <option key={font.id} value={font.family} />)}
          </datalist>
        </label>
        <div className={styles.navigation}>
          <Small className={styles.count} aria-live="polite">
            {loading ? "Loading" : failed ? "Unavailable" : `${selectedIndex + 1} / ${fonts.length}`}
          </Small>
          <button
            type="button"
            className={styles.step}
            aria-label="Previous Google font"
            title="Previous font"
            disabled={!fonts.length}
            onClick={() => selectIndex(selectedIndex - 1)}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.step}
            aria-label="Next Google font"
            title="Next font"
            disabled={!fonts.length}
            onClick={() => selectIndex(selectedIndex + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
      {failed && <p className={styles.error} role="status">The font catalog couldn't load. Reload to try again.</p>}
      <div id={previewId} className={styles.specimen} aria-busy={loading}>
        <Small className={styles.familyName}>
          {selected ? `${selected.family} · ${selected.category}` : loading ? "Loading font catalog…" : "No matching fonts"}
        </Small>
        <div className={styles.headerPreview}>
          <SiteHeader className={styles.sampleHeader} />
          <SiteNav />
        </div>
        <Paragraph className={styles.tagline}>
          Welcome to my website where I do my work and publish it too! On here I document my
          development work, share my thoughts, and maybe even post some personal stuff.{" "}
          <NextLink href="/about" className={styles.link}>
            More
          </NextLink>
        </Paragraph>
        <SiteFooter className={styles.footerPreview} />
      </div>
      <section
        className={styles.interSection}
        aria-labelledby={`${interPreviewId}-heading`}
      >
        <H2 id={`${interPreviewId}-heading`} className={styles.interTitle}>
          Inter Variable
        </H2>
        <div className={styles.variableControls}>
          <div className={styles.axisControl}>
            <div className={styles.axisHeading}>
              <Small id={`${interPreviewId}-weight-label`} className={styles.axisName}>
                Weight
              </Small>
              <output className={styles.axisValue} htmlFor={`${interPreviewId}-weight`}>
                {interWeight}
              </output>
            </div>
            <input
              id={`${interPreviewId}-weight`}
              className={styles.axisSlider}
              type="range"
              aria-labelledby={`${interPreviewId}-weight-label`}
              min={100}
              max={900}
              step={1}
              value={interWeight}
              onChange={(event) => setInterWeight(Number(event.currentTarget.value))}
            />
            <div className={styles.axisRange}>
              <Small>100</Small>
              <Small>900</Small>
            </div>
          </div>
          <div className={styles.axisControl}>
            <div className={styles.axisHeading}>
              <Small id={`${interPreviewId}-opsz-label`} className={styles.axisName}>
                Optical size
              </Small>
              <output className={styles.axisValue} htmlFor={`${interPreviewId}-opsz`}>
                {interOpticalSize}
              </output>
            </div>
            <input
              id={`${interPreviewId}-opsz`}
              className={styles.axisSlider}
              type="range"
              aria-labelledby={`${interPreviewId}-opsz-label`}
              min={14}
              max={32}
              step={1}
              value={interOpticalSize}
              onChange={(event) => setInterOpticalSize(Number(event.currentTarget.value))}
            />
            <div className={styles.axisRange}>
              <Small>14</Small>
              <Small>32</Small>
            </div>
          </div>
        </div>
        <div id={interPreviewId} className={styles.interSpecimen}>
          <div className={styles.headerPreview}>
            <SiteHeader className={styles.sampleHeader} />
            <SiteNav />
          </div>
          <Paragraph className={styles.tagline}>
            Welcome to my website where I do my work and publish it too! On here I document my
            development work, share my thoughts, and maybe even post some personal stuff.{" "}
            <NextLink href="/about" className={styles.link}>
              More
            </NextLink>
          </Paragraph>
          <SiteFooter className={styles.footerPreview} />
        </div>
      </section>
    </section>
  );
}