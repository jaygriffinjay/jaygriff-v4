// The site's code pages: every src/app/**/page.tsx, with the goatboat id from its first line.
// Discovery follows Next's folder rules; the id marker works in any text file.
import { readdirSync, readFileSync, writeFileSync } from "node:fs"

export type AppRoute = { path: string; file: string; id: string | null }

const pageFile = /(^|\/)page\.(tsx|ts|jsx|js)$/
const idMarker =
  /goatboat:\s*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i

const firstLine = (file: string) =>
  readFileSync(file, "utf8").split("\n", 1)[0]

export function findAppRoutes(): AppRoute[] {
  return readdirSync("src/app", { recursive: true, encoding: "utf8" })
    .filter((file) => pageFile.test(file))
    .flatMap((file) => {
      const segments = file.split("/").slice(0, -1)
      // Dynamic segments aren't pages, and _folders are private
      if (segments.some((s) => s.startsWith("[") || s.startsWith("_")))
        return []
      // Route groups like (site) add nothing to the URL
      const path = "/" + segments.filter((s) => !/^\(.*\)$/.test(s)).join("/")
      // The home page has no slug, so it can't be a row yet
      if (path === "/") return []
      const full = `src/app/${file}`
      const id = firstLine(full).match(idMarker)?.[1].toLowerCase() ?? null
      return [{ path, file: full, id }]
    })
    .sort((a, b) => a.path.localeCompare(b.path))
}

/** Puts `// goatboat: <id>` on the file's first line, replacing an existing marker. */
export function writeId(file: string, id: string) {
  const text = readFileSync(file, "utf8")
  const marker = `// goatboat: ${id}`
  const rest = idMarker.test(firstLine(file))
    ? text.slice(text.indexOf("\n") + 1)
    : text
  writeFileSync(file, `${marker}\n${rest}`)
}
