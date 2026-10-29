/** Stable fragment ids for document headings, matching Goatboat's slugifyHeading. */
export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}
