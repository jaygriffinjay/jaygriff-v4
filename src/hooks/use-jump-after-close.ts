import { useRef, type MouseEvent } from "react";

/**
 * Jumping to a heading from a modal: the link closes the modal, and the page scrolls once the modal
 * has finished closing and released its scroll lock. Pass `onClosed` as the dialog's onOpenChangeComplete.
 */
export function useJumpAfterClose(titleId: string, close: () => void) {
  const pending = useRef<string | null>(null);

  const goTo = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    pending.current = id;
    close();
  };

  const onClosed = (isOpen: boolean) => {
    const id = pending.current;
    if (isOpen || !id) return;
    pending.current = null;
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${id}`);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (id === titleId) window.scrollTo({ top: 0, behavior });
    else document.getElementById(id)?.scrollIntoView({ behavior });
  };

  return { goTo, onClosed };
}
