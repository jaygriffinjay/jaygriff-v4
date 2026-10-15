/**
 * Primary nav links shown in the row above the page content.
 */
export const navRoutes = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Posts", href: "/posts" },
  { label: "About", href: "/about" },
  { label: "Docs", href: "/docs" },
  { label: "Tests", href: "/tests" },
];

/** Whether a nav link holds the given page: Home only on "/", sections for everything under them. */
export const isActiveRoute = (href: string, pathname: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);
