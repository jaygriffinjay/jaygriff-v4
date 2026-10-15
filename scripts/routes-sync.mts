// Tells goatboat which code pages exist: every src/app/**/page.tsx, as { path, file }.
// Goatboat owns everything else about them. Run with --dry-run to print the list without sending it.
import { readdirSync } from "node:fs";

const dryRun = process.argv.includes("--dry-run");

const pageFile = /(^|\/)page\.(tsx|ts|jsx|js)$/;

const approutes = readdirSync("src/app", { recursive: true, encoding: "utf8" })
  .filter((file) => pageFile.test(file))
  .flatMap((file) => {
    const segments = file.split("/").slice(0, -1);
    // Dynamic segments aren't pages, and _folders are private
    if (segments.some((s) => s.startsWith("[") || s.startsWith("_"))) return [];
    // Route groups like (site) add nothing to the URL
    const path = "/" + segments.filter((s) => !/^\(.*\)$/.test(s)).join("/");
    // The home page has no slug, so it can't be a row yet
    if (path === "/") return [];
    return [{ path, file: `src/app/${file}` }];
  })
  .sort((a, b) => a.path.localeCompare(b.path));

if (dryRun) {
  for (const route of approutes) console.log(`${route.path.padEnd(32)} ${route.file}`);
  console.log(`\n${approutes.length} pages (dry run, nothing sent)`);
  process.exit(0);
}

const base = process.env.GOATBOAT_URL;
const token = process.env.GOATBOAT_WRITE_TOKEN;
if (!base || !token) {
  console.error("GOATBOAT_URL and GOATBOAT_WRITE_TOKEN must be set");
  process.exit(1);
}

const res = await fetch(new URL("/api/sync", base), {
  method: "POST",
  headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
  body: JSON.stringify({ approutes }),
});
const json = await res.json().catch(() => null);
if (!json) {
  console.error(`Sync failed: ${base} answered ${res.status} for /api/sync without JSON. Is goatboat running, with /api/sync deployed?`);
  process.exit(1);
}
if (!res.ok) {
  console.error(`Sync failed (${res.status}):`, JSON.stringify(json.error, null, 2));
  process.exit(1);
}

console.log(`Synced ${approutes.length} pages to ${base}`);
for (const [group, paths] of Object.entries(json.data as Record<string, string[]>)) {
  if (paths.length) console.log(`\n${group}:\n  ${paths.join("\n  ")}`);
}
