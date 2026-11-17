import type { CodeFile } from "@/components/code-block/types";

const padStart = (text: string, to: number) => " ".repeat(Math.max(0, to - text.length)) + text;
const padEnd = (text: string, to: number) => text + " ".repeat(Math.max(0, to - text.length));

const names: Record<string, string> = { "\n": "LF", "\r": "CR" };

/** A string as two aligned rows: each character, and the byte it is stored as. */
function strip(text: string) {
  const chars = [...text];
  const shown = chars.map((c) => padStart(names[c] ?? c, 2)).join(" ");
  const bytes = chars.map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");
  return [padEnd("text", 7) + shown, padEnd("bytes", 7) + bytes].join("\n");
}

const explain = (lines: string[], text: string) => [...lines, "", strip(text)].join("\n");

// ─── The same two lines, ended three ways ───────────────────────────────────

export const endingFiles: CodeFile[] = [
  {
    path: "lf.txt",
    content: explain(
      ["Two lines, each ended by one LF.", "This is what macOS and Linux write, and what most tools expect."],
      "Hello\nWorld\n",
    ),
  },
  {
    path: "crlf.txt",
    content: explain(
      ["Two lines, each ended by CR then LF: two bytes where LF has one.", "This is the traditional Windows ending."],
      "Hello\r\nWorld\r\n",
    ),
  },
  {
    path: "cr.txt",
    content: explain(
      ["Two lines, each ended by a lone CR.", "Old Mac OS (before OS X) wrote this. Nothing writes it today."],
      "Hello\rWorld\r",
    ),
  },
  {
    path: "no-final-newline.txt",
    content: explain(
      ["The same text with no ending after the last line.", "The file stops right after the d."],
      "Hello\nWorld",
    ),
  },
];

// ─── Looking at the real bytes ──────────────────────────────────────────────

export const lookFiles: CodeFile[] = [
  {
    path: "cat-ve.txt",
    content: `$ cat -ve public/tool-logos/lua.svg | head -1
<?xml version="1.0" encoding="utf-8"?>^M$

$ cat -ve src/components/site/footer.module.css | head -3
@reference "../../app/globals.css";$
$
/* full-width band under the page shell */$

cat -ve prints $ where every line ends, and ^M for a CR.
A CRLF file shows ^M$ at the end of its lines. An LF file shows only $.`,
  },
  {
    path: "xxd.txt",
    content: `$ xxd public/tool-logos/lua.svg | head -3
00000000: 3c3f 786d 6c20 7665 7273 696f 6e3d 2231  <?xml version="1
00000010: 2e30 2220 656e 636f 6469 6e67 3d22 7574  .0" encoding="ut
00000020: 662d 3822 3f3e 0d0a 3c21 2d2d 2047 656e  f-8"?>..<!-- Gen

On the third row, after 3f3e (the ?>), comes 0d0a: a CR then an LF.
The two dots in the right-hand column are those same two bytes,
which have no printable character.`,
  },
  {
    path: "git.txt",
    content: `$ git ls-files --eol public/tool-logos/lua.svg src/components/site/footer.module.css
i/crlf  w/crlf  attr/  public/tool-logos/lua.svg
i/lf    w/lf    attr/  src/components/site/footer.module.css

i/ is what Git has stored. w/ is what is in your working folder.
To count every file by its ending:

$ git ls-files --eol | awk '{print $1, $2}' | sort | uniq -c`,
  },
];

// ─── Changing it, and keeping it that way ───────────────────────────────────

export const settingFiles: CodeFile[] = [
  {
    path: ".gitattributes",
    content: `# Git writes every text file with LF, whatever the machine that checked it out
* text=auto eol=lf`,
  },
  {
    path: ".editorconfig",
    content: `# Tells editors (VS Code needs the EditorConfig extension) to end lines with LF
root = true

[*]
end_of_line = lf
insert_final_newline = true`,
  },
  {
    path: ".vscode/settings.json",
    content: `{
  "files.eol": "\\n",
  "files.insertFinalNewline": true
}`,
  },
  {
    path: "in-the-editor.txt",
    content: [
      "VS Code, bottom right of the window:",
      "",
      "  LF   <- click this to switch the open file to CRLF, or back",
      "",
      "Or the command palette: Change End of Line Sequence.",
      "",
      "files.eol sets the ending for new files.",
      "files.insertFinalNewline adds the last newline when you save.",
    ].join("\n"),
  },
];

// ─── When it goes wrong ─────────────────────────────────────────────────────

export const wrongFiles: CodeFile[] = [
  {
    path: "script-fails.txt",
    content: `deploy.sh, saved with CRLF:

  #!/bin/bash^M
  echo "deploying"^M

$ ./deploy.sh
-bash: ./deploy.sh: /bin/bash^M: bad interpreter: No such file or directory

The shell reads the first line as the program "/bin/bash" followed by a CR,
and there is no program with that name.`,
  },
  {
    path: "git-diff.txt",
    content: `A file whose only change is its line endings still counts as changed:

$ git diff
-const name = "Jay";^M
+const name = "Jay";

Every line of the file shows as removed and added, and nothing visible differs.
This is what happens when a Windows machine and a Mac edit the same file.`,
  },
  {
    path: "final-newline.txt",
    content: `A file with no final newline, in a diff:

-last line
\\ No newline at end of file
+last line

Git is saying the old version stopped without an ending. It's harmless,
but it makes a one-line change show up as two changed lines.`,
  },
];
