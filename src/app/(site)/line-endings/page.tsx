// goatboat: f779fb24-4118-4dd6-bb90-2956af7dd9ec
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { PageHeader } from "@/components/site/page-header";
import { PageLayout } from "@/components/site/page-layout";
import { Bold, H2, InlineCode, List, ListItem, Muted, Paragraph } from "@/components/typography";
import { endingFiles, lookFiles, settingFiles, wrongFiles } from "./examples";

const cheatSheet = `
| | LF | CRLF | CR |
| --- | --- | --- | --- |
| Name | Line feed | Carriage return + line feed | Carriage return |
| Written as | \`\\n\` | \`\\r\\n\` | \`\\r\` |
| Bytes | \`0a\` | \`0d 0a\` | \`0d\` |
| Used by | macOS, Linux, the web, nearly all tools | Windows, traditionally | Mac OS before OS X |
| Today | The default | Still seen from Windows | Obsolete |
`;

const project = `
| What I found | Count |
| --- | --- |
| Files with LF endings | 352 |
| Files with no line breaks at all (so no ending) | 33 |
| Files that aren't text (images and so on) | 7 |
| Files with CRLF endings | 2 |
| Text files with no final newline | 3 |
`;

/** What a line ending is, how to see one, and when it matters. */
export default function LineEndingsPage() {
  return (
    <PageLayout>
      <PageHeader intro="The invisible character at the end of every line of a text file: what it is, how to see it, and when it matters." />

      <H2>The short version</H2>
      <Paragraph>
        A text file is a long string of bytes. The line breaks you see are one or two of those bytes, placed where a line
        stops. There are two kinds in use today. <Bold>LF</Bold> is one byte, and macOS, Linux and the web use it.{" "}
        <Bold>CRLF</Bold> is two bytes, and Windows traditionally uses it. Your editor draws either as the end of a line,
        so you never see them.
      </Paragraph>
      <MarkdownRenderer source={cheatSheet} />

      <H2>The same two lines, three ways</H2>
      <Paragraph>
        Each file below holds the text "Hello" and "World" on two lines. Under each is the text with its line endings
        written out, and the bytes the file is really made of. Click through the files and compare the last bytes on
        each line.
      </Paragraph>
      <CodeBlock files={endingFiles} />
      <Muted>
        The bytes are in hexadecimal. <InlineCode>48</InlineCode> is H, <InlineCode>0a</InlineCode> is LF and{" "}
        <InlineCode>0d</InlineCode> is CR.
      </Muted>

      <H2>Why there are two</H2>
      <Paragraph>
        The names come from typewriters and teleprinters. Two separate things had to happen to start a new line: the
        carriage returned to the left (CR), and the paper rolled up one line (LF). Early systems sent both. Later
        systems chose differently:
      </Paragraph>
      <List>
        <ListItem>
          <Bold>Unix</Bold>, and so Linux and macOS, kept only LF. One byte is enough to mean "new line".
        </ListItem>
        <ListItem>
          <Bold>DOS and Windows</Bold> kept both, as CRLF. Their file formats and tools grew up around it.
        </ListItem>
        <ListItem>
          <Bold>The old Mac OS</Bold> used a lone CR. It stopped when macOS became Unix underneath.
        </ListItem>
      </List>
      <Paragraph>
        Today the split barely matters. Browsers, editors, compilers and formatters accept either. It only shows up where
        a tool is strict.
      </Paragraph>

      <H2>Looking at the real bytes</H2>
      <Paragraph>
        These commands show a file's line endings. The examples are two real files from this site: an SVG that came with
        Windows endings, and a stylesheet with the usual Mac ones.
      </Paragraph>
      <CodeBlock files={lookFiles} />

      <H2>Changing it, and keeping it that way</H2>
      <Paragraph>
        You can switch a file's ending in the editor. To keep a whole project consistent, tell Git and your editor what
        you want, so a file pasted in from another machine can't bring a different ending along.
      </Paragraph>
      <CodeBlock files={settingFiles} />

      <H2>When it goes wrong</H2>
      <Paragraph>
        Most of the time nothing happens. These are the cases where something does.
      </Paragraph>
      <CodeBlock files={wrongFiles} />
      <List>
        <ListItem>
          <Bold>Shell scripts</Bold> are the one place CRLF fails loudly on a Mac or Linux machine.
        </ListItem>
        <ListItem>
          <Bold>Git diffs</Bold> get noisy when two people's machines disagree. A <InlineCode>.gitattributes</InlineCode>{" "}
          file fixes it for everyone.
        </ListItem>
        <ListItem>
          <Bold>The final newline</Bold> is a convention: every line, including the last, ends with a line ending. Tools
          like Git and <InlineCode>wc</InlineCode> count lines by their endings, so a file without one can read as one
          line short.
        </ListItem>
      </List>

      <H2>What's in this project</H2>
      <Paragraph>
        I checked every file Git tracks. Everything is LF, apart from two SVG logos that came from somewhere else.
      </Paragraph>
      <MarkdownRenderer source={project} />
      <Muted>
        There's no <InlineCode>.gitattributes</InlineCode> or <InlineCode>.editorconfig</InlineCode>. Everything works
        because everything is LF, not because anything makes it so.
      </Muted>
    </PageLayout>
  );
}
