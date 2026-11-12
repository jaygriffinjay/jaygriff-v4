import styles from "./page.module.css";

export type ToolStatus = "active" | "occasional" | "benched" | "shelved" | "dabbled" | "wishlist";

// Active gets no marker; everything below it gets a colour from the same ramp the legend shows
export const TOOL_STATUS_META: Record<ToolStatus, { label: string; hint: string; markClass: string }> = {
  active: { label: "Active", hint: "In regular use", markClass: "" },
  occasional: { label: "Occasional", hint: "Reach for it now and then", markClass: styles.markOccasional },
  benched: { label: "Benched", hint: "Still know it, but rarely need it", markClass: styles.markBenched },
  shelved: { label: "Shelved", hint: "Have experience, but no longer use it", markClass: styles.markShelved },
  dabbled: { label: "Dabbled", hint: "Played and experimented with it", markClass: styles.markDabbled },
  wishlist: { label: "Want to Learn", hint: "Not much experience with it, excited by it", markClass: styles.markWishlist },
};

// Active first, then fading out; the list is sorted by this within each section
export const STATUS_ORDER: Record<ToolStatus, number> = {
  active: 0,
  occasional: 1,
  benched: 2,
  shelved: 3,
  dabbled: 4,
  wishlist: 5,
};
