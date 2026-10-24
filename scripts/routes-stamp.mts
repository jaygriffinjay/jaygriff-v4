// Gives every page file a goatboat id on its first line, so goatboat can follow the page when its folder moves.
// Also re-stamps copied pages: of two files with one id, the one committed with it keeps it.
// Run with --stage (the pre-commit hook does) to add stamped files to the commit.
import { execFileSync } from "node:child_process"
import { randomUUID } from "node:crypto"
import { findAppRoutes, writeId } from "./approutes.mts"

const stage = process.argv.includes("--stage")

function committedWith(file: string, id: string) {
  try {
    const head = execFileSync("git", ["show", `HEAD:${file}`], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
    return head.includes(id)
  } catch {
    return false
  }
}

const routes = findAppRoutes()
const toStamp = routes.filter((r) => !r.id)

const byId = Map.groupBy(
  routes.filter((r) => r.id),
  (r) => r.id!,
)
for (const [id, group] of byId) {
  if (group.length < 2) continue
  const keepers = group.filter((r) => committedWith(r.file, id))
  if (keepers.length !== 1) {
    console.error(
      `${id} is on ${group.map((r) => r.file).join(", ")}. Delete the first line of every copy but the original, then run this again.`,
    )
    process.exit(1)
  }
  toStamp.push(...group.filter((r) => r !== keepers[0]))
}

for (const route of toStamp) {
  writeId(route.file, randomUUID())
  console.log(`Stamped ${route.file}`)
}
if (stage && toStamp.length)
  execFileSync("git", ["add", ...toStamp.map((r) => r.file)])
