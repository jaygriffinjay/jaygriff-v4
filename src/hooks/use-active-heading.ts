import { useEffect, useState } from "react";

// Scroll distance in px that still counts as the top of the page
const AT_TOP = 40;

/**
 * The id of the heading the reader is at: the title at the top of the page, otherwise the topmost
 * heading in the reading band. `ids` are the headings after the title, in page order.
 */
export function useActiveHeading(titleId: string, ids: string[]) {
  // Tied to the title it was set for, so a new page starts at its own title without an effect resetting it
  const [active, setActive] = useState({ titleId, id: titleId });
  const activeId = active.titleId === titleId ? active.id : titleId;
  const key = ids.join("\n");

  useEffect(() => {
    if (!titleId) return;
    const set = (id: string) => setActive({ titleId, id });
    const headings = [titleId, ...key.split("\n")]
      .map((id) => document.getElementById(id))
      .filter((heading): heading is HTMLElement => heading !== null);
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (observations) => {
        // At the top of the page the title is current, even if the first heading is already in view
        if (window.scrollY < AT_TOP) return set(titleId);
        const visible = observations
          .filter((observation) => observation.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) set(visible.target.id);
      },
      { rootMargin: "-12% 0px -72% 0px", threshold: 0 },
    );
    headings.forEach((heading) => observer.observe(heading));

    // Scrolling back up leaves the first heading's band without any heading entering it
    const onScroll = () => {
      if (window.scrollY < AT_TOP) set(titleId);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [titleId, key]);

  return [activeId, (id: string) => setActive({ titleId, id })] as const;
}
