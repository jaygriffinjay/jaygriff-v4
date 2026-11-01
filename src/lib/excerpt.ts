const FENCE = /^\s*(```|~~~)/;
const HEADING = /^#{1,6}\s/;

/** Splits markdown into top-level blocks at blank lines, keeping fenced code blocks whole. */
function blocks(markdown: string) {
  const out: string[] = [];
  let current: string[] = [];
  let fence: string | null = null;
  for (const line of markdown.split("\n")) {
    const marker = line.match(FENCE)?.[1];
    if (marker) fence = fence === null ? marker : fence === marker ? null : fence;
    if (fence === null && !marker && line.trim() === "") {
      if (current.length) out.push(current.join("\n"));
      current = [];
      continue;
    }
    current.push(line);
  }
  if (current.length) out.push(current.join("\n"));
  return out;
}

export const wordsIn = (text: string) => text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0;

export type Excerpt = { markdown: string; words: number; moreWords: number };

/** The opening blocks of a body, about `target` words, stopping at the first heading after the start. */
export function excerpt(body: string, target = 80): Excerpt {
  const all = blocks(body);
  // a leading heading repeats the page title
  while (all.length && HEADING.test(all[0])) all.shift();

  const picked: string[] = [];
  let words = 0;
  for (const block of all) {
    if (picked.length && (words >= target || HEADING.test(block))) break;
    picked.push(block);
    words += wordsIn(block);
  }
  const total = all.reduce((sum, block) => sum + wordsIn(block), 0);
  return { markdown: picked.join("\n\n"), words, moreWords: total - words };
}

/** Plain running text from markdown, without code blocks, cut to `target` words. */
export function plainExcerpt(body: string, target = 60) {
  const prose = blocks(body)
    .filter((block) => !HEADING.test(block) && !FENCE.test(block))
    .join(" ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_>#|]/g, "")
    .replace(/^\s*[-+]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  const words = prose.split(" ");
  const total = wordsIn(body);
  const shown = words.slice(0, target).join(" ");
  return { text: shown, moreWords: Math.max(0, total - wordsIn(shown)) };
}
