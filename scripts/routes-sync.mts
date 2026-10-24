// Tells goatboat which code pages exist: every src/app/**/page.tsx, as { id, path, file }.
// Goatboat owns everything else about them. Run with --dry-run to print the list without sending it.
import { findAppRoutes } from "./approutes.mts";

const dryRun = process.argv.includes("--dry-run");

const approutes = findAppRoutes();

if (dryRun) {
  for (const route of approutes)
    console.log(`${route.path.padEnd(32)} ${(route.id ?? "(no id)").padEnd(36)}  ${route.file}`);
  console.log(`\n${approutes.length} pages (dry run, nothing sent)`);
  process.exit(0);
}

// Without an id, a moved folder would look like a new page
const unstamped = approutes.filter((r) => !r.id);
if (unstamped.length) {
  console.error(
    `These pages have no goatboat id on their first line. Run npm run routes:stamp and commit:\n  ${unstamped.map((r) => r.file).join("\n  ")}`,
  );
  process.exit(1);
}

const base = process.env.GOATBOAT_URL;
const token = process.env.GOATBOAT_SYNC_TOKEN;
if (!base || !token) {
  console.error("GOATBOAT_URL and GOATBOAT_SYNC_TOKEN must be set");
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
