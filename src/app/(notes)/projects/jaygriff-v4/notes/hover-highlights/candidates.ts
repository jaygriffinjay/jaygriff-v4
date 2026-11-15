import styles from "./page.module.css";

/** The candidates for the brighter hovers, from the chosen Muted 50% up to the strongest. */
export const brighter = [
  { name: "Muted 50%", note: "The choice for accordions, and today's table rows.", className: styles.muted50 },
  { name: "Muted 70%", note: "The same surface, firmer.", className: styles.muted70 },
  { name: "Muted", note: "Solid muted, no transparency.", className: styles.muted100 },
  { name: "Secondary 60%", note: "Graphite, a step lighter than muted.", className: styles.secondary60 },
  { name: "Secondary", note: "Solid graphite.", className: styles.secondary100 },
  { name: "Accent 60%", note: "The theme's own hover surface.", className: styles.accent60 },
  { name: "Accent", note: "The choice for accordions: the brightest surface in the theme.", className: styles.accent100 },
  { name: "White 6%", note: "A neutral wash, no hue.", className: styles.white6 },
  { name: "White 8%", note: "A little stronger.", className: styles.white8 },
  { name: "White 10%", note: "Clearly lighter than the page.", className: styles.white10 },
  { name: "Muted + blue 10%", note: "Muted with a trace of the link blue.", className: styles.mutedBlue10 },
  { name: "Muted + blue 20%", note: "More blue, still gray-leaning.", className: styles.mutedBlue20 },
  { name: "Accent + white 5%", note: "Past the theme's brightest surface: accent lifted a little.", className: styles.accentWhite5 },
  { name: "Accent + white 10%", note: "Lifted more.", className: styles.accentWhite10 },
  { name: "Accent + white 15%", note: "Lifted most, still neutral.", className: styles.accentWhite15 },
  { name: "White 15%", note: "A strong neutral wash.", className: styles.white15 },
  { name: "White 20%", note: "The strongest neutral.", className: styles.white20 },
  { name: "Accent + blue 15%", note: "Accent with some link blue in it.", className: styles.accentBlue15 },
  { name: "Accent + blue 25%", note: "More blue; reads as a blue-gray.", className: styles.accentBlue25 },
  { name: "Blue 20%", note: "Link blue washed over the page: clearly blue.", className: styles.blue20 },
];
