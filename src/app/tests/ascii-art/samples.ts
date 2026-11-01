import type { CodeFile } from "@/components/code-block/types";

// String.raw keeps the backslashes in the drawings literal

export const fileTree: CodeFile = {
  content: String.raw`jaygriff-v4/
├── public/
│   ├── images/
│   │   └── me2.jpg
│   └── tool-logos/
│       ├── neon.svg
│       └── … 79 more
├── scripts/
│   └── routes-sync.mts
├── src/
│   ├── app/
│   │   ├── [...path]/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── code-block/
│   │   └── typography.tsx
│   └── lib/
│       └── goatboat.ts
└── package.json`,
};

export const asciiTree: CodeFile = {
  content: String.raw`goatboat
+-- src
|   +-- db
|   |   +-- ops.ts
|   |   \-- schema.ts
|   \-- mcp
|       \-- server.mts
\-- tests
    \-- setup.ts`,
};

export const boxDiagram: CodeFile = {
  path: "docs/architecture.txt",
  content: String.raw`┌──────────────┐   reads    ┌──────────────┐   SQL    ┌──────────────┐
│ jaygriff-v4  │ ─────────▶ │   goatboat   │ ───────▶ │    Turso     │
│  (Next.js)   │  /api/...  │  (API + MCP) │          │   (SQLite)   │
└──────────────┘            └──────┬───────┘          └──────────────┘
                                   │ proposals
                                   ▼
                            ┌──────────────┐
                            │    Owner     │
                            │   approves   │
                            └──────────────┘`,
};

export const stateDiagram: CodeFile = {
  content: String.raw`            +-----------+
            |  pending  |
            +-----------+
             /         \
   approve  /           \  reject
           v             v
  +-----------+       +-----------+
  | approved  |       | rejected  |
  +-----------+       +-----------+
        |
        | apply
        v
  +-----------+
  |  applied  |
  +-----------+`,
};

export const sequenceDiagram: CodeFile = {
  content: String.raw`Agent          MCP server        goatboat API          Owner
  │                 │                  │                 │
  │  create_page()  │                  │                 │
  │────────────────▶│                  │                 │
  │                 │ POST /proposals  │                 │
  │                 │─────────────────▶│                 │
  │                 │    201 pending   │                 │
  │                 │◀─────────────────│                 │
  │   proposal id   │                  │   review link   │
  │◀────────────────│                  │────────────────▶│`,
};

export const boxTable: CodeFile = {
  content: String.raw`╔════════════╤═════════╤══════════╗
║ Status     │ Color   │ Meaning  ║
╟────────────┼─────────┼──────────╢
║ active     │ emerald │ daily    ║
║ occasional │ amber   │ now+then ║
║ benched    │ pink    │ paused   ║
╚════════════╧═════════╧══════════╝`,
};

export const gitGraph: CodeFile = {
  content: String.raw`* 31c60bf Give typography its own variants
* 2d92130 Tighten the phone header
*   9f1e2aa Merge branch 'toc'
|\
| * 4b7d0c1 Collapse the TOC on phones
| * 8e2f9a3 Add the TOC disclosure
* | 7c3d1e5 Shared caps label
|/
* 588a38d Centre the About portrait`,
};

export const banners: CodeFile = {
  content: String.raw` ██████   ██████   █████  ████████
██       ██    ██ ██   ██    ██
██   ███ ██    ██ ███████    ██
██    ██ ██    ██ ██   ██    ██
 ██████   ██████  ██   ██    ██

 _________________
< ship it, friday >
 -----------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||`,
};

export const blockCharts: CodeFile = {
  content: String.raw`requests/min   ▁▂▃▅▇█▇▅▃▂▁▁▂▃▅
build cache    [████████████░░░░░░░░]  60%
logos (2.2MB)  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒░░`,
};

export const commentDiagram: CodeFile = {
  path: "src/lib/request-flow.ts",
  content: String.raw`/**
 * Request flow:
 *
 *   browser
 *     └─▶ proxy.ts (sets x-pathname)
 *           └─▶ app/[...path]/page.tsx
 *                 ├─▶ getPage(path)   ── goatboat API
 *                 └─▶ MarkdownRenderer
 */
export const flow = "documented above";`,
};

export const wideDiagram: CodeFile = {
  content: String.raw`[edit] ──▶ [save] ──▶ [routes:sync] ──▶ [goatboat /api/sync] ──▶ [proposal] ──▶ [owner approves] ──▶ [Turso] ──▶ [site revalidates] ──▶ [visitor sees it]
   │                                                                                                                                              ▲
   └──────────────────────────────────────────── the whole loop, ideally under a minute ──────────────────────────────────────────────────────────┘`,
};

// lines up only if the font draws CJK and emoji at exactly two columns
export const wideCharTable: CodeFile = {
  content: String.raw`┌──────────┬──────────┐
│ English  │ 日本語   │
├──────────┼──────────┤
│ hello    │ こんにち │
│ emoji 🚀 │ 絵文字   │
└──────────┴──────────┘`,
};
