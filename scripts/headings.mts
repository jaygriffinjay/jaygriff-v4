// Finds the headings a page file renders as plain text: <H2>..<H6> whose children are only text.
// Headings built from expressions, loops or other components aren't visible to a static read and are skipped.
import { readFileSync } from "node:fs"
import ts from "typescript"
import { slugifyHeading } from "../src/lib/slugify-heading.ts"

export type TocEntry = { depth: number; text: string; id: string }

const entities: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
}

const decode = (text: string) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (whole, name: string) => {
    if (name[0] !== "#") return entities[name] ?? whole
    const code = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10)
    return String.fromCodePoint(code)
  })

// JSX collapses a text's line breaks and indentation into single spaces
const jsxText = (raw: string) => {
  const lines = raw.split(/\r\n|\n|\r/)
  return lines
    .map((line, i) => {
      if (i > 0) line = line.trimStart()
      if (i < lines.length - 1) line = line.trimEnd()
      return line
    })
    .filter(Boolean)
    .join(" ")
}

export function extractHeadings(file: string): TocEntry[] {
  const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const found: { depth: number; text: string; id: string }[] = []

  const visit = (node: ts.Node) => {
    if (ts.isJsxElement(node)) {
      const heading = headingOf(node)
      if (heading) found.push(heading)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)

  // Repeated ids get -1, -2, ... like goatboat's markdown TOC
  const seen = new Map<string, number>()
  return found.map(({ depth, text, id }) => {
    const count = seen.get(id) ?? 0
    seen.set(id, count + 1)
    return { depth, text, id: count ? `${id}-${count}` : id }
  })
}

function headingOf(node: ts.JsxElement) {
  const tag = node.openingElement.tagName.getText()
  if (!/^H[2-6]$/.test(tag)) return null
  const texts = node.children.filter(ts.isJsxText)
  if (texts.length !== node.children.length) return null

  const text = decode(jsxText(texts.map((c) => c.text).join("")))
  if (!text) return null

  let id = slugifyHeading(text)
  for (const attr of node.openingElement.attributes.properties) {
    if (!ts.isJsxAttribute(attr) || attr.name.getText() !== "id") continue
    // An id from an expression can't be known without running the page
    if (!attr.initializer || !ts.isStringLiteral(attr.initializer)) return null
    id = attr.initializer.text
  }
  return id ? { depth: Number(tag[1]), text, id } : null
}
